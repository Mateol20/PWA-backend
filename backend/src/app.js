import express from "express";
import peliculasRouter from "./routes/pelicula.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API funcionando correctamente" });
});

app.use("/api/peliculas", peliculasRouter);

app.use(errorHandler);

export default app;
