/*
  Warnings:

  - You are about to drop the column `whenNoOneToUndercutListUsing` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `whenNoOneToUndercutListUsing` to the `PriceRange` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingsId" INTEGER NOT NULL,
    "SourcePriceMin" REAL,
    "SourcePriceMax" REAL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,
    CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PriceRange" ("SourcePriceMax", "SourcePriceMin", "id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId") SELECT "SourcePriceMax", "SourcePriceMin", "id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId" FROM "PriceRange";
DROP TABLE "PriceRange";
ALTER TABLE "new_PriceRange" RENAME TO "PriceRange";
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "waxpeerApiKey" TEXT,
    "waxpeerRateLimit" INTEGER NOT NULL DEFAULT 1,
    "priceEmpireApiKey" TEXT,
    "priceEmpireRateLimit" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL DEFAULT 'buff',
    "undercutPrice" REAL NOT NULL DEFAULT 0.1,
    "undercutPercentage" REAL NOT NULL DEFAULT 1,
    "undercutByPriceOrPercentage" TEXT NOT NULL DEFAULT 'price',
    "paused" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Settings" ("id", "paused", "priceEmpireApiKey", "priceEmpireRateLimit", "source", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "waxpeerApiKey", "waxpeerRateLimit") SELECT "id", "paused", "priceEmpireApiKey", "priceEmpireRateLimit", "source", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "waxpeerApiKey", "waxpeerRateLimit" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
