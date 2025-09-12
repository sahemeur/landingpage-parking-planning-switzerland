import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getData, getDataByPlzAndName, getKantone } from "@/lib/data";
import { UiFirma, UiGemeinde, UiKanton, UiOrtschaft } from "@/lib/model";
import { sanitizeForUrl } from "@/lib/util";
import { tool } from "@/content/home";

// --- Static paths / props ---
export async function getStaticPaths() {
  const kantone = await getKantone();
  const ortschaften = kantone.flatMap((k) => k.gemeinden.flatMap((g) => g.ortschaften));
  const paths = ortschaften.map((o) => ({
    params: { slug: `${o.plz}_${sanitizeForUrl(o.name)}` },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps(context: { params: { slug: string } }): Promise<{ props: GemeindeProps }> {
  const { slug } = context.params;

  // Parse PLZ and name from slug (format: "8052_Zuerich")
  const parts = slug.split("_");
  if (parts.length < 2) {
    throw new Error(`Invalid slug format: ${slug}`);
  }

  const plz = parts[0];
  const name = parts.slice(1).join("_"); // Handle names with underscores

  const data = await getDataByPlzAndName(plz, name, 30);
  if (!data) {
    throw new Error(`No ortschaft found for PLZ: ${plz}, Name: ${name}`);
  }

  return { props: data };
}

// --- Types ---
interface GemeindeProps {
  ortschaft: UiOrtschaft;
  gemeinde: UiGemeinde;
  firmen: UiFirma[];
  kanton: UiKanton;
}

export default function Gemeinde(props: GemeindeProps) {
  const { ortschaft, gemeinde, firmen, kanton } = props;

  const heroImg = "/images/gemeinde_img.jpg";
  const NAVY = "#0B3D56";

  // --- Partners vs Others ---
  const partners = (firmen || []).filter((f) => !!f.plannerlink).sort((a, b) => a.name.localeCompare(b.name));

  const others = (firmen || []).filter((f) => !f.plannerlink).sort((a, b) => a.name.localeCompare(b.name));

  type ProviderCardProps = { f: UiFirma; isPartner: boolean };

  const ProviderCard = ({ f, isPartner }: ProviderCardProps) => {
    const NAVY = "#0B3D56";
    const BRAND_GREEN = "#16A34A"; // green for emphasized Planungstool
    const logoSrc = f.logo;

    // keep last word & street number from breaking badly
    const nameTight = (f.name || "").replace(/\s+(\S+)$/, "\u00A0$1");
    const streetTight = (f.strasse || "").replace(/\s+(\d[\w\-]*?)$/, "\u00A0$1");

    // --- PARTNER (has logo + planner) ---
    if (isPartner && logoSrc) {
      return (
        <div
          className="relative h-full rounded-2xl border px-6 py-5 shadow-sm overflow-visible border-[--partner-border] bg-[--partner-bg]"
          style={{ ["--partner-border" as any]: NAVY, ["--partner-bg" as any]: `${NAVY}0D` }}
        >
          <div className="grid gap-6 grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            {/* LEFT: LOGO */}
            <div className="flex items-center justify-center">
              <div className="relative w-full h-24 md:h-28 lg:h-32">
                <Image src={logoSrc} alt={`${f.name} Logo`} fill className="object-contain" sizes="33vw" />
              </div>
            </div>

            {/* RIGHT: name, address, buttons */}
            <div className="min-w-0 pr-2">
              <div className="text-slate-900 font-semibold text-[17px] leading-6">{nameTight}</div>
              <div className="mt-1 text-slate-700 text-sm leading-6">{streetTight}</div>
              <div className="text-slate-700 text-sm leading-6">
                {f.plz} {f.ort}
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                {f.webpage && (
                  <a
                    href={f.webpage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                  >
                    Website
                  </a>
                )}
                {f.plannerlink && (
                  <a
                    href={f.plannerlink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                    style={{ backgroundColor: BRAND_GREEN }} //* <- GREEN for partners */
                  >
                    Planungstool
                  </a>
                )}
                {!f.plannerlink && f.mail && (
                  <a
                    href={`mailto:${f.mail}`}
                    className="inline-flex items-center rounded-md bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 whitespace-nowrap"
                  >
                    E-Mail
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- NON-PARTNER ---
    return (
      <div className="h-full rounded-xl border border-slate-200 bg-white px-4 py-3 md:px-5 md:py-4 hover:shadow-sm transition-shadow">
        {/* Row layout reduces empty bottom area; buttons sit to the right on md+ */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* LEFT: text block */}
          <div className="min-w-0">
            <div className="text-slate-900 font-semibold leading-6">{nameTight}</div>
            <div className="mt-0.5 text-slate-700 text-sm leading-5">
              <div className="truncate">{streetTight}</div>
              <div className="truncate">
                {f.plz} {f.ort}
              </div>
            </div>
          </div>

          {/* RIGHT: actions */}
          <div className="flex gap-2 md:self-center">
            {f.webpage && (
              <a
                href={f.webpage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
              >
                Website
              </a>
            )}
            {f.mail && (
              <a
                href={`mailto:${f.mail}`}
                className="inline-flex items-center rounded-md bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 whitespace-nowrap"
              >
                E-Mail
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Links / rail ---
  const plannerHref = firmen.find((f) => !!f.plannerlink)?.plannerlink || "https://heimstein.heimstein.cloud";

  const richtlinienHref = gemeinde.links.find((l) => /richtlinie|gemeinde/i.test(l.name))?.url || gemeinde.links[0]?.url || "#";

  const stadtHref = gemeinde.links.find((l) => /stadtverwaltung|^gemeinde(?!.*richtlinie)|verwaltung/i.test(l.name))?.url;

  const emphasizePlanner = firmen.length === 0;

  const railItems = [
    { label: "Planen Sie Ihren Parkplatz", href: plannerHref },
    { label: `Richtlinien der Gemeinde ${gemeinde.name}`, href: richtlinienHref },
    ...(stadtHref ? [{ label: `Stadtverwaltung ${gemeinde.name}`, href: stadtHref }] : []),
  ];

  // --- JSON-LD ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `Parkplatz bauen in ${ortschaft.plz} ${ortschaft.name}`,
    address: {
      "@type": "PostalAddress",
      postalCode: ortschaft.plz,
      addressLocality: ortschaft.name,
      addressRegion: kanton.name_de,
      addressCountry: "CH",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: gemeinde.name,
      url: gemeinde.links.length > 0 ? gemeinde.links[0].url : undefined,
    },
    description: `Informationen zu Kostenschätzung, Planung und Umsetzung sowie Baufirmen in der Region ${gemeinde.name}.`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Regionale Anbieter",
      itemListElement: firmen.map((f) => ({
        "@type": "LocalBusiness",
        name: f.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: f.strasse,
          postalCode: f.plz,
          addressLocality: f.ort,
          addressCountry: "CH",
        },
        url: f.webpage || undefined,
        email: f.mail || undefined,
      })),
    },
  };

  // Filter remaining links not promoted to rail
  const promoted = new Set([richtlinienHref, stadtHref].filter(Boolean) as string[]);
  const remainingLinks = gemeinde.links.filter((l) => !promoted.has(l.url));

  // Favorites in same canton
  const cantonFavorites = kanton.gemeinden.flatMap((g) => g.ortschaften).filter((o) => o.favorite);

  // Tool promo (when no providers)
  const ToolPromo = ({ plannerHref }: { plannerHref: string }) => (
    <section className="mt-6">
      <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200">
        <iframe
          src={tool.videoSrc}
          title="Freiflächenplaner - Kurzdemo"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="mt-4">
        <a
          href={plannerHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          style={{ backgroundColor: NAVY }}
        >
          Planung starten
        </a>
      </div>
    </section>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* HEAD meta / JSON-LD */}
      <Head>
        <title>{`Parkplatz bauen in ${ortschaft.plz} ${ortschaft.name}`}</title>
        <meta
          name="description"
          content={`Parkplatz bauen in ${ortschaft.plz} ${ortschaft.name}. Informationen zu Kostenschätzung, Planung und Umsetzung sowie Baufirmen in der Region.`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* HERO */}
      <header className="relative min-h-[40vh] sm:min-h-[46vh] md:min-h-[52vh]">
        <Image src={heroImg} alt={`${ortschaft.plz} ${ortschaft.name}`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-white font-bold leading-tight text-4xl sm:text-5xl md:text-6xl">
                Parkplatz bauen in
                <br />
                {ortschaft.plz} {ortschaft.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-3 pb-0">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-slate-500">
              <li>
                <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-700 focus-visible:outline-none">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      d="M12.75 15.25 7.5 10l5.25-5.25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Startseite
                </Link>
              </li>
              {/* optional current page crumb (kept small & muted) */}
              <li className="hidden sm:block text-slate-400"></li> {/* separator */}
              <li className="hidden sm:block text-slate-600"></li> {/* optional: "Gemeinde"?? */}
            </ol>
          </nav>
        </div>
      </div>

      {/* CONTENT + STICKY RAIL */}
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-2 pb-10 lg:pt-3 lg:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          {/* LEFT */}
          <article className="min-w-0 order-1">
            <section className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold text-slate-900">Das sollten Sie wissen</h2>
              <p className="text-[17px] leading-7 text-slate-800">
                In {kanton.name_de} benötigen die meisten privaten Parkplatzprojekte eine Baubewilligung. Zuständig ist die
                Bauverwaltung der Gemeinde. Typische Anforderungen:
              </p>
              <ul className="list-disc pl-5 text-[17px] leading-7 text-slate-800">
                <li>Wasserdurchlässige Materialien (z. B. Rasengittersteine) zur Einhaltung der Entwässerungsvorschriften.</li>
                <li>Sichere Zufahrt gemäss Vorgaben zu Sichtzonen.</li>
                <li>Einhaltung örtlicher Bauzonenbestimmungen und Umweltschutzauflagen.</li>
              </ul>

              {remainingLinks.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-slate-900">Weiterführende Links</h3>
                  <ul className="space-y-1">
                    {remainingLinks.map((l) => (
                      <li key={l.id}>
                        <a href={l.url} target="_blank" rel="noreferrer" className="text-slate-900 underline hover:opacity-90">
                          {l.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <section className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold text-slate-900">Planung und Umsetzung</h2>
              <p className="text-[17px] leading-7 text-slate-800">
                Für die Umsetzung können Landschaftsarchitekten, Bauunternehmen oder Gartenbauer beigezogen werden. Eine erste
                Planung inkl. Kostenschätzung erlaubt ein kostenloses Online-Planungstool.
              </p>
            </section>

            {/* Providers / tool promo */}
            {firmen.length === 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-slate-900">Planung und Umsetzung</h2>
                <p className="text-[17px] leading-7 text-slate-800">
                  In Ihrer Region liegen uns derzeit keine verifizierten Anbieter vor. Starten Sie die Planung jetzt mit unserem
                  kostenlosen Online-Tool - inklusive Kostenschätzung.
                </p>
                <ToolPromo plannerHref={plannerHref} />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-slate-900 mb-5 md:mb-7">Regionale Anbieter</h2>

                {partners.length > 0 && (
                  <>
                    <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {partners.map((f) => (
                        <ProviderCard key={`partner-${f.id}`} f={f} isPartner />
                      ))}
                    </div>
                  </>
                )}

                {others.length > 0 && (
                  <>
                    {partners.length > 0 && <hr className="my-6 border-slate-200" />}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {others.map((f) => (
                        <ProviderCard key={`other-${f.id}`} f={f} isPartner={false} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </article>

          {/* RIGHT rail */}
          <aside className="mt-8 lg:mt-0 lg:-mr-6 order-2">
            <div className="lg:sticky lg:top-24 bg-slate-50 border border-slate-200 lg:border-l lg:border-t-0 lg:border-r-0 lg:border-b-0 rounded-xl lg:rounded-l-xl lg:rounded-r-none p-5 shadow-sm">
              <nav className="space-y-3">
                {railItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={[
                      "block w-full rounded-md px-5 py-3 font-semibold text-white shadow hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      emphasizePlanner && i === 0 ? "ring-2 ring-offset-2" : "",
                    ].join(" ")}
                    style={{ backgroundColor: NAVY }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>

        {/* Bottom: Gemeinden in the same canton */}
        <section className="bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <h2 className="text-xl font-semibold text-slate-900">Weitere Gemeinden im Kanton {kanton.name_de}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {cantonFavorites.map((o) => (
                <Link
                  key={o.id}
                  href={`/${o.plz}_${sanitizeForUrl(o.name)}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-slate-400 hover:shadow-sm"
                >
                  {o.plz} {o.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
