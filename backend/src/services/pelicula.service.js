import prisma from "../prisma/prismaClient.js";

export async function getAll() {
  return prisma.pelicula.findMany();
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
