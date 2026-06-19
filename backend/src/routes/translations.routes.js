import { Router } from "express";
import { getByLang } from "../controllers/translations.controller.js";

const router = Router();

router.get("/:lang", getByLang);

export default router;
