/*
  Warnings:

  - Made the column `sourcePriceMax` on table `PriceRange` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sourcePriceMin` on table `PriceRange` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingsId" INTEGER NOT NULL,
    "sourcePriceMin" REAL NOT NULL,
    "sourcePriceMax" REAL NOT NULL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,
    CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PriceRange" ("id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId", "sourcePriceMax", "sourcePriceMin", "whenNoOneToUndercutListUsing") SELECT "id", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "settingsId", "sourcePriceMax", "sourcePriceMin", "whenNoOneToUndercutListUsing" FROM "PriceRange";
DROP TABLE "PriceRange";
ALTER TABLE "new_PriceRange" RENAME TO "PriceRange";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
