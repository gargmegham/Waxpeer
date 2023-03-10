/*
  Warnings:

  - You are about to drop the column `listUsing` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `listingPercentage` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "listUsing" TEXT NOT NULL DEFAULT 'price-range',
ADD COLUMN     "listingPercentage" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "listUsing",
DROP COLUMN "listingPercentage";
