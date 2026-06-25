import * as favoritosService from "../services/favoritos.service.js";

export async function toggleFavorito(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);
    const userId = req.user.id;
    const result = await favoritosService.toggleFavorito(userId, movieId);
    const mensaje = result.esFavorito ? "Agregado a favoritos" : "Eliminado de favoritos";
    res.json({ status: "success", message: mensaje, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getFavoritos(req, res, next) {
  try {
    const userId = req.user.id;
    const data = await favoritosService.getFavoritos(userId);
    res.json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}
