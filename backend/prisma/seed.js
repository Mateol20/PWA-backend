import { PrismaClient } from "@prisma/client";
import data from "./seed-data.json" with { type: "json" };
import traducciones from "./seed-traducciones.json" with { type: "json" };

const prisma = new PrismaClient();

try {
  await prisma.pelicula_traduccion.deleteMany();
  await prisma.pelicula.deleteMany();
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "pelicula_Id_seq" RESTART WITH 1');
  await prisma.pelicula.createMany({ data });
  await prisma.pelicula_traduccion.createMany({ data: traducciones });
  console.log("Seed ejecutado correctamente");
} catch (error) {
  console.error("Error al ejecutar el seed:", error);
} finally {
  await prisma.$disconnect();
}
