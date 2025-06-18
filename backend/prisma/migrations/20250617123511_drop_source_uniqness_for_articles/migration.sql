/*
  Warnings:

  - You are about to drop the column `source` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Article` table. All the data in the column will be lost.
  - Added the required column `sourceName` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Article_sourceId_source_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "source",
DROP COLUMN "sourceId",
ADD COLUMN     "sourceName" TEXT NOT NULL,
ADD COLUMN     "sourceUrl" TEXT;
