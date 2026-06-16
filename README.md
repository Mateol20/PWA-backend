# PWA2026 BACKEND TP

## Integrantes

| Nombre                    | Legajo   |
| ------------------------- | -------- |
| Mateo Garcia (PM-TP1)     | FAI-4226 |
| Ignacio Bonorino (PM-TP2) | FAI-4863 |
# PWA-backend

API REST de películas con Express + Prisma + PostgreSQL.

## Estructura del proyecto

```
PWA-backend/
└── backend/
    ├── src/
    │   ├── index.js                     # Punto de entrada (levanta el servidor)
    │   ├── app.js                       # Configuración de Express
    │   ├── prisma/
    │   │   └── prismaClient.js          # Singleton de PrismaClient
    │   ├── routes/
    │   │   └── pelicula.routes.js       # Definición de rutas
    │   ├── controllers/
    │   │   └── pelicula.controller.js   # Manejadores req/res
    │   ├── services/
    │   │   └── pelicula.service.js      # Lógica de negocio con Prisma
    │   ├── validations/
    │   │   └── pelicula.validation.js   # Validación manual del body
    │   └── middlewares/
    │       └── errorHandler.js          # Middleware global de errores
    ├── prisma/
    │   ├── schema.prisma                # Modelo de datos
    │   ├── seed.js                      # Seed de datos iniciales
    │   ├── seed-data.json               # Datos del seed
    │   └── migrations/                  # Migraciones generadas por Prisma
    ├── .env
    ├── docker-compose.yml
    └── package.json
```

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd PWA-backend
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en `backend/` con el siguiente contenido:
```env
DATABASE_URL="postgresql://pwa-backend-user:pwa@localhost:5432/pwa-backend-db"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

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

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm start` | Inicia el servidor en modo producción |
| `npx prisma db seed` | Ejecuta el seed para cargar datos iniciales |
| `npx prisma migrate dev` | Ejecuta las migraciones pendientes |
| `npx prisma generate` | Regenera el cliente de Prisma |

## Endpoints

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/health` | Health check de la API | 200 |
| `GET` | `/api/peliculas` | Obtener todas las películas | 200, 500 |
| `GET` | `/api/peliculas/:id` | Obtener una película por ID | 200, 404, 500 |
| `POST` | `/api/peliculas` | Crear una nueva película | 201, 400, 500 |
| `PUT` | `/api/peliculas/:id` | Actualizar una película existente | 200, 400, 404, 500 |
| `DELETE` | `/api/peliculas/:id` | Eliminar una película | 204, 404, 500 |

### Respuestas de error

**Recurso no encontrado (404)**
```json
{
  "error": "Recurso no encontrado"
}
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

