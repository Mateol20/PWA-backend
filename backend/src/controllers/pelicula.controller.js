import * as peliculaService from "../services/pelicula.service.js";
import { validarPelicula } from "../validations/pelicula.validation.js";

export async function getAll(req, res) {
  try {
    const peliculas = await peliculaService.getAll();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
