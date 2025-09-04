import Link from "next/link";
import { tool, features, steps, faqs } from "@/content/home";

type Props = {
  videoSrc?: string;
  posterSrc?: string;
  ctaHref?: string;
};

export default function LandingSections({ videoSrc, posterSrc, ctaHref }: Props) {
  const vSrc = videoSrc ?? tool.videoSrc;
  const pSrc = posterSrc ?? tool.posterSrc;
  const cHref = ctaHref ?? tool.ctaHref;

  return (
    <>
      {/* Features */}
      <section className="bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Was Sie hier finden</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-slate-700 text-sm md:text-base">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">So funktioniert es</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-semibold">{s.label}</h3>
                <p className="mt-2 text-slate-700 text-sm md:text-base">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool + video */}
      <section className="bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">{tool.title}</h2>
          <p className="mt-3 text-slate-700">{tool.blurb}</p>

          <div className="relative mt-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-video w-full">
                <video className="h-full w-full object-cover" poster={pSrc} controls playsInline preload="metadata">
                  <source src={vSrc} type="video/mp4" />
                  Ihr Browser unterstützt das Video-Tag nicht.
                </video>
              </div>
            </div>

            <Link
              href={cHref}
              target="_blank"
              className="absolute -top-6 right-4 inline-flex items-center justify-center rounded-md
                         px-6 py-3.5 text-base font-semibold text-white shadow-md
                         bg-[#0F3C5C] hover:bg-[#0B2F49] focus:outline-none focus-visible:ring
                         focus-visible:ring-offset-2 focus-visible:ring-[#0F3C5C]"
            >
              {tool.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Häufige Fragen</h2>
          <div className="mt-6 grid gap-4 md:gap-6">
            {faqs.map((f) => (
              <details key={f.q} open className="rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                <p className="mt-2 text-slate-700 text-sm md:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
