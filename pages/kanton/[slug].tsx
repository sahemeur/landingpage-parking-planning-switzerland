import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { getKantone } from "@/lib/data";
import { sanitizeForUrl } from "@/lib/util";
import { useMemo, useState } from "react";

type UiOrt = { id: number; name: string; plz: string; favorite?: boolean };
type UiGemeinde = { id: string | number; name: string; ortschaften: UiOrt[] };
type UiKanton = { id: string; name: string; gemeinden: UiGemeinde[] };

export const getStaticPaths: GetStaticPaths = async () => {
  const kantone = await getKantone();
  const paths = kantone.map((k: any) => ({
    params: { slug: `${sanitizeForUrl(k.name_de)}_${k.id}` },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const id = slug.split("_").pop();

  const kantone = await getKantone();
  const kantonRaw = kantone.find((k: any) => k.id === id);
  if (!kantonRaw) return { notFound: true };

  // Normalize to a light shape for the page
  const gemeinden: UiGemeinde[] = (kantonRaw.gemeinden || []).map((g: any) => ({
    id: g.id ?? `${kantonRaw.id}-${g.name}`,
    name: g.name,
    ortschaften: (g.ortschaften || []).map((o: any) => ({
      id: o.id,
      name: o.name,
      plz: o.plz,
      favorite: !!o.favorite,
    })),
  }));

  const kanton: UiKanton = {
    id: kantonRaw.id,
    name: kantonRaw.name_de,
    gemeinden,
  };

  return { props: { kanton } };
};

export default function KantonPage({ kanton }: { kanton: UiKanton }) {
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Featured = those that have a favorite Ortschaft (falls back to first 12 alphabetical)
  const featured = useMemo(() => {
    const withFav = kanton.gemeinden.filter((g) =>
      g.ortschaften.some((o) => o.favorite)
    );
    if (withFav.length >= 12) {
      return withFav
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "de"))
        .slice(0, 12);
    }
    const rest = kanton.gemeinden
      .filter((g) => !withFav.includes(g))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
    return [...withFav, ...rest].slice(0, 12);
  }, [kanton.gemeinden]);

  const allSorted = useMemo(
    () => kanton.gemeinden.slice().sort((a, b) => a.name.localeCompare(b.name, "de")),
    [kanton.gemeinden]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return showAll ? allSorted : featured;
    return allSorted.filter((g) => g.name.toLowerCase().includes(t));
  }, [q, showAll, allSorted, featured]);

  return (
    <div className="">
      <Head>
        <title>Kanton {kanton.name} – Gemeinden</title>
        <meta
          name="description"
          content={`Gemeinden im Kanton ${kanton.name}. Wählen Sie eine Gemeinde, um fortzufahren.`}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Kanton {kanton.name}
        </h1>
        <p className="mt-3 text-gray-700">
          Wählen Sie eine Gemeinde oder nutzen Sie die Suche. (Die Startseite
          enthält auch eine globale Suche, wenn Sie direkt eine Ortschaft/PLZ
          eingeben möchten.)
        </p>

        {/* In-page search (only within this Kanton) */}
        <div className="mt-6 max-w-xl">
          <label htmlFor="g-search" className="sr-only">
            Gemeinde suchen
          </label>
          <input
            id="g-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Gemeinde suchen …"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            type="text"
          />
        </div>

        {/* Grid of Gemeinden */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((g) => {
            // choose best Ortschaft page to link to
            const best =
              g.ortschaften.find((o) => o.favorite) ?? g.ortschaften[0];

            const href = best
              ? `/ortschaft/${best.plz}_${sanitizeForUrl(best.name)}_${best.id}`
              : "#";

            return (
              <Link
                key={g.id}
                href={href}
                className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium hover:border-emerald-500 hover:shadow transition"
              >
                {g.name}
              </Link>
            );
          })}
        </div>

        {/* Toggle only shown when not searching */}
        {!q && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-6 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            {showAll ? "Weniger Gemeinden anzeigen" : "Alle Gemeinden anzeigen"}
            <svg
              className={`h-4 w-4 transition-transform ${
                showAll ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
}
