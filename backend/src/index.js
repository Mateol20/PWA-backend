import express from 'express';
import peliculaRoutes from './routes/pelicula.routes.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
"status": "ok",
"message": "API funcionando correctamente"
});
});

app.use('/api', peliculaRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});