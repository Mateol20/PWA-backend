-- AlterTable
ALTER TABLE "pelicula" ADD COLUMN     "Genre" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "Type" TEXT NOT NULL DEFAULT 'movie';
