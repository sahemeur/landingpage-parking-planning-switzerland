import Link from "next/link";
import { useState } from "react";
import { sanitizeForUrl } from "@/lib/util";
import type { UiOrtschaft } from "@/lib/model";

type Props = {
  items: UiOrtschaft[]; // the first 10
  moreItems?: UiOrtschaft[]; // the rest (optional)
  title?: string;
  subtitle?: string;
};

export default function BeliebteGemeinden({
  items,
  moreItems = [],
  title = "Beliebte Gemeinden",
  subtitle = "Direkt zu häufig gesuchten Ortschaften.",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? [...items, ...moreItems] : items;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-600 text-sm">{subtitle}</p>

        <nav aria-label="Beliebte Gemeinden">
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {visible.map((o) => (
              <Link
                key={o.id}
                href={`/${o.plz}_${sanitizeForUrl(o.name)}`}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-slate-400 hover:shadow-sm"
                aria-label={`${o.plz} ${o.name} öffnen`}
              >
                {o.plz} {o.name}
              </Link>
            ))}

            {/* Navy "Mehr" button */}
            {!expanded && moreItems.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium
                           text-white bg-[#0F3C5C] hover:bg-[#0B2F49] shadow-sm
                           focus:outline-none focus-visible:ring focus-visible:ring-[#0F3C5C] focus-visible:ring-offset-2"
                aria-label="Mehr Gemeinden anzeigen"
              >
                Mehr
              </button>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
}
