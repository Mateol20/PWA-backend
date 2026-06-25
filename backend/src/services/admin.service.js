import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcrypt";

export async function list() {
  return prisma.user.findMany({
    orderBy: { Id: "asc" },
    select: { Id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function create(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    const err = new Error("El email ya existe");
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hash, role: data.role || "user" },
  });
  delete user.password;
  return user;
}

export async function update(id, data) {
  const payload = {};
  if (data.name) payload.name = data.name;
  if (data.email) payload.email = data.email;
  if (data.role) payload.role = data.role;
  if (data.password) payload.password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.update({ where: { Id: id }, data: payload });
  delete user.password;
  return user;
}

export async function remove(id) {
  await prisma.favorito.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { Id: id } });
}
