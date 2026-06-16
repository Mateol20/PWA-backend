import prisma from "../prisma/prismaClient.js";

function aplicarTraduccion(pelicula, lang) {
  if (!lang) return pelicula;
  const trad = pelicula.traducciones?.[0];
  if (!trad) return pelicula;
  const { traducciones, ...resto } = pelicula;
  return {
    ...resto,
    Plot: trad.sinopsis,
    Genre: trad.genero ?? pelicula.Genre,
  };
}

export async function getAll({ page = 1, limit = 8, search = "", lang } = {}) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { Title: { contains: search, mode: "insensitive" } },
          { Director: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.pelicula.findMany({
      skip,
      take: limit,
      where,
      orderBy: { Id: "asc" },
      include: lang
        ? { traducciones: { where: { idioma: lang } } }
        : undefined,
    }),
    prisma.pelicula.count({ where }),
  ]);

  const dataMapped = lang ? data.map((p) => aplicarTraduccion(p, lang)) : data;

  return { data: dataMapped, total, page, limit };
}

export async function getById(id, lang) {
  const pelicula = await prisma.pelicula.findUnique({
    where: { Id: id },
    include: lang
      ? { traducciones: { where: { idioma: lang } } }
      : undefined,
  });

  if (!pelicula) return null;
  return aplicarTraduccion(pelicula, lang);
}

export async function create(data) {
  return prisma.pelicula.create({ data });
}

export async function update(id, data) {
  return prisma.pelicula.update({ where: { Id: id }, data });
}

export async function remove(id) {
  await prisma.pelicula.delete({ where: { Id: id } });
}
