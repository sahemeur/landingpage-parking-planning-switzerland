import Link from "next/link";
import { useMemo, useState } from "react";
import { sanitizeForUrl } from "./util";

type Ortschaft = { id: number; name: string; plz: string };

export default function OrtschaftenSearch(props: { ortschaften: Ortschaft[] }) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const filteredOrtschaften = useMemo(() => {
    const q = input.trim();
    if (q.length < 3) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return props.ortschaften
      .filter(({ name, plz }) => {
        const searchable = `${name} ${plz}`.toLowerCase();
        return tokens.every((t) => searchable.includes(t));
      })
      .slice(0, 12);
  }, [input, props.ortschaften]);

  const open = focused && filteredOrtschaften.length > 0;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg
          className="h-5 w-5 text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>

      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)} // let clicks in the panel register
        placeholder="PLZ oder Gemeinde"
        className="w-full rounded-full bg-white px-5 py-3 pl-10 text-sm text-slate-900 shadow-md
                   placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0F3C5C]"
      />

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-auto
                     rounded-xl border border-slate-200 bg-white shadow-xl"
          onMouseDown={(e) => e.preventDefault()}
        >
          <h2 className="px-4 pt-3 pb-2 text-sm font-semibold text-slate-700">Gefundene Gemeinden</h2>
          <ul className="divide-y divide-slate-100">
            {filteredOrtschaften.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`}
                  className="block px-4 py-2 text-slate-800 hover:bg-slate-50"
                >
                  {o.plz} {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
