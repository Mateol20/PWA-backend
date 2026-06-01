/*
  Warnings:

  - Added the required column `PRUEBA` to the `pelicula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pelicula" ADD COLUMN     "PRUEBA" INTEGER NOT NULL;
