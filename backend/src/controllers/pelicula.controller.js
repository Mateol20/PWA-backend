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
//milamores
export async function getById(req, res) {
  const { id } = req.params
  try {
    const pelicula = await peliculaService.getByid( { where: { id: Number(id) } } )

    if(!pelicula){
      return res.status(404).json({ error: "Película no encontrada" })
    }
    res.json(pelicula)
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params
    await peliculaService.remove(Number(id))
    res.json({ message: "Película eliminada correctamente" })
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
}
