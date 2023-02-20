/*
  Warnings:

  - You are about to drop the `ApiCallHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `icon_url` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Item` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApiCallHistory";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "listed" BOOLEAN NOT NULL DEFAULT false,
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
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,
    CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("active", "currentPrice", "id", "lastUpdated", "listed", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "whenNoOneToUndercutListUsing") SELECT "active", "currentPrice", "id", "lastUpdated", "listed", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "whenNoOneToUndercutListUsing" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
