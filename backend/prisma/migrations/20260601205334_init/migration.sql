-- CreateTable
CREATE TABLE "pelicula" (
    "Title" TEXT NOT NULL,
    "Year" INTEGER NOT NULL,
    "imdbID" TEXT NOT NULL,
    "Poster" TEXT NOT NULL,
    "imdbRating" DOUBLE PRECISION NOT NULL,
    "Runtime" TEXT NOT NULL,
    "Director" TEXT NOT NULL,
    "Plot" TEXT NOT NULL,
    "Images" TEXT NOT NULL,
    "Actors" TEXT NOT NULL,

    CONSTRAINT "pelicula_pkey" PRIMARY KEY ("imdbID")
);
