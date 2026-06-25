import swaggerUi from "swagger-ui-express";
import path from "path";
import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "PWA Movies API",
    version: "1.0.0",
    description: "API de películas, favoritos, usuarios y administración",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
    { url: "https://pwa-backend-omega.vercel.app", description: "Producción" },
  ],
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "API funcionando" } },
      },
    },
    "/api/peliculas": {
      get: {
        summary: "Listar películas (paginado)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "lang", in: "query", schema: { type: "string", enum: ["es", "en"] } },
        ],
        responses: { "200": { description: "Lista de películas" } },
      },
      post: {
        summary: "Crear película",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PeliculaInput" } } } },
        responses: { "201": { description: "Película creada" } },
      },
    },
    "/api/peliculas/{id}": {
      get: {
        summary: "Obtener película por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Película encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        summary: "Actualizar película",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Actualizada" } },
      },
      delete: {
        summary: "Eliminar película",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } },
      },
    },
    "/api/peliculas/genero/{genero}": {
      get: {
        summary: "Filtrar por género",
        parameters: [{ name: "genero", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Películas filtradas" } },
      },
    },
    "/api/peliculas/{id}/favorito": {
      patch: {
        summary: "Toggle favorito",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Favorito actualizado" } },
      },
    },
    "/api/peliculas/favoritas": {
      get: {
        summary: "Obtener favoritos del usuario",
        parameters: [{ name: "userId", in: "query", schema: { type: "integer" } }],
        responses: { "200": { description: "Lista de favoritos" } },
      },
    },
    "/api/admin/users": {
      get: {
        summary: "Listar usuarios (admin)",
        responses: { "200": { description: "Lista de usuarios" } },
      },
      post: {
        summary: "Crear usuario (admin)",
        responses: { "201": { description: "Usuario creado" } },
      },
    },
    "/api/admin/users/{id}": {
      put: {
        summary: "Actualizar usuario (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Usuario actualizado" } },
      },
      delete: {
        summary: "Eliminar usuario (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Usuario eliminado" } },
      },
    },
    "/api/admin/movies": {
      get: {
        summary: "Listar películas (admin)",
        responses: { "200": { description: "Lista completa de películas" } },
      },
      post: {
        summary: "Crear película (admin)",
        responses: { "201": { description: "Película creada" } },
      },
    },
    "/api/admin/movies/{id}": {
      put: {
        summary: "Actualizar película (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Película actualizada" } },
      },
      delete: {
        summary: "Eliminar película (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Película eliminada" } },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Registrar un nuevo usuario",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": { description: "Usuario registrado", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "409": { description: "Email ya existe" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Iniciar sesión",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": { description: "Login exitoso", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "401": { description: "Credenciales inválidas" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        summary: "Renovar access token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshInput" },
            },
          },
        },
        responses: {
          "200": { description: "Token renovado", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "401": { description: "Refresh token inválido o expirado" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "Cerrar sesión (invalida el refresh token)",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshInput" },
            },
          },
        },
        responses: {
          "200": { description: "Logout exitoso" },
        },
      },
    },
    "/api/translations/{lang}": {
      get: {
        summary: "Obtener traducciones UI por idioma",
        parameters: [{ name: "lang", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Traducciones" } },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["email", "password", "name"],
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email", example: "juan@example.com" },
          password: { type: "string", format: "password", example: "miPassword123" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "juan@example.com" },
          password: { type: "string", format: "password", example: "miPassword123" },
        },
      },
      RefreshInput: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "uuid-del-refresh-token" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          Id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
        },
      },
      PeliculaInput: {
        type: "object",
        required: ["Title", "Year", "Poster", "Director", "Plot", "Images", "Actors", "imdbRating", "Runtime"],
        properties: {
          Title: { type: "string" },
          Year: { type: "integer" },
          Poster: { type: "string" },
          imdbRating: { type: "number" },
          Runtime: { type: "number" },
          Director: { type: "string" },
          Plot: { type: "string" },
          Images: { type: "string" },
          Actors: { type: "string" },
          Genre: { type: "string" },
          Type: { type: "string" },
          Trailer: { type: "string" },
        },
      },
    },
  },
};

export function setupSwagger(app) {
  const swaggerDist = path.dirname(require.resolve("swagger-ui-dist"));
  app.use("/api-docs", express.static(swaggerDist));
  app.use("/api-docs", swaggerUi.setup(swaggerDocument));
}
