import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as adminMovieController from "../controllers/admin.movie.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", adminController.list);
router.post("/users", adminController.create);
router.put("/users/:id", adminController.update);
router.delete("/users/:id", adminController.remove);

router.get("/movies", adminMovieController.list);
router.post("/movies", adminMovieController.create);
router.put("/movies/:id", adminMovieController.update);
router.delete("/movies/:id", adminMovieController.remove);

export default router;
