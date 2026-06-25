import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/health", () => {
  it("devuelve status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", message: "API funcionando correctamente" });
  });
});

describe("GET /api/peliculas", () => {
  it("devuelve lista paginada de películas con cursor", async () => {
    const res = await request(app).get("/api/peliculas?limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("nextCursor");
    expect(res.body.data[0]).toHaveProperty("Title");
    expect(res.body.data[0]).toHaveProperty("Year");
  });

  it("filtra por búsqueda", async () => {
    const res = await request(app).get("/api/peliculas?search=Inception");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.every((p) => p.Title.includes("Inception"))).toBe(true);
  });
});

describe("GET /api/peliculas/:id", () => {
  it("devuelve una película por id", async () => {
    const res = await request(app).get("/api/peliculas/1");
    expect(res.status).toBe(200);
    expect(res.body.Id).toBe(1);
    expect(res.body.Title).toBeDefined();
  });

  it("devuelve 404 si no existe", async () => {
    const res = await request(app).get("/api/peliculas/99999");
    expect(res.status).toBe(404);
  });
});
