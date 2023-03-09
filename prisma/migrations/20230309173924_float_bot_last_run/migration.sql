-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "floatBotFrequency" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "floatBotLastRun" TIMESTAMP(3);
