/*
  Warnings:

  - Added the required column `content` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT;
