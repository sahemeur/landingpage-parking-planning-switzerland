-- CreateTable
CREATE TABLE "Ortschaft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gemeinde_id" INTEGER NOT NULL,
    "plz" TEXT NOT NULL,
    "e" DECIMAL NOT NULL,
    "n" DECIMAL NOT NULL,
    "sprache" TEXT NOT NULL,
    CONSTRAINT "Ortschaft_gemeinde_id_fkey" FOREIGN KEY ("gemeinde_id") REFERENCES "Gemeinde" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gemeinde" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "kanton_id" TEXT NOT NULL,
    CONSTRAINT "Gemeinde_kanton_id_fkey" FOREIGN KEY ("kanton_id") REFERENCES "Kanton" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "gemeinde_id" INTEGER NOT NULL,
    CONSTRAINT "Link_gemeinde_id_fkey" FOREIGN KEY ("gemeinde_id") REFERENCES "Gemeinde" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kanton" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_de" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_it" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Firma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "strasse" TEXT NOT NULL,
    "postfach" TEXT NOT NULL,
    "plz" TEXT NOT NULL,
    "ort" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "webpage" TEXT NOT NULL,
    "sprache" TEXT NOT NULL
);
