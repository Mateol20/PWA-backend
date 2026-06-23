-- Clean existing data first (will be re-seeded)
DELETE FROM "Favorito";
DELETE FROM "Usuario";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_idPelicula_fkey";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_idUsuario_fkey";

-- DropIndex
DROP INDEX "Favorito_idUsuario_idPelicula_key";

-- DropIndex
DROP INDEX "Usuario_nombre_key";

-- AlterTable
ALTER TABLE "Favorito" DROP COLUMN "idPelicula",
DROP COLUMN "idUsuario",
ADD COLUMN     "movieId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "contrasenia",
DROP COLUMN "nombre",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_userId_movieId_key" ON "Favorito"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "pelicula"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
