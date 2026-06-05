const VALIDACIONES = {
  Title: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "El título es obligatorio",
  Poster: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "El Poster es obligatorio",
  Director: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "El director es obligatorio",
  Plot: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "El argumento es obligatorio",
  Images: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "Las imágenes son obligatorias",
  Actors: (val) =>
    typeof val === "string" && val.trim() !== ""
      ? null
      : "Los actores son obligatorios",
  Year: (val) =>
    Number.isInteger(val) && val >= 1888 && val <= 2030
      ? null
      : "El año debe ser un número entero válido entre 1888 y 2030",
  imdbRating: (val) =>
    typeof val === "number" && !isNaN(val) && val >= 0 && val <= 10
      ? null
      : "La calificación debe ser un número entre 0 y 10",
  Runtime: (val) =>
    typeof val === "number" && !isNaN(val) && val >= 0
      ? null
      : "La duración debe ser un número válido",
};

export function validarPelicula(body) {
  if (!body || Object.keys(body).length === 0) {
    return [{ field: "body", message: "El body no puede estar vacío" }];
  }

  const errors = [];

  for (const [field, validate] of Object.entries(VALIDACIONES)) {
    const errorMessage = validate(body[field]);
    if (errorMessage) {
      errors.push({ field, message: errorMessage });
    }
  }

  return errors;
}
