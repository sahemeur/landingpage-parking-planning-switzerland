import { Firma, Ortschaft, PrismaClient } from "@prisma/client";
import { getDistance } from "geolib";
type FirmaWithDistance = Firma & { distance: number };

const prisma = new PrismaClient();

export async function getData(ortschaftId: number) {
  const ortschaft = (await prisma.ortschaft.findUnique({
    where: { id: ortschaftId },
    include: { gemeinde: { include: { kanton: true, links: true } } },
  }))!;
  const firmen = await closeFirmen(30 * 1000, ortschaft.plz);
  const kanton = await prisma.kanton.findUnique({
    where: { id: ortschaft.gemeinde.kanton_id },
    include: { gemeinden: { include: { ortschaften: true } } },
  })!;
  return { ortschaft, firmen, kanton };
}

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

  firmenWithDistance
    .sort((a, b) => {
      return a.distance - b.distance;
    })
    .sort((a, b) => {
      return (a.plannerlink ? 0 : 1) - (b.plannerlink ? 0 : 1);
    });
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
