/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,source]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_sourceId_source_key" ON "Article"("sourceId", "source");
