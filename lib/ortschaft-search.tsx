import Link from "next/link";
import { useMemo, useState } from "react";
import { sanitizeForUrl } from "./util";

export default function OrtschaftenSearch(props: { ortschaften: { id: number; name: string; plz: string }[] }) {
  const [input, setInput] = useState("");
  const filteredOrtschaften = useMemo(() => {
    const inputTrimmed = input.trim();
    if (inputTrimmed.length < 3) {
      return [];
    }
    const tokens = inputTrimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    return props.ortschaften
      .filter(({ name, plz }) => {
        const searchable = `${name} ${plz}`.toLowerCase();
        return tokens.every((token) => searchable.includes(token));
      })
      .slice(0, 5);
  }, [input, props.ortschaften]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
          id="default-search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="PLZ oder Gemeinde"
          required
        />
      </div>
      {filteredOrtschaften.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl mb-4 font-semibold text-gray-900">Gefunde Gemeinden</h2>
          <div className="">
            {filteredOrtschaften.map((o, i) => (
              <Link
                key={i}
                href={`ortschaft/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`}
                className="h-10 flex flex-col font-semibold underline align-middle justify-center"
              >
                {o.plz} {o.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
