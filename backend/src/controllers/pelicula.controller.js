import * as peliculaService from "../services/pelicula.service.js";
import { validarPelicula } from "../validations/pelicula.validation.js";
import prisma from "../prisma/prismaClient.js";

export async function getAll(req, res) {
  try {
    const { page, limit, search, lang } = req.query;
    const result = await peliculaService.getAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      lang,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req, res) {
  const { id } = req.params;
  const { lang } = req.query;
  try {
    const pelicula = await peliculaService.getById(Number(id), lang);

    if (!pelicula) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req, res) {
  try {
    const errors = validarPelicula(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: errors });
    }
    const pelicula = await peliculaService.create(req.body);
    res.status(201).json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req, res) {
  const { id } = req.params;
  try {
    const errors = validarPelicula(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Datos inválidos", details: errors });
    }
    const pelicula = await peliculaService.update(Number(id), req.body);
    res.json(pelicula);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req, res) {
  const { id } = req.params;
  try {
    await peliculaService.remove(Number(id));
    res.json({ message: "Película eliminada correctamente" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function toggleFavorito(req, res, next) {
  try {
    const idPelicula = Number(req.params.id);
    let idUsuario = Number(req.body.idUsuario) || 1;

    let usuario = await prisma.usuario.findUnique({ where: { Id: idUsuario } });
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: { nombre: "Admin", contrasenia: "admin123" },
      });
      idUsuario = usuario.Id;
    }

    const existente = await prisma.favorito.findFirst({
      where: { idUsuario, idPelicula },
    });

    if (existente) {
      await prisma.favorito.delete({ where: { id: existente.id } });
      return res.json({
        status: "success",
        message: "Eliminado de favoritos",
        data: null,
        esFavorito: false,
      });
    }

    const nuevo = await prisma.favorito.create({
      data: { idUsuario, idPelicula },
      include: { pelicula: true },
    });
    console.log("Favorito creado:", nuevo);

    res.json({
      status: "success",
      message: "Agregado a favoritos",
      data: nuevo,
      esFavorito: true,
    });
  } catch (error) {
    console.error("Error en toggleFavorito:", error?.message || error, error?.stack);
    res.status(500).json({ error: "Error interno del servidor", detail: error?.message || "Unknown" });
  }
}

export async function getFavoritos(req, res, next) {
  try {
    let idUsuario = Number(req.query.idUsuario) || 1;

    let usuario = await prisma.usuario.findUnique({ where: { Id: idUsuario } });
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: { nombre: "Admin", contrasenia: "admin123" },
      });
      idUsuario = usuario.Id;
    }

    const favoritas = await prisma.favorito.findMany({
      where: { idUsuario },
      include: { pelicula: true },
    });

    res.json({
      status: "success",
      data: favoritas,
    });
  } catch (error) {
    next(error);
  }
}
