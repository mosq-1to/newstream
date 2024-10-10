/*
  Warnings:

  - Added the required column `source` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "sourceId" TEXT NOT NULL;
