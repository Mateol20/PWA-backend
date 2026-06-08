import prisma from "../prisma/prismaClient.js";

export async function getAll({ page = 1, limit = 8, search = "" } = {}) {
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
    prisma.pelicula.findMany({ skip, take: limit, where, orderBy: { Id: "asc" } }),
    prisma.pelicula.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getById(id) {
  return prisma.pelicula.findUnique({ where: { Id: id } });
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
