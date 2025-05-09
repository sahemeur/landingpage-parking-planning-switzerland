import fs from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

async function seed() {
  function csvRecords(fileName: string) {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf-8");
    return parse(file, {
      columns: true,
      delimiter: ";",
      quote: '"',
      skip_empty_lines: true,
    });
  }

  const kantonRecords = csvRecords("kanton.csv");
  for (const record of kantonRecords) {
    await prisma.kanton.create({
      data: {
        id: record.id,
        name_de: record.name_de,
        name_fr: record.name_fr,
        name_it: record.name_it,
      },
    });
  }

  const gemeindeRecords = csvRecords("gemeinde.csv");
  for (const record of gemeindeRecords) {
    await prisma.gemeinde.create({
      data: {
        id: +record.id,
        name: record.name,
        kanton_id: record.kanton_id,
      },
    });
  }

  const ortschaftRecords = csvRecords("ortschaft.csv");
  for (const record of ortschaftRecords) {
    await prisma.ortschaft.create({
      data: {
        id: +record.id,
        name: record.name,
        plz: record.plz,
        gemeinde_id: +record.gemeinde_id,
        sprache: record.sprache,
        e: new Prisma.Decimal(record.e),
        n: new Prisma.Decimal(record.n),
      },
    });
  }

  const linkRecords = csvRecords("link.csv");
  for (const record of linkRecords) {
    await prisma.link.create({
      data: {
        id: +record.id,
        name: record.name,
        gemeinde_id: +record.gemeinde_id,
        url: record.url,
      },
    });
  }

  const firmenRecords = csvRecords("firma.csv");
  for (const record of firmenRecords) {
    await prisma.firma.create({
      data: {
        id: +record.id,
        name: record.name,
        strasse: record.strasse,
        postfach: record.postfach,
        plz: record.plz,
        ort: record.ort,
        mail: record.mail,
        sprache: record.sprache,
        webpage: record.webpage,
      },
    });
  }
}

seed();
