/*
  Warnings:

  - Added the required column `miles` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "miles" INTEGER NOT NULL;
