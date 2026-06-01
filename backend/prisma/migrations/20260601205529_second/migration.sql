/*
  Warnings:

  - Changed the type of `Runtime` on the `pelicula` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "pelicula" DROP COLUMN "Runtime",
ADD COLUMN     "Runtime" DOUBLE PRECISION NOT NULL;
