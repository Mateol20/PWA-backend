import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import peliculas from "./seed-data.json" with { type: "json" };
import traduccionesViejo from "./seed-traducciones.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "public", "images");
const prisma = new PrismaClient();

async function descargarImagen(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    console.warn(`  ⚠ No se pudo descargar ${url}: ${err.message}`);
    return false;
  }
}

function extraerImdbId(url) {
  const m = url.match(/[?&]i=(tt\d+)/);
  return m ? m[1] : null;
}

function urlImagenGrande(originalUrl) {
  if (!originalUrl) return originalUrl;
  return originalUrl.replace(/([?&]apikey=[^&]+)/, `$1&h=1000`);
}

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
    todo: "Todo", peliculas: "Películas", series: "Series", trailer: "Trailer",
    verTrailer: "Ver trailer en YouTube",
    duracion: "Duración", medios: "Medios", usuarios: "Usuarios",
    amigos: "Amigos", quieroVer: "Quiero ver", puntuar: "Puntuar",
    descargarPDF: "Descargar PDF", favorito: "Favorito", notas: "notas",
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
    todo: "All", peliculas: "Movies", series: "Series", trailer: "Trailer",
    verTrailer: "Watch trailer on YouTube",
    duracion: "Duration", medios: "Media", usuarios: "Users",
    amigos: "Friends", quieroVer: "Want to watch", puntuar: "Rate",
    descargarPDF: "Download PDF", favorito: "Favorite", notas: "ratings",
  },
};

try {
  await prisma.favorito.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.traduccion.deleteMany();
  await prisma.pelicula.deleteMany();
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "pelicula_Id_seq" RESTART WITH 1');

  const peliculasConImagen = await Promise.all(
    peliculas.map(async (p) => {
      const imdbId = extraerImdbId(p.Poster);
      if (!imdbId) return p;

      const dest = path.join(imagesDir, `${imdbId}.jpg`);
      if (!fs.existsSync(dest) || fs.statSync(dest).size < 50000) {
        const urlGrande = urlImagenGrande(p.Poster);
        console.log(`  Descargando ${imdbId}...`);
        const ok = await descargarImagen(urlGrande, dest);
        if (!ok && urlGrande !== p.Poster) {
          console.log(`  Reintentando ${imdbId} sin h=1000...`);
          await descargarImagen(p.Poster, dest);
        }
      }
      return { ...p, Poster: `/images/${imdbId}.jpg`, Images: `/images/${imdbId}.jpg` };
    })
  );

  await prisma.pelicula.createMany({ data: peliculasConImagen });

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
