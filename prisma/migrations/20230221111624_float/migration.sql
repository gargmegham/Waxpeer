/*
  Warnings:

  - You are about to alter the column `currentPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `priceRangeMax` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `priceRangeMin` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `priceRangePercentage` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `sourcePrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `undercutPercentage` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `undercutPrice` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "item_id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourcePrice" REAL NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "undercutPrice" REAL NOT NULL,
    "undercutPercentage" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "undercutByPriceOrPercentage" TEXT NOT NULL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL
);
INSERT INTO "new_Item" ("active", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing") SELECT "active", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
