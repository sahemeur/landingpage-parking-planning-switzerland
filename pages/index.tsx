import OrtschaftenSearch from "@/lib/ortschaft-search";
import Head from "next/head";
import Image from "next/image";

import LandingSections from "@/components/LandingSections";
import BeliebteGemeinden from "@/components/BeliebteGemeinden";

import { getKantone } from "@/lib/data";
import { UiOrtschaft } from "@/lib/model";
import { faqs } from "@/content/home";

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

  return { props: { kantone: indexKantone } };
}

function generateJsonLd(kantone: IndexKanton[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Parkplatz bauen in der Schweiz",
    description:
      "Informationen zu Kostenschätzung, Planung und Umsetzung sowie Baufirmen in der Region.",
    provider: {
      "@type": "LocalBusiness",
      name: "Parkplatz bauen in der Schweiz",
      areaServed: { "@type": "Country", name: "Switzerland" },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gemeinden und Ortschaften",
      itemListElement: kantone.map((k) => ({
        "@type": "OfferCatalog",
        name: `Kanton ${k.name}`,
        itemListElement: k.ortschaften
          .filter((o) => o.favorite)
          .map((o) => ({
            "@type": "Place",
            name: o.name,
            address: {
              "@type": "PostalAddress",
              postalCode: o.plz,
              addressLocality: o.name,
              addressRegion: k.name,
              addressCountry: "CH",
            },
            identifier: o.id.toString(),
          })),
      })),
    },
  };
}

export default function Home({ kantone }: { kantone: IndexKanton[] }) {
  const jsonLd = generateJsonLd(kantone);
  const ortschaften: UiOrtschaft[] = kantone.flatMap((k) => k.ortschaften);

  // Popular (prioritise Zürich, Bern, Genf)
  const allFavs: UiOrtschaft[] = ortschaften.filter((o) => o.favorite);
  const priority = new Set(["Zürich", "Bern", "Genf"]);
  const priorityFavs = kantone
    .filter((k) => priority.has(k.name))
    .flatMap((k) => k.ortschaften.filter((o) => o.favorite));

  const dedup = new Map<number, UiOrtschaft>();
  [...priorityFavs, ...allFavs].forEach((o) => {
    if (!dedup.has(o.id)) dedup.set(o.id, o);
  });
  const orderedFavs = Array.from(dedup.values());
  const visiblePopular = orderedFavs.slice(0, 10);
  const morePopular = orderedFavs.slice(10);

  return (
    <div>
      <Head>
        <title>Parkplatz bauen in der Schweiz</title>
        <meta
          name="description"
          content="Parkplatz bauen in der Schweiz. Informationen zu Kostenschätzung, Planung und Umsetzung sowie Baufirmen in der Region."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        
        {/* FAQ structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </Head>

      {/* Hero */}
      <header className="relative min-h-[56vh]">
        <Image src="/images/stone-patio1.jpg" alt="Steinplatten" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="py-14 lg:py-24 grid lg:grid-cols-[minmax(0,740px)_1fr] items-center gap-12">
              <div className="w-full max-w-[740px]">
                <h1 className="text-white font-bold tracking-tight leading-tight text-4xl sm:text-5xl md:text-6xl">
                  Parkplatz bauen in der Schweiz
                </h1>
                <h2 className="mt-4 text-white font-semibold text-xl sm:text-2xl md:text-3xl">
                  So bauen Sie Ihren Parkplatz richtig
                </h2>
                <p className="mt-5 text-white/95 text-base sm:text-lg leading-relaxed text-justify">
                  Von der Planung über die Ausführung bis zu den lokalen Vorschriften – hier finden Sie,
                  worauf Sie beim Bau oder der Sanierung eines privaten Parkplatzes achten müssen.
                  Inklusive Infos zu Ihrer Gemeinde und passenden Firmen in der Nähe.
                </p>

                <div className="mt-6">
                  <div className="relative">
                    <OrtschaftenSearch ortschaften={ortschaften} />
                  </div>
                </div>
              </div>

              {/* Empty right column to keep spacing on large screens */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200" />

      <LandingSections />

      <BeliebteGemeinden items={visiblePopular} moreItems={morePopular} />
    </div>
  );
}

