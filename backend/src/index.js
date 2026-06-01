import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
"status": "ok",
"message": "API funcionando correctamente"
});
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});