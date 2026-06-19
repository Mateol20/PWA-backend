import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev";

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("El email ya está registrado");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = jwt.sign({ id: user.Id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: { id: user.Id, name: user.name, email: user.email, role: user.role },
  };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ id: user.Id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: { id: user.Id, name: user.name, email: user.email, role: user.role },
  };
}

export async function me(userId) {
  const user = await prisma.user.findUnique({ where: { Id: userId } });
  if (!user) {
    const err = new Error("Usuario no encontrado");
    err.status = 404;
    throw err;
  }
  return { id: user.Id, name: user.name, email: user.email, role: user.role };
}
