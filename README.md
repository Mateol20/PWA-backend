# PWA2026 BACKEND TP

## Integrantes

| Nombre                    | Legajo   |
| ------------------------- | -------- |
| Mateo Garcia (PM-TP1)     | FAI-4226 |
| Ignacio Bonorino (PM-TP2) | FAI-4863 |

API REST de películas con Express + Prisma + PostgreSQL.

- **Frontend:** [https://github.com/Mateol20/PWA-FRONTEND](https://github.com/Mateol20/PWA-FRONTEND)
- **Deploy frontend:** [https://pwa-frontend-roan.vercel.app](https://pwa-frontend-roan.vercel.app)
- **Deploy backend:** [https://pwa-backend-omega.vercel.app](https://pwa-backend-omega.vercel.app)

## Estructura del proyecto

```
PWA-backend/
└── backend/
    ├── src/
    │   ├── index.js                          # Punto de entrada (levanta el servidor)
    │   ├── app.js                            # Configuración de Express (CORS, rutas, swagger)
    │   ├── prisma/
    │   │   └── prismaClient.js               # Singleton de PrismaClient
    │   ├── routes/
    │   │   ├── pelicula.routes.js            # Rutas públicas de películas + favoritos
    │   │   ├── admin.routes.js               # Rutas CRUD admin (usuarios y películas)
    │   │   └── translations.routes.js        # Rutas de traducciones
    │   ├── controllers/
    │   │   ├── pelicula.controller.js        # Handlers de películas y favoritos
    │   │   ├── admin.controller.js           # Handlers CRUD de usuarios
    │   │   └── admin.movie.controller.js     # Handlers CRUD de películas (admin)
    │   ├── services/
    │   │   ├── pelicula.service.js           # Lógica de negocio con Prisma (cursor-based pagination)
    │   │   ├── admin.service.js              # Lógica CRUD de usuarios
    │   │   └── admin.movie.service.js        # Lógica CRUD de películas (admin)
    │   ├── validations/
    │   │   └── pelicula.validation.js        # Validación manual del body
    │   ├── middlewares/
    │   │   └── errorHandler.js               # Middleware global de errores
    │   └── swagger.js                        # Documentación OpenAPI / Swagger UI
    ├── prisma/
    │   ├── schema.prisma                     # Modelos: pelicula, User, Favorito, Traduccion
    │   ├── seed.js                           # Seed de datos iniciales
    │   ├── seed-data.json                    # Datos del seed
    │   └── migrations/                       # Migraciones generadas por Prisma
    ├── tests/
    │   └── api.test.js                       # Tests de integración (Vitest + Supertest)
    ├── .env
    ├── docker-compose.yml
    └── package.json
```

## Modelo de datos

```prisma
model pelicula { ... }      // Catálogo de películas
model Traduccion { ... }    // Traducciones multi-idioma (sinopsis, género)
model User { ... }          // Usuarios (admin/user), mapeado a tabla "Usuario"
model Favorito { ... }      // Relación usuario-película (favoritos)
```

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Mateol20/PWA-backend.git
cd PWA-backend
```

### 2. Crear archivo de entorno
```bash
cp backend/.env.example backend/.env
```
Editar `backend/.env` si es necesario (los valores por defecto funcionan con Docker).

### 3. Iniciar la base de datos (PostgreSQL con Docker)
```bash
cd backend
docker compose up -d
```

### 4. Instalar dependencias
```bash
npm install
```

### 5. Ejecutar migraciones de Prisma
```bash
npx prisma migrate dev
```

### 6. Cargar datos iniciales (seed)
```bash
npx prisma db seed
```

### 7. Iniciar el servidor
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.
Documentación Swagger: `http://localhost:3000/api-docs`.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo (recarga automática) |
| `npm start` | Inicia servidor en modo producción |
| `npm test` | Ejecuta tests de API con Vitest |
| `npx prisma db seed` | Carga datos iniciales |
| `npx prisma migrate dev` | Ejecuta migraciones pendientes |
| `npx prisma generate` | Regenera el cliente de Prisma |

## Testing

```bash
npm test
```

Tests de integración con **Vitest + Supertest**. Requieren PostgreSQL corriendo con datos seed.

## Endpoints

### Públicos

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/health` | Health check | 200 |
| `GET` | `/api/peliculas` | Lista paginada (cursor-based) | 200, 500 |
| `GET` | `/api/peliculas/:id` | Película por ID | 200, 404, 500 |
| `GET` | `/api/peliculas/genero/:genero` | Películas por género (paginado) | 200, 400 |
| `GET` | `/api/peliculas/favoritas` | Favoritos de un usuario | 200, 500 |
| `PATCH` | `/api/peliculas/:id/favorito` | Alternar favorito | 200, 500 |
| `GET` | `/api/translations/:lang` | Traducciones de interfaz (`/es`, `/en`) | 200, 404 |

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `POST` | `/api/auth/refresh` | Refrescar token |
| `POST` | `/api/auth/logout` | Cerrar sesión |

### Admin

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/admin/users` | Listar usuarios |
| `POST` | `/api/admin/users` | Crear usuario |
| `PUT` | `/api/admin/users/:id` | Actualizar usuario |
| `DELETE` | `/api/admin/users/:id` | Eliminar usuario |
| `GET` | `/api/admin/movies` | Listar películas |
| `POST` | `/api/admin/movies` | Crear película |
| `PUT` | `/api/admin/movies/:id` | Actualizar película |
| `DELETE` | `/api/admin/movies/:id` | Eliminar película |

### Documentación interactiva

La API cuenta con documentación OpenAPI disponible en `/api-docs` (Swagger UI) con todos los endpoints, parámetros y ejemplos de respuesta.

## Paginación (cursor-based)

La API usa **cursor-based pagination** en vez de tradicional page/offset:

```
GET /api/peliculas?limit=8
  → { data: [...], total: 42, nextCursor: 8 }

GET /api/peliculas?cursor=8&limit=8
  → { data: [...], total: 42, nextCursor: 16 }
```

- `cursor`: ID de la última película de la página anterior
- `nextCursor`: `null` cuando no hay más páginas
- Más eficiente que OFFSET en tablas grandes porque usa la PK indexada

## Respuestas de error

**Recurso no encontrado (404)**
```json
{ "error": "Recurso no encontrado" }
```

**Body inválido (400)**
```json
{
  "error": "Datos inválidos",
  "details": [
    { "field": "Title", "message": "El título es obligatorio" },
    { "field": "Year", "message": "El año debe ser un número válido entre 1888 y 2030" }
  ]
}
```
