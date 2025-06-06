import fs from "fs";
import path from "path";
import { UiOrtschaft } from "../lib/model";
import { getKantone } from "../lib/data";
import { sanitizeForUrl } from "../lib/util";

const SITE_URL = process.env.SITE_URL || "https://parkplatz-bauen.ch";

function generateSiteMap(ortschaften: UiOrtschaft[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Manually set the known URLs -->
  <url>
    <loc>${SITE_URL}</loc>
  </url>
  ${ortschaften
    .map((o) => {
      return `
  <url>
    <loc>${SITE_URL}/ortschaft/${o.plz}_${sanitizeForUrl(o.name)}_${o.id}</loc>
  </url>`;
    })
    .join("")}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `User-agent: *
Disallow:
Sitemap: ${SITE_URL}/sitemap.xml`;
}

export async function generateSitemapAndRobotsFiles() {
  const kantone = await getKantone();
  const ortschaften: UiOrtschaft[] = kantone.flatMap((k) => k.gemeinden.flatMap((g) => g.ortschaften));

  const sitemap = generateSiteMap(ortschaften);
  const robotsTxt = generateRobotsTxt();

  // Write the sitemap.xml to the `out` directory
  const sitemapFilePath = path.join(process.cwd(), "out", "sitemap.xml");
  console.log("Writing sitemap.xml to", sitemapFilePath);
  fs.writeFileSync(sitemapFilePath, sitemap, "utf8");

  // Write the robots.txt to the `out` directory
  const robotsFilePath = path.join(process.cwd(), "out", "robots.txt");
  console.log("Writing robots.txt to", robotsFilePath);
  fs.writeFileSync(robotsFilePath, robotsTxt, "utf8");
}

generateSitemapAndRobotsFiles();
