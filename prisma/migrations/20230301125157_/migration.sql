-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "item_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourcePrice" REAL,
    "lastUpdated" DATETIME NOT NULL,
    "undercutPrice" REAL NOT NULL,
    "undercutPercentage" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "undercutByPriceOrPercentage" TEXT NOT NULL,
    "priceRangeMin" REAL NOT NULL,
    "priceRangeMax" REAL NOT NULL,
    "priceRangePercentage" REAL NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,
    "botRunStatus" TEXT
);
INSERT INTO "new_Item" ("active", "botRunStatus", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing") SELECT "active", "botRunStatus", "currentPrice", "id", "item_id", "lastUpdated", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
