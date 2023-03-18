/*
  Warnings:

  - You are about to drop the column `botLastRun` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "botLastRun",
ADD COLUMN     "botRunning" BOOLEAN NOT NULL DEFAULT false;
