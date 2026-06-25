import * as authServices from "../services/auth.service.js";
import { authValidation } from "../validations/auth.validation.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const errores = authValidation({ email, password });
    if (errores.length > 0) {
      return res.status(400).json({ errors: errores });
    }

    const result = await authServices.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.status)
      return res.status(error.status).json({ error: error.message });
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const errores = authValidation(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errors: errores });
    }

    const result = await authServices.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.status)
      return res.status(error.status).json({ error: error.message });
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ error: "refreshToken requerido" });
    const result = await authServices.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    if (error.status)
      return res.status(error.status).json({ error: error.message });
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authServices.logout(refreshToken);
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}
export async function me(req, res, next) {
  try {
    const user = await authServices.me(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
