export function authValidation(body) {
  const errors = [];

  if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
    errors.push({ field: "email", message: "Email inválido" });
  }

  if (!body.password || typeof body.password !== "string" || body.password.length < 4) {
    errors.push({ field: "password", message: "La contraseña debe tener al menos 4 caracteres" });
  }

  return errors;
}
