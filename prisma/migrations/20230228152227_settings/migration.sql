/*
  Warnings:

  - Added the required column `priceRangePercentage` to the `PriceRange` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "waxpeerApiKey" TEXT,
    "waxpeerRateLimit" INTEGER,
    "priceEmpireApiKey" TEXT,
    "PriceEmpireRateLimit" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'buff',
    "undercutPrice" REAL NOT NULL DEFAULT 0.1,
    "undercutPercentage" REAL NOT NULL DEFAULT 1,
    "undercutByPriceOrPercentage" TEXT NOT NULL DEFAULT 'price',
    "whenNoOneToUndercutListUsing" TEXT NOT NULL DEFAULT 'max',
    "paused" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Settings" ("PriceEmpireRateLimit", "id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey", "waxpeerRateLimit") SELECT "PriceEmpireRateLimit", "id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey", "waxpeerRateLimit" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE TABLE "new_PriceRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingsId" INTEGER NOT NULL,
    "SourcePriceMin" REAL,
    "SourcePriceMax" REAL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PriceRange" ("SourcePriceMax", "SourcePriceMin", "id", "priceRangeMax", "priceRangeMin", "settingsId") SELECT "SourcePriceMax", "SourcePriceMin", "id", "priceRangeMax", "priceRangeMin", "settingsId" FROM "PriceRange";
DROP TABLE "PriceRange";
ALTER TABLE "new_PriceRange" RENAME TO "PriceRange";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
