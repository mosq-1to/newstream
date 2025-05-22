/*
  Warnings:

  - Made the column `thumbnailUrl` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "thumbnailUrl" SET NOT NULL;
