/*
  Warnings:

  - The primary key for the `pelicula` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imdbID` on the `pelicula` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `pelicula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pelicula" DROP CONSTRAINT "pelicula_pkey",
DROP COLUMN "imdbID",
ADD COLUMN     "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "pelicula_pkey" PRIMARY KEY ("id");
