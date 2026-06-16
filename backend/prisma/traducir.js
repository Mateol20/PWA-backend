import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const IDIOMA_DESTINO = (process.env.IDIOMA_DESTINO || "es").toLowerCase();

async function traducirTexto(texto) {
  if (!texto || texto === "N/A") return texto;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${IDIOMA_DESTINO}&dt=t&q=${encodeURIComponent(texto)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error Google Translate (${res.status})`);
      return null;
    }
    const data = await res.json();
    return data[0].map((t) => t[0]).join("");
  } catch (error) {
    console.error(`Error al traducir "${texto.slice(0, 40)}...":`, error.message);
    return null;
  }
}

async function esperar(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

try {
  const peliculas = await prisma.pelicula.findMany();
  console.log(`Insertando sinopsis y género en español para ${peliculas.length} películas...`);

  let traducidas = 0;
  let saltadas = 0;
  let errores = 0;

  for (const p of peliculas) {
    const existente = await prisma.pelicula_traduccion.findUnique({
      where: {
        peliculaId_idioma: { peliculaId: p.Id, idioma: IDIOMA_DESTINO },
      },
    });
    if (existente) {
      saltadas++;
      continue;
    }

    process.stdout.write(`  [${p.Id}/${peliculas.length}] "${p.Title}" → `);

    const [sinopsis, genero] = await Promise.all([
      traducirTexto(p.Plot),
      traducirTexto(p.Genre),
    ]);

    await esperar(500);

    if (!sinopsis && !genero) {
      console.log("ERROR");
      errores++;
      continue;
    }

    await prisma.pelicula_traduccion.create({
      data: {
        peliculaId: p.Id,
        idioma: IDIOMA_DESTINO,
        sinopsis: sinopsis ?? p.Plot,
        genero: genero ?? p.Genre,
      },
    });

    console.log("ok");
    traducidas++;
  }

  console.log(`\nResumen: ${traducidas} insertadas, ${saltadas} ya existían, ${errores} errores`);
} catch (error) {
  console.error("Error general:", error);
} finally {
  await prisma.$disconnect();
}
