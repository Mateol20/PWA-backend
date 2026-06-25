import * as adminMovieService from "../services/admin.movie.service.js";
import { validarPelicula } from "../validations/pelicula.validation.js";

export async function list(req, res, next) {
  try {
    const movies = await adminMovieService.list();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validarPelicula(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Datos inválidos", details: errors });
    }
    const movie = await adminMovieService.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const movie = await adminMovieService.update(id, req.body);
    res.json(movie);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Película no encontrada" });
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await adminMovieService.remove(id);
    res.json({ message: "Película eliminada" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Película no encontrada" });
    next(err);
  }
}
