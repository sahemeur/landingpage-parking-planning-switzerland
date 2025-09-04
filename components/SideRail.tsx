import Link from "next/link";
import { palette } from "@/content/home";

type Item = { label: string; href?: string };

export default function SideRail({ items }: { items: Item[] }) {
  return (
    <aside className="mt-8 lg:mt-0">
      <div className="lg:sticky lg:top-24">
        <ul className="space-y-3">
          {items.map((it, i) =>
            it.href ? (
              <li key={i}>
                <Link
                  href={it.href}
                  target={it.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="block rounded-md px-4 py-3 font-semibold text-white shadow-md hover:opacity-95"
                  style={{ backgroundColor: palette.accent }}
                >
                  {it.label}
                </Link>
              </li>
            ) : (
              <li key={i}>
                <span
                  className="block rounded-md px-4 py-3 font-semibold text-white/70 shadow-md cursor-not-allowed"
                  title="Link folgt bald"
                  style={{ backgroundColor: palette.accent }}
                >
                  {it.label}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </aside>
  );
}
