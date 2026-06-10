import * as peliculaService from "../services/pelicula.service.js";
import { validarPelicula } from "../validations/pelicula.validation.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAll(req, res) {
  try {
    const { page, limit, search } = req.query;
    const result = await peliculaService.getAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req, res) {
  const { id } = req.params;
  try {
    const pelicula = await peliculaService.getById(Number(id));

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
    const { id } = req.params;
    const { favorito } = req.body;

    const peliculaActualizada = await prisma.pelicula.update({
      where: { Id: parseInt(id) },
      data: { favorito: favorito },
    });

    res.json({
      status: "success",
      message: "Estado de favorito actualizado",
      data: peliculaActualizada
    });
  } catch (error) {
    next(error);
  }
}

export async function getFavoritos(req, res, next) {
  try {
    const favoritas = await prisma.pelicula.findMany({
      where: { favorito: true }
    });

    res.json({
      status: "success",
      data: favoritas
    });
  } catch (error) {
    next(error);
  }
}