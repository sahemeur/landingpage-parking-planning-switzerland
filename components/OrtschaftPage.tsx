import Image from "next/image";
import Link from "next/link";

const ACCENT = "#0F3C5C";
const TINT = "#F5F7FA";

export type KeyLink = { label: string; href: string };
export type Provider = {
  name: string;
  street?: string;
  zip?: string;
  city?: string;
  website?: string;
  email?: string;
  logoUrl?: string;
  planningHref?: string; // CTA to your planning tool when available
};

export type OrtschaftPageProps = {
  // header
  title: string;              // e.g. "Parkplatz bauen in 3172 Niederwangen b. Bern"
  breadcrumb?: { label: string; href?: string }[];

  // intro / facts
  intro?: string;             // short paragraph under “Das sollten Sie wissen”
  facts?: string[];           // bullet list

  // right-side useful links (Kanton/Gemeinde/sichtzonen etc.)
  quickLinks?: KeyLink[];

  // planning text blocks
  planningLead?: string;      // brief intro paragraph
  planningBullets?: string[]; // ✓ bullets

  // video (optional)
  videoSrc?: string;
  videoPoster?: string;
  videoCtaHref?: string;
  videoCtaLabel?: string;

  // providers (can be empty)
  providers?: Provider[];

  // “more” links within the canton
  cantonMoreTitle?: string;   // e.g. "Weitere Gemeinden im Kanton Bern"
  cantonMore?: { label: string; href: string }[];

  backHref?: string;          // “Zurück”
};

export default function OrtschaftPage({
  title,
  breadcrumb = [],
  intro,
  facts = [],
  quickLinks = [],
  planningLead,
  planningBullets = [],
  videoSrc,
  videoPoster,
  videoCtaHref,
  videoCtaLabel = "Planung starten",
  providers = [],
  cantonMoreTitle,
  cantonMore = [],
  backHref = "/",
}: OrtschaftPageProps) {
  return (
    <main>
      {/* Hero */}
      <header className="relative">
        <div className="bg-[url('/images/stone-patio1.jpg')] bg-cover bg-center">
          <div className="bg-black/55">
            <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
              {/* Breadcrumb */}
              {breadcrumb.length > 0 && (
                <nav className="mb-5 text-sm text-white/80">
                  {breadcrumb.map((b, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-2">›</span>}
                      {b.href ? (
                        <Link href={b.href} className="hover:underline">{b.label}</Link>
                      ) : (
                        <span>{b.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
              <h1 className="text-white font-bold tracking-tight leading-tight text-3xl md:text-4xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10">
          {/* Main column */}
          <div className="space-y-10">
            {/* Das sollten Sie wissen */}
            <section id="wissen">
              <h2 className="text-2xl md:text-3xl font-semibold">Das sollten Sie wissen</h2>
              {intro && <p className="mt-3 text-slate-700">{intro}</p>}
              {facts.length > 0 && (
                <ul className="mt-4 list-disc pl-6 text-slate-700">
                  {facts.map((f, i) => <li key={i} className="mb-1">{f}</li>)}
                </ul>
              )}
            </section>

            {/* Planung und Umsetzung */}
            <section id="planung" className="rounded-xl p-6" style={{ backgroundColor: TINT }}>
              <h2 className="text-2xl md:text-3xl font-semibold">Planung und Umsetzung</h2>
              {planningLead && <p className="mt-3 text-slate-700">{planningLead}</p>}
              {planningBullets.length > 0 && (
                <ul className="mt-4 space-y-1 text-slate-700">
                  {planningBullets.map((b, i) => (
                    <li key={i}>{"✓ "}{b}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Video */}
            {videoSrc && (
              <section id="tool">
                <h2 className="text-2xl md:text-3xl font-semibold">Interaktives Tool zur Parkplatzplanung</h2>
                <p className="mt-3 text-slate-700">
                  Prüfen Sie Gestaltungsmöglichkeiten und erhalten Sie eine erste Kostenschätzung für Ihr Projekt.
                </p>
                <div className="relative mt-6">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video w-full">
                      <video
                        className="h-full w-full object-cover"
                        poster={videoPoster}
                        controls
                        playsInline
                        preload="metadata"
                      >
                        <source src={videoSrc} type="video/mp4" />
                        Ihr Browser unterstützt das Video-Tag nicht.
                      </video>
                    </div>
                  </div>
                  {videoCtaHref && (
                    <Link
                      href={videoCtaHref}
                      className="absolute -top-6 right-4 inline-flex items-center justify-center rounded-md
                               px-6 py-3.5 text-base font-semibold text-white shadow-md hover:opacity-95
                               focus:outline-none focus-visible:ring focus-visible:ring-offset-2"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {videoCtaLabel}
                    </Link>
                  )}
                </div>
              </section>
            )}

            {/* Regionale Anbieter */}
            <section id="anbieter">
              <h2 className="text-2xl md:text-3xl font-semibold">Regionale Anbieter</h2>
              {providers.length === 0 ? (
                <p className="mt-3 text-slate-700">Aktuell sind hier keine Anbieter gelistet.</p>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {providers.map((p, i) => <ProviderCard key={i} p={p} />)}
                </div>
              )}
            </section>

            {/* Back + More in canton */}
            {(backHref || cantonMore.length > 0) && (
              <section className="mt-4">
                {backHref && (
                  <div className="mb-6">
                    <Link href={backHref} className="text-slate-700 hover:underline">Zurück</Link>
                  </div>
                )}
                {cantonMore.length > 0 && (
                  <>
                    <h3 className="text-xl md:text-2xl font-semibold">{cantonMoreTitle ?? "Weitere Gemeinden"}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cantonMore.map((m, i) => (
                        <Link
                          key={i}
                          href={m.href}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-slate-400 hover:shadow-sm"
                        >
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}
          </div>

          {/* Right column – sticky quick links */}
          <aside className="lg:sticky lg:top-24 space-y-3">
            {quickLinks.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="block rounded-lg p-4 text-sm font-medium hover:opacity-95"
                style={{ backgroundColor: ACCENT, color: "white" }}
              >
                {l.label}
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}

function ProviderCard({ p }: { p: Provider }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{p.name}</div>
          {(p.street || p.zip || p.city) && (
            <div className="text-sm text-slate-600 mt-1">
              {p.street && <>{p.street}<br/></>}
              {p.zip} {p.city}
            </div>
          )}
        </div>
        {p.logoUrl && (
          <div className="shrink-0">
            <Image
              src={p.logoUrl}
              alt={`${p.name} Logo`}
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        {p.planningHref && (
          <Link
            href={p.planningHref}
            className="text-center rounded-md px-3 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Zum Planungstool
          </Link>
        )}
        {p.email && (
          <a
            href={`mailto:${p.email}`}
            className="text-center rounded-md px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200"
          >
            E-Mail
          </a>
        )}
        {p.website && (
          <a
            href={p.website}
            target="_blank" rel="noopener noreferrer"
            className="col-span-2 text-center rounded-md px-3 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
