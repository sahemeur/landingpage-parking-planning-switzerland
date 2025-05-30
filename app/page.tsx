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

  const ortschaften = await prisma.ortschaft.findMany({
    select: {
      id: true,
      name: true,
      plz: true,
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-center text-white">Parkplatz bauen in der Schweiz</h1>
        </div>
      </header>

      <main className="py-12 flex-1">
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
          <h1 className="text-xl mt-5 font-semibold">Kantone</h1>
        </div>
      </footer>
    </div>
  );
}
