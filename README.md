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
    │   ├── traducir.js                  # Script de traducción automática
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
| `npm run traducir` | Traduce sinopsis y género a un nuevo idioma vía Google Translate |

## Endpoints

| Método | Ruta | Descripción | Códigos HTTP |
|--------|------|-------------|--------------|
| `GET` | `/api/health` | Health check de la API | 200 |
| `GET` | `/api/peliculas` | Obtener todas las películas | 200, 500 |
| `GET` | `/api/peliculas/:id` | Obtener una película por ID | 200, 404, 500 |
| `POST` | `/api/peliculas` | Crear una nueva película | 201, 400, 500 |
| `PUT` | `/api/peliculas/:id` | Actualizar una película existente | 200, 400, 404, 500 |
| `DELETE` | `/api/peliculas/:id` | Eliminar una película | 204, 404, 500 |

### Parámetros de consulta

| Parámetro | Endpoints | Descripción |
|-----------|-----------|-------------|
| `?lang=es` | `GET /api/peliculas`, `GET /api/peliculas/:id` | Devuelve sinopsis y género traducidos al idioma indicado. Si no hay traducción disponible, devuelve los valores originales en inglés. |
| `?page=` | `GET /api/peliculas` | Número de página para paginación (default: 1) |
| `?limit=` | `GET /api/peliculas` | Cantidad de resultados por página (default: 8) |
| `?search=` | `GET /api/peliculas` | Búsqueda por título o director |

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

## Traducciones

La API soporta traducción de sinopsis y género de las películas a través de una tabla separada `pelicula_traduccion`.

### Modelo de datos

```prisma
model pelicula_traduccion {
  id         Int      @id @default(autoincrement())
  peliculaId Int
  idioma     String
  sinopsis   String
  genero     String?

  pelicula   pelicula @relation(fields: [peliculaId], references: [Id], onDelete: Cascade)

  @@unique([peliculaId, idioma])
}
```

### Cómo funciona

1. Los datos originales (en inglés) se almacenan en `pelicula`.
2. Las traducciones se guardan en `pelicula_traduccion` con un par `peliculaId + idioma` único.
3. Al consultar con `?lang=es`, el backend incluye la traducción correspondiente y reemplaza `Plot` y `Genre` en la respuesta.
4. Si no hay traducción para el idioma solicitado, se devuelven los valores originales en inglés.

### Seed de traducciones

Las traducciones al español ya están incluidas en `prisma/seed-traducciones.json` y se insertan automáticamente al ejecutar `npx prisma db seed`. No es necesario hacer nada extra.

### Agregar un nuevo idioma

Si querés traducir a portugués, francés, etc., usá el script `prisma/traducir.js`:

```bash
IDIOMA_DESTINO=pt npm run traducir   # Portugués
IDIOMA_DESTINO=fr npm run traducir   # Francés
```

Después de ejecutarlo, exportá las nuevas traducciones al JSON para que el seed las incluya:

```bash
node -e "
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const p = new PrismaClient();
const r = await p.pelicula_traduccion.findMany({ orderBy: { peliculaId: 'asc' } });
const data = r.map(({ id, ...rest }) => rest);
fs.writeFileSync('prisma/seed-traducciones.json', JSON.stringify(data, null, 2));
await p.\$disconnect();
"
```
