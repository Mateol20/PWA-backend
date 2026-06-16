import express from "express";
import cors from "cors";
import peliculasRouter from "./routes/pelicula.routes.js";
import translationsRouter from "./routes/translations.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/translations", translationsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

app.use("/api/peliculas", peliculasRouter);

app.use(errorHandler);

export default app;
