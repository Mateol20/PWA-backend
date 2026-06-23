# Deuda Técnica

> Documentación de vulnerabilidades, ineficiencias y mejoras pendientes.
> Auditoría realizada: Junio 2026

---

## 🔴 Críticos (seguridad)

| # | Problema | Dónde | Impacto |
|---|---|---|---|
| 1 | **Admin sin auth** — cualquiera puede crear/borrar usuarios y películas | FE + BE (`/api/admin/*`) | Pérdida total de datos |
| 2 | **CRUD de películas público** — `POST/PUT/DELETE /api/peliculas` sin auth | BE (`pelicula.routes.js`) | Cualquiera modifica el catálogo |
| 3 | **`userId` hardcodeado a 1** — todos los usuarios comparten los mismos favoritos | FE (`obtenerFavoritos.js:23`) | Favoritos rotos para userId ≠ 1 |
| 4 | **Password hash devuelto en respuestas** — al crear/editar usuario devuelve el hash de bcrypt | BE (`admin.service.js`) | Exposición de hashes |
| 5 | **Toggle favorito acepta cualquier `userId`** — podés modificar favoritos ajeno | BE (`pelicula.controller.js:85`) | Escalado de privilegios |
| 6 | **JWT secret hardcodeado** — `"secret-dev"` si falta env var | BE (`auth.js:3`) | Falsificación de tokens |

## 🟡 Alto

| # | Problema | Dónde | Impacto |
|---|---|---|---|
| 7 | **Optimistic update sin rollback** — si falla toggle favorito, UI queda desincronizada | FE (`ContextoFavoritos.jsx`) | Estado inconsistente |
| 8 | **`jspdf` importado eager (~500KB)** — debería ser `import()` dinámico | FE (`DetallePelicula.jsx:6`) | LCP / bundle size |
| 9 | **Admin list sin paginación** — devuelve todos los registros sin límite | BE (`admin.service.js`, `admin.movie.service.js`) | Performance degradado con muchos datos |
| 10 | **Admin movie update no valida datos** — `create` valida, `update` no | BE (`admin.movie.controller.js`) | Datos inválidos en DB |

## 🟠 Medio (rendimiento/red)

| # | Problema | Dónde | Impacto |
|---|---|---|---|
| 11 | **Doble fetch inicial** — `useEffect` + `useInfiniteScroll` disparan page 1 duplicado | FE (`Home.jsx`) | 2x requests innecesarios |
| 12 | **Sin cancelación de requests** — al cambiar búsqueda, requests anteriores siguen en vuelo | FE (`Home.jsx`) | Race conditions, ancho de banda |
| 13 | **Sin caché** — cada vez que volvés a Home o Favoritos se refetch todo | FE (todos los servicios) | Carga innecesaria |
| 14 | **`mapearPelicula` duplicado 3 veces** — en 3 servicios distintos | FE (`obtener*Pelicula*.js`) | Mantenimiento costoso |
| 15 | **ContextBusqueda sin `useMemo`** — causa re-renders innecesarios | FE (`ContextoBusqueda.jsx`) | Performance |
| 16 | **Sin máximo `limit` en películas** — podrían pedir `limit=9999999` | BE (`pelicula.service.js`) | Abuso de API |
| 17 | **Búsqueda por género sin paginación** — devuelve todos los resultados | BE (`pelicula.service.js:getByGenero`) | Performance |

## 🔵 Bajo (código/mejora)

| # | Problema | Dónde | Impacto |
|---|---|---|---|
| 18 | `ProtectedRoute` no hace nada — se importa pero no se usa | FE (`App.jsx`) | Código muerto |
| 19 | Footer con links `href="#"` | FE (`Footer.jsx`) | UX |
| 20 | `useNavigate` importado y no usado en Movies | FE (`Movies.jsx`) | Código muerto |
| 21 | `favoritos.service.js` sin usar | BE (`services/`) | Código muerto |
| 22 | `prismaClient.js` duplicado | BE (`src/prisma/` y `prisma/`) | Confusión |
| 23 | Sin índices DB en columnas filtradas (`Genre`, `Title`, `Director`) | BE (`schema.prisma`) | Queries lentas |
| 24 | Sin validación de email en create user | BE (`admin.controller.js`) | Datos inválidos |

---

## Notas adicionales

- **CORS** permite origen `null`, lo que es riesgoso si se despliega
- No hay **rate limiting** en ningún endpoint
- No hay **Prisma indexes** en columnas de búsqueda frecuente

## Estado actual

### Resueltos (Junio 2026)

| # | Problema | Fix |
|---|---|---|
| 11 | Doble fetch inicial en Home.jsx | Flag `cargaInicial` ref en Home.jsx |
| 12 | Sin cancelación de requests | AbortController en Home.jsx + signal en fetch |
| 13 | Sin caché | `utils/cache.js` con TTL, integrado en servicios |
| 14 | `mapearPelicula` duplicado | Unificado en `utils/mapearPelicula.js` |
| 15 | ContextBusqueda sin `useMemo` | Valor del provider envuelto en `useMemo` |
| 16 | Sin máximo `limit` en películas | `MAX_LIMIT = 100` en `pelicula.service.js` |
| 17 | Búsqueda por género sin paginación | `getByGenero` ahora acepta page/limit |

Además se implementó **cursor-based pagination** (reemplazando page/offset) para mejor performance en la DB.

### Pendientes

1. 🔴 #1, #2, #3, #4, #5, #6 — Seguridad primero
2. 🟡 #7, #8, #9 — UX y performance
3. 🔵 #18-24 — Limpieza de código
