import { Firma, Ortschaft, PrismaClient } from "@prisma/client";
import { getDistance } from "geolib";

const prisma = new PrismaClient();
export default async function Gemeinde(props: { params: Promise<{ slug: string }> }) {
  const slug = (await props.params).slug;
  const ortschaftId = +slug.substring(slug.lastIndexOf("_") + 1);
  const ortschaft = (await prisma.ortschaft.findUnique({ where: { id: ortschaftId } }))!;
  const firmen = await closeFirmen(30 * 1000, ortschaft.plz);

  return (
    <main>
      <h1 className="text-5xl font-extrabold dark:text-white mb-2">
        Parkplatz bauen in {ortschaft.plz} {ortschaft.name}
      </h1>

      <a href="https://demo.heimstein.cloud">Zum Freiflächenplaner</a>

      <h2 className="text-2xl mb-2">Firmen in ihrere Nähe</h2>
      <hr />
      {firmen.map((f) => (
        <div key={f.id} className="mb-1 pd-1">
          {f.name} <br />
          {f.plz} {f.ort} <br />
          {f.webpage && <a href={f.webpage}>{f.webpage}</a>}
          <hr />
        </div>
      ))}
    </main>
  );
}

type FirmaWithDistance = Firma & { distance: number };

async function closeFirmen(maxDistance: number, plz: string): Promise<FirmaWithDistance[]> {
  const ortschaften = await prisma.ortschaft.findMany();
  const byPlz = ortschafByPlz(ortschaften);

  const query = byPlz.get(plz);
  if (!query) {
    return [];
  }
  const queryCoordinates = coordinateFromOrtschaft(query);

  const firmen = await prisma.firma.findMany();
  const firmenWithDistance = firmen
    .map((firma) => {
      const ortschaft = byPlz.get(firma.plz)!;
      if (!ortschaft) {
        return { ...firma, distance: Number.MAX_VALUE };
      } else {
        const coord = coordinateFromOrtschaft(ortschaft);
        const distance = getDistance(queryCoordinates, coord);
        return { ...firma, distance };
      }
    })
    .filter((f) => f.distance <= maxDistance);
  firmenWithDistance.sort((a, b) => a.distance - b.distance);
  return firmenWithDistance.slice(0, 5);
}

function coordinateFromOrtschaft(ortschaft: Ortschaft) {
  return { latitude: ortschaft.n.toNumber(), longitude: ortschaft.e.toNumber() };
}

function ortschafByPlz(ortschaften: Ortschaft[]): Map<string, Ortschaft> {
  const result = new Map<string, Ortschaft>();
  ortschaften.forEach((o) => {
    result.set(o.plz, o);
  });
  return result;
}
