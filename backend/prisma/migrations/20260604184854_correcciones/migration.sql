/*
  Warnings:

  - The primary key for the `pelicula` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cratedAt` on the `pelicula` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `pelicula` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pelicula` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pelicula" DROP CONSTRAINT "pelicula_pkey",
DROP COLUMN "cratedAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD CONSTRAINT "pelicula_pkey" PRIMARY KEY ("Id");
