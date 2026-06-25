import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

const ts = Date.now();
const testName = `Test_${ts}`;
const testEmail = `test_${ts}@test.com`;
let accessToken = "";
let refreshToken = "";

describe("Auth Flow", () => {
  it("POST /api/auth/register - crea usuario y devuelve token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: testName, email: testEmail, password: "test123" });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("POST /api/auth/register - rechaza email duplicado", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: `${testName}_dup`, email: testEmail, password: "test123" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("El email ya existe");
  });

  it("POST /api/auth/login - inicia sesión y devuelve token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "test123" });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("POST /api/auth/login - rechaza credenciales inválidas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Credenciales inválidas");
  });

  it("GET /api/auth/me - devuelve usuario con token válido", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testEmail);
    expect(res.body.password).toBeUndefined();
  });

  it("GET /api/auth/me - rechaza sin token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token no proporcionado");
  });

  it("POST /api/auth/refresh - refresca tokens", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.refreshToken).not.toBe(refreshToken);
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("POST /api/auth/logout - cierra sesión", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken });

    expect(res.status).toBe(200);
  });
});

describe("Favoritos protegidos", () => {
  it("POST /api/favoritos/:movieId - rechaza sin token", async () => {
    const res = await request(app).post("/api/favoritos/1");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token no proporcionado");
  });

  it("POST /api/favoritos/:movieId - alterna favorito con token", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "test123" });

    const res = await request(app)
      .post("/api/favoritos/1")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("esFavorito");
  });

  it("GET /api/favoritos - lista favoritos con token", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "test123" });

    const res = await request(app)
      .get("/api/favoritos")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("Admin protegido", () => {
  let userToken;

  beforeAll(async () => {
    const n = Date.now();
    const email = `user_${n}@test.com`;
    await request(app)
      .post("/api/auth/register")
      .send({ name: `User_${n}`, email, password: "test123" });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "test123" });
    userToken = login.body.accessToken;
  });

  it("GET /api/admin/users - rechaza sin token", async () => {
    const res = await request(app).get("/api/admin/users");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token no proporcionado");
  });

  it("GET /api/admin/users - rechaza con token de user común", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain("admin");
  });

  it("GET /api/admin/users - permite con token de admin", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@admin.com", password: "admin" });

    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${login.body.accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0].password).toBeUndefined();
    }
  });
});
