-- AlterTable
ALTER TABLE "Favorito" ADD COLUMN     "Id" SERIAL NOT NULL,
ADD CONSTRAINT "Favorito_pkey" PRIMARY KEY ("Id");
