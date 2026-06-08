import { PrismaClient } from "@prisma/client";
import data from "./seed-data.json" with { type: "json" };

const prisma = new PrismaClient();

try {
  await prisma.pelicula.deleteMany();
  await prisma.pelicula.createMany({ data });
  console.log("Seed ejecutado correctamente");
} catch (error) {
  console.error("Error al ejecutar el seed:", error);
} finally {
  await prisma.$disconnect();
}
