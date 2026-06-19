import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", adminController.list);
router.post("/users", adminController.create);
router.put("/users/:id", adminController.update);
router.delete("/users/:id", adminController.remove);

export default router;
