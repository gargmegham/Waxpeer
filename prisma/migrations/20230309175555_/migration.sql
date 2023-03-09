/*
  Warnings:

  - You are about to drop the column `listItemFrom` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `listItemTo` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "listItemFrom",
DROP COLUMN "listItemTo";
