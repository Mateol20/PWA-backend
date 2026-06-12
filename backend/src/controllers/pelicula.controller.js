import * as peliculaService from "../services/pelicula.service.js";
import { validarPelicula } from "../validations/pelicula.validation.js";

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
