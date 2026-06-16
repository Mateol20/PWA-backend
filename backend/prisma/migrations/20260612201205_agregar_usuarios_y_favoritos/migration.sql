-- CreateTable
CREATE TABLE "Usuario" (
    "Id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT 'Admin',
    "contrasenia" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "idPelicula" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombre_key" ON "Usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_idUsuario_idPelicula_key" ON "Favorito"("idUsuario", "idPelicula");

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_idPelicula_fkey" FOREIGN KEY ("idPelicula") REFERENCES "pelicula"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
