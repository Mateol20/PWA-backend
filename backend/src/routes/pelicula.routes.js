import { Router } from "express";
import * as peliculaController from "../controllers/pelicula.controller.js";

const router = Router();

router.get("/", peliculaController.getAll);
router.get("/genero/:genero", peliculaController.getByGenero);
router.get("/:id", peliculaController.getById);
router.post("/", peliculaController.create);
router.put("/:id", peliculaController.update);
router.delete("/:id", peliculaController.remove);

export default router;
