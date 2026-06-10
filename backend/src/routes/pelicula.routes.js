import { Router } from "express";
import * as peliculaController from "../controllers/pelicula.controller.js";
import { toggleFavorito, getFavoritos } from "../controllers/pelicula.controller.js"

const router = Router();

router.get("/", peliculaController.getAll);
router.get("/:id", peliculaController.getById);
router.post("/", peliculaController.create);
router.put("/:id", peliculaController.update);
router.delete("/:id", peliculaController.remove);

router.get("/favoritas", peliculaController.getFavoritos)
router.patch("/:id/favorito", peliculaController.toggleFavorito);

export default router;
