# PWA2026 BACKEND TP

## Integrantes

| Nombre                    | Legajo   |
| ------------------------- | -------- |
| Mateo Garcia (PM-TP1)     | FAI-4226 |
| Ignacio Bonorino (PM-TP2) | FAI-4863 |
# PWA-backend

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

- `GET /api/health` — Health check de la API
