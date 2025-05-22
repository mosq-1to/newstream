/*
  Warnings:

  - Made the column `topicId` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topicId` on table `Brief` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Brief" DROP CONSTRAINT "Brief_topicId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "topicId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Brief" ALTER COLUMN "topicId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
