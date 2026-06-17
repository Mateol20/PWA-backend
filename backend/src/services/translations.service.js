import prisma from "../prisma/prismaClient.js";

export async function getUiTranslations(lang) {
  const filas = await prisma.traduccion.findMany({
    where: { entidad: "ui", idioma: lang },
  });
  if (filas.length === 0) return null;
  const traducciones = {};
  for (const f of filas) {
    traducciones[f.clave] = f.valor;
  }
  return traducciones;
}
