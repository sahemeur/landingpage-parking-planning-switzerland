import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Home() {
  const kantone = await prisma.kanton.findMany({
    include: {
      gemeinden: {
        include: {
          ortschaften: true,
        },
      },
    },
  });

  return (
    <main>
      <h1 className="text-5xl font-extrabold mb-2">Parkplätze bauen in der Schweiz</h1>
      {kantone.map((k) => (
        <div key={k.id}>
          <h2 className="text-2xl mb-1">{k.name_de}</h2>
          <ul>
            {k.gemeinden.map((g) =>
              g.ortschaften.map((o) => (
                <li key={o.id}>
                  <Link href={`${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`}>
                    {o.plz} {o.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </main>
  );
}

export function sanitizeForUrl(input: string): string {
  // Replace German umlauts and ß
  const umlautMap: { [key: string]: string } = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss",
  };

  const replacedUmlauts = input.replace(/[äöüÄÖÜß]/g, (char) => umlautMap[char] || char);

  // Replace all whitespace characters with underscores
  const noWhitespace = replacedUmlauts.replace(/\s+/g, "_");

  // Remove or replace any remaining unsafe characters
  const safe = noWhitespace.replace(/[^a-zA-Z0-9_-]/g, "");

  return safe;
}
