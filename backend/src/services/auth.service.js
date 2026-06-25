import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev";
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "7d";
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30",
  10,
);

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.Id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES },
  );
}

function generateRefreshToken() {
  return crypto.randomUUID();
}

function calculateRefreshExpiry() {
  return new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  );
}

async function createRefreshToken(userId) {
  const token = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: calculateRefreshExpiry(),
    },
  });
  return token;
}

export async function register(data) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    const err = new Error("El email ya existe");
    err.status = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(data.password, 8);
  const created = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || "",
    },
  });
  const user = { Id: created.Id, email: created.email, name: created.name, role: created.role };
  const accessToken = generateAccessToken(created);
  const refreshToken = await createRefreshToken(created.Id);
  return { user, accessToken, refreshToken };
}

export async function login(email, password) {
  const found = await prisma.user.findUnique({ where: { email } });
  if (!found) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, found.password);
  if (!valid) {
    const err = new Error("Credenciales inválidas");
    err.status = 401;
    throw err;
  }
  const user = { Id: found.Id, email: found.email, name: found.name, role: found.role };
  const accessToken = generateAccessToken(found);
  const refreshToken = await createRefreshToken(found.Id);
  return { user, accessToken, refreshToken };
}

export async function refresh(refreshTokenValue) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { user: true },
  });
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    const err = new Error("Refresh token inválido o expirado");
    err.status = 401;
    throw err;
  }
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const found = stored.user;
  const user = { Id: found.Id, email: found.email, name: found.name, role: found.role };
  const accessToken = generateAccessToken(found);
  const refreshToken = await createRefreshToken(found.Id);
  return { user, accessToken, refreshToken };
}

export async function logout(refreshTokenValue) {
  try {
    await prisma.refreshToken.delete({ where: { token: refreshTokenValue } });
  } catch {
    // si no existe, igual consideramos logout exitoso
  }
}
export async function me(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { Id: userId },
      select: { Id: true, email: true, name: true, role: true },
    });
    return user;
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
}
