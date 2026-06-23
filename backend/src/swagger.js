import swaggerUi from "swagger-ui-express";

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
    "/api/translations/{lang}": {
      get: {
        summary: "Obtener traducciones UI por idioma",
        parameters: [{ name: "lang", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Traducciones" } },
      },
    },
  },
  components: {
    schemas: {
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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
