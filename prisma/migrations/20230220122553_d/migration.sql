/*
  Warnings:

  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InventoryItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ItemSettings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "listed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
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
