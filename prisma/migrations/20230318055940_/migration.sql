/*
  Warnings:

  - You are about to drop the column `waxpeerRateLimit` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "waxpeerRateLimit",
ADD COLUMN     "waxpeerRateLimitList" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "waxpeerRateLimitUpdate" INTEGER NOT NULL DEFAULT 1;
