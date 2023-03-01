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
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "undercutPrice" REAL NOT NULL,
    "undercutPercentage" REAL NOT NULL,
    "currentPrice" REAL NOT NULL DEFAULT 0,
    "undercutByPriceOrPercentage" TEXT NOT NULL,
    "priceRangeMin" REAL,
    "priceRangeMax" REAL,
    "priceRangePercentage" REAL,
    "whenNoOneToUndercutListUsing" TEXT,
    "botSuccess" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL DEFAULT 'Not started yet'
);
INSERT INTO "new_Item" ("active", "botSuccess", "currentPrice", "id", "item_id", "lastUpdated", "message", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing") SELECT "active", coalesce("botSuccess", false) AS "botSuccess", "currentPrice", "id", "item_id", "lastUpdated", coalesce("message", 'Not started yet') AS "message", "name", "priceRangeMax", "priceRangeMin", "priceRangePercentage", "source", "sourcePrice", "type", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "whenNoOneToUndercutListUsing" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
