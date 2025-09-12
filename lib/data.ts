import { Ortschaft, PrismaClient } from "@prisma/client";
import { getDistance } from "geolib";
import { UiFirma, UiGemeinde, UiKanton, UiOrtschaft } from "./model";
import { sanitizeForUrl } from "./util";

const prisma = new PrismaClient();

export async function getKantone(): Promise<UiKanton[]> {
  const kantone = await prisma.kanton.findMany({
    include: {
      gemeinden: {
        include: {
          links: true,
          ortschaften: true,
        },
      },
    },
  });
  const uiKantone: UiKanton[] = kantone.map((k) => ({
    id: k.id,
    name_de: k.name_de,
    name_fr: k.name_fr,
    name_it: k.name_it,
    gemeinden: k.gemeinden.map((g) => ({
      id: g.id,
      name: g.name,
      kanton_id: g.kanton_id,
      ortschaften: g.ortschaften.map((o) => ({
        id: o.id,
        name: o.name,
        plz: o.plz,
        favorite: o.favorite,
      })),
      links: g.links.map((l) => ({
        id: l.id,
        name: l.name,
        url: l.url,
        gemeinde_id: l.gemeinde_id,
      })),
    })),
  }));

  return uiKantone;
}

export async function getData(
  ortschaftId: number,
  firmaRadiusKm: number
): Promise<{
  ortschaft: UiOrtschaft;
  gemeinde: UiGemeinde;
  firmen: UiFirma[];
  kanton: UiKanton;
}> {
  const kantone = await getKantone();
  const kanton = kantone.find((k) => k.gemeinden.some((g) => g.ortschaften.some((o) => o.id === ortschaftId)))!;
  const gemeinde = kanton.gemeinden.find((g) => g.ortschaften.some((o) => o.id === ortschaftId))!;
  const ortschaft = gemeinde.ortschaften.find((o) => o.id === ortschaftId)!;
  const firmen = await closeFirmen(firmaRadiusKm * 1000, ortschaft.plz);
  return { ortschaft, gemeinde, firmen, kanton };
}

export async function getDataByPlzAndName(
  plz: string,
  name: string,
  firmaRadiusKm: number
): Promise<{
  ortschaft: UiOrtschaft;
  gemeinde: UiGemeinde;
  firmen: UiFirma[];
  kanton: UiKanton;
} | null> {
  const kantone = await getKantone();

  for (const kanton of kantone) {
    for (const gemeinde of kanton.gemeinden) {
      for (const ortschaft of gemeinde.ortschaften) {
        // Try exact match first, then try sanitized match
        if (ortschaft.plz === plz && (ortschaft.name === name || sanitizeForUrl(ortschaft.name) === name)) {
          const firmen = await closeFirmen(firmaRadiusKm * 1000, ortschaft.plz);
          return { ortschaft, gemeinde, firmen, kanton };
        }
      }
    }
  }

  return null;
}

async function closeFirmen(maxDistance: number, plz: string): Promise<UiFirma[]> {
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

  return firmenWithDistance.slice(0, 5).map((f) => ({
    id: f.id,
    name: f.name,
    strasse: f.strasse,
    postfach: f.postfach,
    plz: f.plz,
    ort: f.ort,
    mail: f.mail,
    webpage: f.webpage,
    plannerlink: f.plannerlink ?? undefined,
    logo: f.logo ?? "",
    sprache: f.sprache,
  }));
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
