/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `listed` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Item` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "item_id" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourcePrice" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "undercutPrice" INTEGER NOT NULL,
    "undercutPercentage" INTEGER NOT NULL,
    "currentPrice" INTEGER NOT NULL,
    "undercutByPriceOrPercentage" TEXT NOT NULL,
    "priceRangeMin" INTEGER NOT NULL,
    "priceRangeMax" INTEGER NOT NULL,
    "priceRangePercentage" INTEGER NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL
);
INSERT INTO "new_Item" ("active", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing") SELECT "active", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "waxpeerApiKey" TEXT,
    "priceEmpireApiKey" TEXT,
    "botInterval" INTEGER,
    "paused" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Settings" ("botInterval", "id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey") SELECT "botInterval", "id", "paused", "priceEmpireApiKey", "userId", "waxpeerApiKey" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
