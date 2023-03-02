/*
  Warnings:

  - You are about to drop the column `PriceEmpireRateLimit` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "whenNoOneToUndercutListUsing" TEXT NOT NULL DEFAULT 'max',
    "paused" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Settings" ("id", "paused", "priceEmpireApiKey", "source", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "waxpeerApiKey", "waxpeerRateLimit", "whenNoOneToUndercutListUsing") SELECT "id", "paused", "priceEmpireApiKey", "source", "undercutByPriceOrPercentage", "undercutPercentage", "undercutPrice", "userId", "waxpeerApiKey", coalesce("waxpeerRateLimit", 1) AS "waxpeerRateLimit", "whenNoOneToUndercutListUsing" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
