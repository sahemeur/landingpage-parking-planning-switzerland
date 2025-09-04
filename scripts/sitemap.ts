import fs from "fs";
import path from "path";
import { UiOrtschaft } from "../lib/model";
import { getKantone } from "../lib/data";
import { sanitizeForUrl } from "../lib/util";

const SITE_URL = process.env.SITE_URL || "https://parkplatz-bauen.ch";

function isoDate(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function generateSiteMap(ortschaften: UiOrtschaft[]): string {
  const today = isoDate();

  const staticUrls = [`${SITE_URL}/`, `${SITE_URL}/impressum`, `${SITE_URL}/datenschutz`];

  const ortUrls = ortschaften.map(
    (o) => `${SITE_URL}/ortschaft/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}`
  );

  const all = [...new Set([...staticUrls, ...ortUrls])];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;
}

export async function generateSitemapAndRobotsFiles() {
  const kantone = await getKantone();
  const ortschaften: UiOrtschaft[] = kantone.flatMap((k) =>
    k.gemeinden.flatMap((g) => g.ortschaften)
  );

  const sitemap = generateSiteMap(ortschaften);
  const robotsTxt = generateRobotsTxt();

  const outDir = path.join(process.cwd(), "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt, "utf8");
}

generateSitemapAndRobotsFiles();
