import prisma from "../prisma/prismaClient.js";

function aplicarTraduccion(pelicula, traducciones) {
  if (!traducciones?.length) return pelicula;
  const sinopsis = traducciones.find((t) => t.clave === "sinopsis")?.valor;
  const genero = traducciones.find((t) => t.clave === "genero")?.valor;
  return {
    ...pelicula,
    Plot: sinopsis ?? pelicula.Plot,
    Genre: genero ?? pelicula.Genre,
  };
}

const MAX_LIMIT = 100;

export async function getAll({ cursor, limit = 8, search = "", lang } = {}) {
  limit = Math.min(limit, MAX_LIMIT);

  const where = search
    ? {
        OR: [
          { Title: { contains: search, mode: "insensitive" } },
          { Director: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.pelicula.findMany({
      take: limit + 1,
      where,
      orderBy: { Id: "asc" },
      ...(cursor ? { skip: 1, cursor: { Id: cursor } } : {}),
    }),
    prisma.pelicula.count({ where }),
  ]);

  const hasMore = items.length > limit;
  if (hasMore) items.pop();
  const nextCursor = hasMore ? items[items.length - 1].Id : null;

  if (lang && items.length > 0) {
    const ids = items.map((p) => String(p.Id));
    const traducciones = await prisma.traduccion.findMany({
      where: { entidad: { in: ids }, idioma: lang },
    });
    const dataMapped = items.map((p) => {
      const t = traducciones.filter((tr) => tr.entidad === String(p.Id));
      return aplicarTraduccion(p, t);
    });
    return { data: dataMapped, total, nextCursor };
  }

  return { data: items, total, nextCursor };
}

export async function getById(id, lang) {
  const pelicula = await prisma.pelicula.findUnique({ where: { Id: id } });
  if (!pelicula) return null;

  if (lang) {
    const traducciones = await prisma.traduccion.findMany({
      where: { entidad: String(id), idioma: lang },
    });
    return aplicarTraduccion(pelicula, traducciones);
  }

  return pelicula;
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
export async function getByGenero(genero, lang, page = 1, limit = 20) {
  if (!genero) return [];
  limit = Math.min(limit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const where = { Genre: { contains: genero, mode: "insensitive" } };
  const [peliculas, total] = await Promise.all([
    prisma.pelicula.findMany({ where, skip, take: limit, orderBy: { Id: "asc" } }),
    prisma.pelicula.count({ where }),
  ]);

  if (lang && peliculas.length > 0) {
    const ids = peliculas.map((p) => String(p.Id));
    const traducciones = await prisma.traduccion.findMany({
      where: { entidad: { in: ids }, idioma: lang },
    });
    return {
      data: peliculas.map((p) => {
        const t = traducciones.filter((tr) => tr.entidad === String(p.Id));
        return aplicarTraduccion(p, t);
      }),
      total,
      page,
      limit,
    };
  }

  return { data: peliculas, total, page, limit };
}
