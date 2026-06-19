import prisma from "../prisma/prismaClient.js";

export async function list() {
  return prisma.pelicula.findMany({ orderBy: { Id: "asc" } });
}

export async function create(data) {
  return prisma.pelicula.create({ data });
}

export async function update(id, data) {
  return prisma.pelicula.update({ where: { Id: id }, data });
}

export async function remove(id) {
  await prisma.favorito.deleteMany({ where: { movieId: id } });
  await prisma.pelicula.delete({ where: { Id: id } });
}
