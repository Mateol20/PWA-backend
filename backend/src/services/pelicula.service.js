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

  const data = await prisma.pelicula.findMany({
    skip,
    take: limit,
    where,
    orderBy: { Id: "asc" },
  });
  const total = await prisma.pelicula.count({ where });

  if (lang && data.length > 0) {
    const ids = data.map((p) => String(p.Id));
    const traducciones = await prisma.traduccion.findMany({
      where: { entidad: { in: ids }, idioma: lang },
    });
    const dataMapped = data.map((p) => {
      const t = traducciones.filter((tr) => tr.entidad === String(p.Id));
      return aplicarTraduccion(p, t);
    });
    return { data: dataMapped, total, page, limit };
  }

  return { data, total, page, limit };
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
export async function getByGenero(genero, lang) {
  if (!genero) return [];
  const peliculas = await prisma.pelicula.findMany({
    where: { Genre: { contains: genero, mode: "insensitive" } },
    orderBy: { Id: "asc" },
  });

  if (lang && peliculas.length > 0) {
    const ids = peliculas.map((p) => String(p.Id));
    const traducciones = await prisma.traduccion.findMany({
      where: { entidad: { in: ids }, idioma: lang },
    });
    return peliculas.map((p) => {
      const t = traducciones.filter((tr) => tr.entidad === String(p.Id));
      return aplicarTraduccion(p, t);
    });
  }

  return peliculas;
}
