import { Router } from "express";
import prisma from "../prisma/prismaClient.js";

const router = Router();

router.get("/:lang", async (req, res, next) => {
  try {
    const lang = req.params.lang;
    const filas = await prisma.traduccion.findMany({
      where: { entidad: "ui", idioma: lang },
    });
    if (filas.length === 0) {
      return res.status(404).json({ error: "Idioma no soportado" });
    }
    const traducciones = {};
    for (const f of filas) {
      traducciones[f.clave] = f.valor;
    }
    res.json(traducciones);
  } catch (error) {
    next(error);
  }
});

export default router;
