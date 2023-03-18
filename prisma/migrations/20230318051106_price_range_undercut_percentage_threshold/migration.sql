/*
  Warnings:

  - You are about to drop the column `priceRangeUndercutPercentageThreshold` on the `Settings` table. All the data in the column will be lost.
  - Made the column `priceRangeUndercutPercentageThreshold` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `priceRangeUndercutPercentageThreshold` to the `PriceRange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "priceRangeUndercutPercentageThreshold" SET NOT NULL;

-- AlterTable
ALTER TABLE "PriceRange" ADD COLUMN     "priceRangeUndercutPercentageThreshold" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "priceRangeUndercutPercentageThreshold";
