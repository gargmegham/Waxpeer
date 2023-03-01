/*
  Warnings:

  - You are about to drop the column `SourcePriceMax` on the `PriceRange` table. All the data in the column will be lost.
  - You are about to drop the column `SourcePriceMin` on the `PriceRange` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingsId" INTEGER NOT NULL,
    "sourcePriceMin" REAL,
    "sourcePriceMax" REAL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,
    CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PriceRange" ("id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId", "whenNoOneToUndercutListUsing") SELECT "id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId", "whenNoOneToUndercutListUsing" FROM "PriceRange";
DROP TABLE "PriceRange";
ALTER TABLE "new_PriceRange" RENAME TO "PriceRange";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
