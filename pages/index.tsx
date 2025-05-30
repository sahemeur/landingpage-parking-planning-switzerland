import OrtschaftenSearch from "@/lib/ortschaft-search";
import Link from "next/link";
import { getKantone } from "../lib/data";
import { UiOrtschaft } from "../lib/model";
import { sanitizeForUrl } from "../lib/util";
import Head from "next/head";

export async function getStaticProps(): Promise<{ props: { kantone: IndexKanton[] } }> {
  const kantone = await getKantone();
  kantone.sort(
    (a, b) =>
      b.gemeinden.flatMap((g) => g.ortschaften).filter((o) => o.favorite).length -
      a.gemeinden.flatMap((g) => g.ortschaften).filter((o) => o.favorite).length
  );

  const indexKantone: IndexKanton[] = kantone.map((k) => ({
    id: k.id,
    name: k.name_de,
    ortschaften: k.gemeinden.flatMap((g) =>
      g.ortschaften.map((o) => ({
        id: o.id,
        name: o.name,
        plz: o.plz,
        favorite: o.favorite || false,
      }))
    ),
  }));

  return {
    props: { kantone: indexKantone },
  };
}

interface IndexKanton {
  id: string;
  name: string;
  ortschaften: {
    id: number;
    name: string;
    plz: string;
    favorite: boolean;
  }[];
}

export default function Home(props: { kantone: IndexKanton[] }) {
  const { kantone } = props;
  const ortschaften: UiOrtschaft[] = kantone.flatMap((k) => k.ortschaften);
  return (
    <div className="">
      <header className="bg-emerald-800 shadow-md">
        <Head>
          <title>Parkplatz bauen in der Schweiz</title>
          <meta
            name="description"
            content={`Parkplatz bauen in der Schweiz. Informationen zu Kostenschätzung, Planung und Umsetzung sowie Baufirmen in der Region.`}
          />
        </Head>
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
              <h1 className="text-md mt-5 font-semibold">{k.name}</h1>
              <div>
                {k.ortschaften
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
