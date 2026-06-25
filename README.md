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
    │   │   ├── pelicula.routes.js            # Rutas públicas de películas
    │   │   ├── favoritos.routes.js           # Rutas de favoritos (protegidas con JWT)
    │   │   ├── auth.routes.js                # Rutas de autenticación (login, register, refresh, logout, me)
    │   │   ├── admin.routes.js               # Rutas CRUD admin (protegidas con JWT + admin role)
    │   │   └── translations.routes.js        # Rutas de traducciones
    │   ├── controllers/
    │   │   ├── pelicula.controller.js        # Handlers CRUD de películas
    │   │   ├── favoritos.controller.js       # Handlers de favoritos
    │   │   ├── auth.controller.js            # Handlers de autenticación
    │   │   ├── admin.controller.js           # Handlers CRUD de usuarios
    │   │   └── admin.movie.controller.js     # Handlers CRUD de películas (admin)
    │   ├── services/
    │   │   ├── pelicula.service.js           # Lógica de negocio con Prisma (cursor-based pagination)
    │   │   ├── favoritos.service.js          # Lógica de favoritos
    │   │   ├── auth.service.js               # Lógica de autenticación (JWT, bcrypt, refresh tokens)
    │   │   ├── admin.service.js              # Lógica CRUD de usuarios
    │   │   └── admin.movie.service.js        # Lógica CRUD de películas (admin)
    │   ├── validations/
    │   │   ├── pelicula.validation.js        # Validación manual del body de películas
    │   │   └── auth.validation.js            # Validación de email y password
    │   ├── middlewares/
    │   │   ├── auth.js                       # Middleware authenticate + requireAdmin (JWT)
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
| `GET` | `/api/translations/:lang` | Traducciones de interfaz (`/es`, `/en`) | 200, 404 |

### Autenticación

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `POST` | `/api/auth/register` | Registro de usuario (`name`, `email`, `password`) | 201, 400, 409 |
| `POST` | `/api/auth/login` | Inicio de sesión (`email`, `password`) | 200, 400, 401 |
| `POST` | `/api/auth/refresh` | Refrescar token (`refreshToken`) | 200, 400, 401 |
| `POST` | `/api/auth/logout` | Cerrar sesión (`refreshToken`) | 200 |
| `GET` | `/api/auth/me` | Datos del usuario autenticado (requiere Bearer token) | 200, 401, 404 |

**Ejemplo login:**
```json
// POST /api/auth/login
{ "email": "admin@admin.com", "password": "admin" }

// Respuesta 200
{
  "user": { "Id": 12, "email": "admin@admin.com", "name": "Admin", "role": "admin" },
  "accessToken": "eyJ...",
  "refreshToken": "uuid..."
}
```

### Favoritos (requieren JWT)

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/favoritos` | Lista favoritos del usuario autenticado | 200, 401 |
| `POST` | `/api/favoritos/:movieId` | Alternar favorito (agrega/saca) | 200, 401 |

Incluir header: `Authorization: Bearer <accessToken>`

### Admin (requieren JWT + role admin)

Todas las rutas admin requieren `Authorization: Bearer <accessToken>` y que el usuario tenga role `admin`.

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/admin/users` | Listar usuarios | 200, 401, 403 |
| `POST` | `/api/admin/users` | Crear usuario | 201, 400, 401, 403, 409 |
| `PUT` | `/api/admin/users/:id` | Actualizar usuario | 200, 401, 403, 404 |
| `DELETE` | `/api/admin/users/:id` | Eliminar usuario | 200, 401, 403, 404 |
| `GET` | `/api/admin/movies` | Listar películas | 200, 401, 403 |
| `POST` | `/api/admin/movies` | Crear película | 201, 400, 401, 403 |
| `PUT` | `/api/admin/movies/:id` | Actualizar película | 200, 401, 403, 404 |
| `DELETE` | `/api/admin/movies/:id` | Eliminar película | 200, 401, 403, 404 |

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
