-- Drop old table
DROP TABLE IF EXISTS "pelicula_traduccion";

-- Create unified Traduccion table
CREATE TABLE "Traduccion" (
    "id" SERIAL NOT NULL,
    "entidad" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "idioma" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "Traduccion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Traduccion_entidad_clave_idioma_key" ON "Traduccion"("entidad", "clave", "idioma");
