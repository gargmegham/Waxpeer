/*
  Warnings:

  - You are about to drop the column `botInterval` on the `Settings` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PriceRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingsId" INTEGER NOT NULL,
    "SourcePriceMin" REAL,
    "SourcePriceMax" REAL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "waxpeerApiKey" TEXT,
    "waxpeerRateLimit" INTEGER,
    "priceEmpireApiKey" TEXT,
    "PriceEmpireRateLimit" INTEGER,
    "paused" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Settings" ("id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey") SELECT "id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
