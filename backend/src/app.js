import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import peliculasRouter from "./routes/pelicula.routes.js";
import translationsRouter from "./routes/translations.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const frontendUrl = process.env.FRONTEND_URL || "https://pwa-frontend-roan.vercel.app";
const origenesPermitidos = [
  frontendUrl,
  "http://localhost:5173",
  "http://localhost:4173",
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origenesPermitidos.includes(origin)) return cb(null, true);
    cb(null, false);
  },
}));
app.use(express.json());
app.use("/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static(path.join(__dirname, "..", "public", "images")));
app.use("/api/translations", translationsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

app.use("/api/peliculas", peliculasRouter);

app.use(errorHandler);

export default app;
