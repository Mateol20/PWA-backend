import * as adminService from "../services/admin.service.js";

export async function list(req, res, next) {
  try {
    const users = await adminService.list();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email y password son requeridos" });
    }
    const user = await adminService.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await adminService.update(id, req.body);
    res.json(user);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Usuario no encontrado" });
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await adminService.remove(id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Usuario no encontrado" });
    next(err);
  }
}
