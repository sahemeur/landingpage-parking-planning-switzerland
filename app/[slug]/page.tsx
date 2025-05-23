import { Firma, Ortschaft, PrismaClient } from "@prisma/client";
import { getData } from "./data";
import Link from "next/link";
import { sanitizeForUrl } from "../page";
import Head from "next/head";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await props.params).slug;
  const ortschaftId = +slug.substring(slug.lastIndexOf("_") + 1);
  const { ortschaft } = await getData(ortschaftId);
  return {
    title: `Parkplatz bauen in ${ortschaft.plz} ${ortschaft.name}`,
    description: `Parkplatz bauen in ${ortschaft.plz} ${ortschaft.name}. Angaben zu Kosten, Kostenschätzung, Plannung, Baufirmen, Gemeinde, Bauordnung, Baurecht`,
  };
}

export default async function Gemeinde(props: { params: Promise<{ slug: string }> }) {
  const slug = (await props.params).slug;
  const ortschaftId = +slug.substring(slug.lastIndexOf("_") + 1);
  const { ortschaft, firmen, kanton } = await getData(ortschaftId);

  return (
    <>
      <header className="bg-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-center text-white">
            Parkplatz bauen in {ortschaft.plz} {ortschaft.name}
          </h1>
        </div>
      </header>

      <div>
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="space-y-6 flex-1 mb-4">
              <h1 className="text-2xl font-semibold text-emerald-700">Überblick & Infos</h1>
              <p className="text-md">
                Ein Parkplatz auf dem eigenen Grundstück erfordert Planung: In {ortschaft.gemeinde.name} ist meist eine
                Baubewilligung nötig. Wichtig sind zudem geeignete Materialien (z. B. Rasengittersteine zur Versickerung) sowie
                sichere Zufahrten gemäss Sichtzonen-Vorgaben.
              </p>
              {ortschaft.gemeinde.links.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold ">Weiterführende Links</h2>
                  <ul>
                    {ortschaft.gemeinde.links.map((l) => (
                      <li key={l.id}>
                        <a href={l.url} className="underline" target="_blank">
                          {l.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h1 className="text-2xl font-semibold text-emerald-700">Planung und Umsetzung</h1>
              <p className="text-md">
                Für die Umsetzung können Landschaftsarchitekten, Bauunternehmen oder Gartenbauer beigezogen werden. Eine erste
                Planung inkl. Kostenschätzung erlaubt ein kostenloses Online-Planungstool.
              </p>

              {!firmen.some((f) => f.plannerlink) && (
                <div>
                  <a
                    href="https://demo.heimstein.cloud/xknaj9?zugang=freiflaechenplaner.ch"
                    target="_blank"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Zum Planungstool
                  </a>
                </div>
              )}

              {firmen.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold">Regionale Anbieter</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {firmen.map((f) => (
                      <div className="shadow-md rounded" key={f.id}>
                        <a key={f.id} href={f.webpage} className="p-3 block" target="_blank">
                          {f.name}
                          <br />
                          {f.strasse}
                          <br />
                          {f.plz} {f.ort}
                        </a>
                        {f.plannerlink && (
                          <div className="flex align-middle justify-center p-2">
                            <a
                              href={f.plannerlink}
                              target="_blank"
                              className="flex-1 text-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Zum Planungstool
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <footer className="bg-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2 ">
          <Link href=".." className="underline mr-1 text-xs">
            Zurück
          </Link>
          <h1 className="text-xl font-semibold">Weitere Gemeinden im Kanton {ortschaft.gemeinde.kanton.name_de}</h1>
          <div className="">
            {kanton!.gemeinden.map((g) =>
              g.ortschaften.map((o) => (
                <Link key={o.id} href={`${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`} className="underline mr-1 text-xs">
                  {o.plz} {o.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
