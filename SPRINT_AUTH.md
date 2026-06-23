# Sprint: Autenticación JWT

> TP obligatorio — Seguridad, Autenticación y JWT
> Branch: `feature/admin-layout`
> Asignación: Mateo Garcia (PM) + Ignacio Bonorino

---

## Dependencias entre tareas

```
1 → 2 → 3 → 4
         ↓
1 → 6 → 7
         ↓
         14
         ↑
8 → 9 → 13 → 15 → 16
  → 10
  → 11
  → 12
```

---

## Fase 1 — Backend: Auth endpoints

| # | Tarea | Archivos | Asignado |
|---|-------|----------|----------|
| 1 | `auth.service.js` — register (hash password + crear usuario), login (verificar credenciales + firmar JWT), me (devolver usuario por ID del token) | `backend/src/services/auth.service.js` | Mateo |
| 2 | `auth.controller.js` — handlers register (POST), login (POST), logout (POST), me (GET) | `backend/src/controllers/auth.controller.js` | Mateo |
| 3 | `auth.routes.js` — `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | `backend/src/routes/auth.routes.js` | Ignacio |
| 4 | Montar `auth.routes.js` en `app.js` con `app.use("/auth", authRouter)` | `backend/src/app.js` | Ignacio |
| 5 | Validaciones de entrada: email formato, password ≥ 6 caracteres, name requerido en register | `backend/src/validations/auth.validation.js` | Ignacio |

## Fase 2 — Backend: Favoritos protegidos

| # | Tarea | Archivos | Asignado |
|---|-------|----------|----------|
| 6 | Refactor `getFavoritos` para leer `userId` del token (`req.user.id`) en vez de query param. Refactor `toggleFavorito` para leer `userId` del token en vez del body | `backend/src/controllers/pelicula.controller.js` | Mateo |
| 7 | Agregar middleware `authenticate` a las rutas `PATCH /:id/favorito` y `GET /favoritas` | `backend/src/routes/pelicula.routes.js` | Mateo |

## Fase 3 — Frontend: Auth + formularios

| # | Tarea | Archivos | Asignado |
|---|-------|----------|----------|
| 8 | `AuthContext.jsx` — estado global con `user`, `token`, funciones `login()`, `register()`, `logout()`. Token guardado en localStorage. Al montar, si hay token en localStorage, llamar a `/auth/me` para recuperar el usuario | `frontend/src/context/AuthContext.jsx` | Ignacio |
| 9 | `auth.service.js` — funciones `loginApi(email, password)`, `registerApi(name, email, password)`, `getMeApi(token)` que llaman al backend | `frontend/src/services/auth.service.js` | Ignacio |
| 10 | `Login.jsx` — formulario con email + password, muestra error si credenciales inválidas | `frontend/src/pages/Login/Login.jsx` | Ignacio |
| 11 | `Register.jsx` — formulario con name + email + password + confirmar password | `frontend/src/pages/Register/Register.jsx` | Ignacio |
| 12 | `ProtectedRoute.jsx` — componente que envuelve rutas, si no hay token redirige a `/login` | `frontend/src/Components/ProtectedRoute/ProtectedRoute.jsx` | Ignacio |

## Fase 4 — Frontend: Integración favoritos + auth

| # | Tarea | Archivos | Asignado |
|---|-------|----------|----------|
| 13 | Actualizar `obtenerFavoritos.js` — enviar `Authorization: Bearer <token>` en los headers. Sacar `idUsuario` hardcodeado del body y query | `frontend/src/services/obtenerFavoritos.js` | Ignacio |
| 14 | El backend ya no acepta `userId` por body/query — lo saca del token. Confirmar que el refactor de la Fase 2 lo maneje | (backend, ya cubierto en #6) | — |
| 15 | Agregar botón "Login" / "Logout" en Header según si hay usuario autenticado. Avatar o iniciales del nombre | `frontend/src/Components/Header/Header.jsx` | Ignacio |
| 16 | Proteger ruta `/favoritos` con `ProtectedRoute`. Agregar rutas `/login` y `/register` en `App.jsx` | `frontend/src/App.jsx` | Ignacio |

## Fase 5 — Seguridad + documentación

| # | Tarea | Archivos | Asignado |
|---|-------|----------|----------|
| 17 | Proteger `/api/admin/*` con middleware `authenticate` + `requireAdmin` | `backend/src/routes/admin.routes.js` | Mateo |
| 18 | Excluir password de respuestas de usuario en `admin.service.js` (select sin password o borrarlo de la respuesta) | `backend/src/services/admin.service.js` | Mateo |
| 19 | Actualizar README de backend y frontend con endpoints de auth, setup, ejemplos | `README.md` ambos | Cualquiera |
| 20 | Tests de integración: register → login (recibe token) → GET /auth/me con token → PATCH favorito con token | `backend/tests/auth.test.js` | Mateo |

---

## Resumen por persona

**Mateo (PM)** — 1, 2, 6, 7, 17, 18, 20 → Backend (lógica de auth + seguridad + tests)
**Ignacio** — 8, 9, 10, 11, 12, 13, 15, 16 → Frontend (contexto, formularios, integración)
**Cualquiera** — 3, 4, 5, 14, 19 → Cosas cortas (rutas, validaciones, README)
