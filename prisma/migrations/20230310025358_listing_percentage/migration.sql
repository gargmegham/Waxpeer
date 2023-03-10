-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "listUsing" TEXT NOT NULL DEFAULT 'price-range',
ADD COLUMN     "listingPercentage" INTEGER NOT NULL DEFAULT 100;
