import prisma from "../prisma/prismaClient.js";

export async function getAllFavorito({ page = 1, limit = 8, search = "", idUsuario } = {}) {
  const skip = (page - 1) * limit;

  const where = {
    idUsuario,
    ...(search
      ? {
          pelicula: {
            OR: [
              { Title: { contains: search, mode: "insensitive" } },
              { Director: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.favorito.findMany({
      skip,
      take: limit,
      where,
      include: { pelicula: true },
      orderBy: { id: "asc" },
    }),
    prisma.favorito.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getByIdFavorito(id) {
  return prisma.favorito.findUnique({ where: { Id: id } });
}

export async function createFavorito(data) {
  return prisma.favorito.create({ data });
}

export async function updateFavorito(id, data) {
  return prisma.favorito.update({ where: { Id: id }, data });
}

export async function removeFavorito(id) {
  await prisma.favorito.delete({ where: { Id: id } });
}
