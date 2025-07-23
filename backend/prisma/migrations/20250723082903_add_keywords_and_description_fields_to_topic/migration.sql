/*
  Warnings:

  - Added the required column `description` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "keywords" TEXT[];
