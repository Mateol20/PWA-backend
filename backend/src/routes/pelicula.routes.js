import express from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

router.get('/pelicula', async(req, res) =>{ 
try{
    const peliculas = await prisma.pelicula.findMany() 
    res.json(peliculas)   
  }catch{
res.json({ error: "Error al obtener las películas"})
  }
  })

  export default router
