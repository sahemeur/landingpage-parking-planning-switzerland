import { Firma, Ortschaft, PrismaClient } from "@prisma/client";
import { getData } from "./data";
import Link from "next/link";
import { sanitizeForUrl } from "../page";

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex gap-2">
            <section className="space-y-6 flex-1 mb-4">
              <h1 className="text-2xl font-semibold text-emerald-700">Parkplatz auf dem eigenen Grundstück planen</h1>
              <p className="text-lg">
                Ob Neubau, Sanierung oder Umgestaltung: Wer auf seinem Grundstück einen Parkplatz erstellen möchte, steht vor
                verschiedenen Überlegungen. Diese Seite bietet Ihnen einen neutralen Überblick über die wichtigsten Aspekte der
                Planung und Umsetzung.
              </p>

              <h1 className="text-2xl font-semibold text-emerald-700">Was ist bei der Planung eines Parkplatzes zu beachten?</h1>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Baubewilligung:</strong> In {ortschaft.gemeinde.name} ist für das Erstellen eines Parkplatzes in der
                  Regel eine Baubewilligung erforderlich. Es empfiehlt sich, frühzeitig mit der zuständigen Baubehörde Kontakt
                  aufzunehmen.
                </li>
                <li>
                  <strong>Materialwahl und Entwässerung:</strong> Die Auswahl des Belags beeinflusst sowohl die Optik als auch die
                  Funktionalität Ihres Parkplatzes. In vielen Gemeinden im Kanton {ortschaft.gemeinde.kanton.name_de} wird ein
                  versickerungsfähiger Belag, wie z. B. Rasengittersteine oder Pflaster mit offenen Fugen, bevorzugt, um die
                  natürliche Versickerung von Regenwasser zu ermöglichen.
                </li>
                <li>
                  <strong>Zufahrt und Sichtverhältnisse:</strong> Die Zufahrt zum Parkplatz muss verkehrssicher gestaltet sein.
                  Sichtzonen gemäss den kantonalen Vorgaben sind einzuhalten, um eine sichere Ein- und Ausfahrt zu gewährleisten.
                </li>
              </ul>

              <h1 className="text-2xl font-semibold text-emerald-700">Wer kann bei der Umsetzung helfen?</h1>
              <p className="text-lg">
                Je nach Komplexität des Projekts können folgende Fachpersonen und Unternehmen involviert sein:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Landschaftsarchitekten:</strong> Für die Planung und Gestaltung des Parkplatzes im Einklang mit dem
                  bestehenden Garten oder Vorplatz.
                </li>
                <li>
                  <strong>Bauunternehmen:</strong> Für die Ausführung der Bauarbeiten, inklusive Erdarbeiten und Belagsarbeiten.
                </li>
                <li>
                  <strong>Garten- und Landschaftsbauer:</strong> Für die Integration des Parkplatzes in die bestehende Umgebung
                  und Bepflanzung.
                </li>
              </ul>

              <h1 className="text-2xl font-semibold text-emerald-700">Was kostet ein Parkplatz?</h1>
              <p className="text-lg">
                Die Kosten für einen privaten Parkplatz können je nach Grösse, Materialwahl und örtlichen Gegebenheiten variieren.
                Für eine erste Orientierung steht Ihnen ein kostenloses, anonymes Planungstool zur Verfügung, das Ihnen eine
                unverbindliche Kostenschätzung bietet.
              </p>
              <p className="text-lg text-gray-700">
                <strong>Funktionen des Tools:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Skizzieren Sie Ihren geplanten Parkplatz direkt auf einer Karte.</li>
                <li>Erhalten Sie eine automatische Kostenschätzung basierend auf Ihrer Skizze.</li>
                <li>Nutzen Sie integrierte Hinweise und Empfehlungen während der Planung.</li>
                <li>Verwenden Sie das Tool bequem auf Smartphone, Tablet oder Computer.</li>
              </ul>
              <a
                href="https://demo.heimstein.cloud/xknaj9?zugang=freiflaechenplaner.ch"
                target="_blank"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Zum Planungstool
              </a>
            </section>
            <section className="pt-6 md:pl-6 md:border-l-1 md:border-t-0  border-t-1 border-gray-200 space-y-2">
              {ortschaft.gemeinde.links.length > 0 && (
                <>
                  <h1 className="font-semibold">Hilfreiche Links</h1>
                  <ul className="list-disc pl-5 space-y-2">
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
              {firmen.length > 0 && (
                <>
                  <h1 className="font-semibold mt-8">Lokale Firmen</h1>
                  <ul className="list-disc pl-5 space-y-2">
                    {firmen.map((f) => (
                      <li key={f.id}>
                        <a href={f.webpage} className="underline" target="_blank">
                          {f.name}
                          <br />
                          {f.strasse}
                          <br />
                          {f.plz} {f.ort}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <footer className="bg-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2 ">
          <h1 className="text-xl font-semibold">Weitere Parkplätze in {ortschaft.gemeinde.kanton.name_de}</h1>
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
