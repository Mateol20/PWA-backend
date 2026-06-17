import { PrismaClient } from "@prisma/client";
import peliculas from "./seed-data.json" with { type: "json" };
import traduccionesViejo from "./seed-traducciones.json" with { type: "json" };

const prisma = new PrismaClient();

const uiTraducciones = {
  es: {
    inicio: "Inicio", favoritos: "Favoritos", cartelera: "Cartelera",
    buscar: "Buscar película...", noHayMas: "No hay más películas para mostrar.",
    noFavoritos: "No tienes películas favoritas aún.", volverInicio: "Volver al inicio",
    cargandoPelicula: "Cargando película...", noEncontrada: "No se encontró la película.",
    año: "Año", genero: "Género", rating: "Rating IMDB", director: "Director",
    actores: "Actores", sinopsis: "Sinopsis", publicadoEn: "Publicado en",
    sinResultados: "No se encontraron películas para esta búsqueda.",
    cargando: "Cargando...", sinPoster: "Sin Poster", sinImagen: "Imagen No Encontrada",
  },
  en: {
    inicio: "Home", favoritos: "Favorites", cartelera: "Showtime",
    buscar: "Search movies...", noHayMas: "No more movies to show.",
    noFavoritos: "You don't have any favorite movies yet.", volverInicio: "Back to home",
    cargandoPelicula: "Loading movie...", noEncontrada: "Movie not found.",
    año: "Year", genero: "Genre", rating: "IMDB Rating", director: "Director",
    actores: "Actors", sinopsis: "Plot", publicadoEn: "Released in",
    sinResultados: "No movies found for this search.",
    cargando: "Loading...", sinPoster: "No Poster", sinImagen: "Image Not Found",
  },
};

try {
  await prisma.favorito.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.traduccion.deleteMany();
  await prisma.pelicula.deleteMany();
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "pelicula_Id_seq" RESTART WITH 1');

  await prisma.pelicula.createMany({ data: peliculas });

  const traduccionesUnificadas = [];

  for (const lang of ["es", "en"]) {
    for (const [clave, valor] of Object.entries(uiTraducciones[lang])) {
      traduccionesUnificadas.push({ entidad: "ui", clave, idioma: lang, valor });
    }
  }

  for (const t of traduccionesViejo) {
    const eid = String(t.peliculaId);
    traduccionesUnificadas.push({ entidad: eid, clave: "sinopsis", idioma: t.idioma, valor: t.sinopsis });
    if (t.genero) {
      traduccionesUnificadas.push({ entidad: eid, clave: "genero", idioma: t.idioma, valor: t.genero });
    }
  }

  await prisma.traduccion.createMany({ data: traduccionesUnificadas });
  await prisma.usuario.create({ data: { nombre: "Admin", contrasenia: "admin123" } });

  console.log(`Seed ejecutado: ${peliculas.length} películas, ${traduccionesUnificadas.length} traducciones`);
} catch (error) {
  console.error("Error al ejecutar el seed:", error);
} finally {
  await prisma.$disconnect();
}
