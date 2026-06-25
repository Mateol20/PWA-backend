import { Router } from "express";
import * as favoritosController from "../controllers/favoritos.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, favoritosController.getFavoritos);
router.post("/:movieId", authenticate, favoritosController.toggleFavorito);

export default router;
