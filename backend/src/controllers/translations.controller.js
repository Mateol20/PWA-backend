import * as translationsService from "../services/translations.service.js";

export async function getByLang(req, res, next) {
  try {
    const lang = req.params.lang;
    const traducciones = await translationsService.getUiTranslations(lang);
    if (!traducciones) {
      return res.status(404).json({ error: "Idioma no soportado" });
    }
    res.json(traducciones);
  } catch (error) {
    next(error);
  }
}
