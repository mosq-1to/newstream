/*
  Warnings:

  - Added the required column `timeframeInDays` to the `Brief` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brief" ADD COLUMN     "timeframeInDays" INTEGER NOT NULL;
