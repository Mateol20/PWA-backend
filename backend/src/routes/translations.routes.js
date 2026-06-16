import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const translationsFilePath = path.join(__dirname, "../locales");

router.get("/:lang", (req, res) => {
  const lang = req.params.lang;
  const filePath = path.join(translationsFilePath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const translations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(translations);
  } else {
    res.status(404).json({ error: "Language not found" });
  }
});

export default router;
