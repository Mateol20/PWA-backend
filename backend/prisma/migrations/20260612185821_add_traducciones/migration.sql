-- CreateTable
CREATE TABLE "pelicula_traduccion" (
    "id" SERIAL NOT NULL,
    "peliculaId" INTEGER NOT NULL,
    "idioma" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopsis" TEXT NOT NULL,
    "director" TEXT,
    "actores" TEXT,
    "genero" TEXT,

    CONSTRAINT "pelicula_traduccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pelicula_traduccion_peliculaId_idioma_key" ON "pelicula_traduccion"("peliculaId", "idioma");

-- AddForeignKey
ALTER TABLE "pelicula_traduccion" ADD CONSTRAINT "pelicula_traduccion_peliculaId_fkey" FOREIGN KEY ("peliculaId") REFERENCES "pelicula"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
