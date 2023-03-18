-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "priceRangeUndercutPercentageThreshold" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "priceRangeUndercutPercentageThreshold" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "waxpeerLastListed" TIMESTAMP(3),
ADD COLUMN     "waxpeerLastUpdated" TIMESTAMP(3);
