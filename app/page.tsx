import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import { sanitizeForUrl } from "./_util";
import OrtschaftenSearch from "./ortschaft-search";

const prisma = new PrismaClient();

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return {
    title: `Parkplatz bauen in der Schweiz`,
    description: `Parkplatz bauen in der Schweiz. Angaben zu Kosten, Kostenschätzung, Plannung, Baufirmen, Gemeinde, Bauordnung, Baurecht`,
  };
}

export default async function Home() {
  const kantone = await prisma.kanton.findMany({
    include: {
      gemeinden: {
        include: {
          ortschaften: true,
        },
      },
    },
  });

  kantone.sort(
    (a, b) =>
      b.gemeinden.flatMap((g) => g.ortschaften).filter((o) => o.favorite).length -
      a.gemeinden.flatMap((g) => g.ortschaften).filter((o) => o.favorite).length
  );

  const ortschaften = await prisma.ortschaft.findMany({
    select: {
      id: true,
      name: true,
      plz: true,
    },
  });

  return (
    <div className="">
      <header className="bg-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-center text-white">Parkplatz bauen in der Schweiz</h1>
        </div>
      </header>

      <main className="py-12 min-h-[40rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="space-y-6 flex-1 mb-4">
            <h1 className="text-2xl font-semibold text-emerald-700">So bauen Sie Ihren Parkplatz richtig</h1>
            <p>
              Von der Planung über die Ausführung bis zu den lokalen Vorschriften – hier erfahren Sie, worauf Sie beim Bau oder
              der Sanierung eines privaten Parkplatzes achten müssen. Inklusive Infos zu Ihrer Gemeinde und passenden Firmen in
              der Nähe.
            </p>
            <OrtschaftenSearch ortschaften={ortschaften} />
          </section>
        </div>
      </main>

      <footer className="bg-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2 ">
          <h1 className="text-xl mt-5 font-semibold">Parkplatz bauen in anderen Gemeinden</h1>
          {kantone.map((k) => (
            <div key={k.id}>
              <h1 className="text-md mt-5 font-semibold">{k.name_de}</h1>
              <div>
                {k.gemeinden
                  .flatMap((g) => g.ortschaften)
                  .filter((o) => o.favorite)
                  .map((o) => (
                    <Link
                      key={o.id}
                      href={`ortschaft/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`}
                      className="underline mr-1 text-xs"
                    >
                      {o.plz} {o.name}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
