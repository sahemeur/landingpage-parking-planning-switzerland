import { Metadata } from "next";
import Link from "next/link";
import { getData } from "./data";
import { sanitizeForUrl } from "../../_util";

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

  const hasPannerLink = firmen.some((f) => f.plannerlink);

  return (
    <div className="bg-emerald-200 min-h-screen">
      <header className="bg-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-center text-white">
            Parkplatz bauen in {ortschaft.plz} {ortschaft.name}
          </h1>
        </div>
      </header>

      <main className="py-12 bg-white">
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

            {!hasPannerLink && (
              <div>
                <a
                  href="https://demo.heimstein.cloud?zugang=freiflaechenplaner.ch"
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
                      <a key={f.id} href={f.webpage} className=" flex gap-3 p-3" target="_blank">
                        <div className="flex-1">
                          {f.name}
                          <br />
                          {f.strasse}
                          <br />
                          {f.plz} {f.ort}
                        </div>

                        <div className="flex flex-col justify-center">
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="2"
                              d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                      </a>
                      {f.plannerlink ? (
                        <div className="flex align-middle justify-center p-2">
                          <a
                            href={f.plannerlink}
                            target="_blank"
                            className="flex-1 text-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Zum Planungstool
                          </a>
                        </div>
                      ) : (
                        <div className="flex align-middle justify-center p-2">
                          <a
                            href={`mailto:${f.mail}`}
                            target="_blank"
                            className="flex-1 text-center rounded-md bg-gray-300 px-3.5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            E-Mail
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

      <footer className="bg-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2 ">
          <Link href=".." className="underline mr-1text-xs">
            Zurück
          </Link>
          <h1 className="text-xl mt-5 font-semibold">Weitere Gemeinden im Kanton {ortschaft.gemeinde.kanton.name_de}</h1>
          <div className="">
            {kanton!.gemeinden
              .flatMap((g) => g.ortschaften)
              .map((o) => (
                <Link
                  key={o.id}
                  href={`/ortschaft/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`}
                  className="underline mr-1 text-xs"
                >
                  {o.plz} {o.name}
                </Link>
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
