import fs from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

async function seed() {
  const kantonCsvPath = path.join(__dirname, "kanton.csv");
  const kantonCsv = fs.readFileSync(kantonCsvPath, "utf-8");
  const kantonRecords = parse(kantonCsv, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
  });

  for (const record of kantonRecords) {
    await prisma.kanton.upsert({
      where: { id: record.id },
      update: {},
      create: {
        id: record.id,
        name_de: record.name_de,
        name_fr: record.name_fr,
        name_it: record.name_it,
      },
    });
  }

  const ortschaftCsvPath = path.join(__dirname, "ortschaft.csv");
  const ortschaftCSV = fs.readFileSync(ortschaftCsvPath, "utf-8");
  const ortschaftRecords = parse(ortschaftCSV, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
  });

  for (const record of ortschaftRecords) {
    await prisma.ortschaft.create({
      data: {
        name: record.name,
        plz: record.plz,
        gemeinde: record.gemeinde,
        kanton_id: record.kanton_id,
        e: new Prisma.Decimal(record.e),
        n: new Prisma.Decimal(record.n),
        sprache: record.sprache,
      },
    });
  }

  // Seed Firmen
  const firmenCsvPath = path.join(__dirname, "firmen.csv");
  const firmenCsv = fs.readFileSync(firmenCsvPath, "utf-8");
  const firmenRecords = parse(firmenCsv, {
    columns: true,
    delimiter: ",",
    skip_empty_lines: true,
  });

  for (const record of firmenRecords) {
    await prisma.firma.create({
      data: {
        id: parseInt(record.id), // Ensure the ID is an integer
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
