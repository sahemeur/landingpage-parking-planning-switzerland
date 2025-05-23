import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { sanitizeForUrl } from "./_util";

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
        <div key={k.id} className="mb-4">
          <h2 className="text-2xl mb-1">{k.name_de}</h2>
          <div>
            {k.gemeinden.map((g) =>
              g.ortschaften.map((o) => (
                <Link key={o.id} href={`${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`} className="text-xs mr-1 underline">
                  {o.plz} {o.name}
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
