import prisma from "../prisma/prismaClient.js";

export async function getFavoritos(userId) {
  const data = await prisma.favorito.findMany({
    where: { userId },
    include: { movie: true },
  });
  return data;
}

export async function toggleFavorito(userId, movieId) {
  const existente = await prisma.favorito.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });

  if (existente) {
    await prisma.favorito.delete({ where: { Id: existente.Id } });
    return { esFavorito: false };
  }

  const nuevo = await prisma.favorito.create({
    data: { userId, movieId },
    include: { movie: true },
  });
  return { esFavorito: true, data: nuevo };
}
