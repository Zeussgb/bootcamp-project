const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

// MIDDLEWARES GLOBALES

//Permite que el frontend pueda hacer peticiones al servidor
app.use(cors())

// Convierte el JSON que llega en las peticiones en objetos de JavaScript
app.use(express.json())

// Middleware de auditoría: registra cada petición en la consola
app.use((req, res, next) => {
  const inicio = performance.now()

  res.on('finish', () => {
    const duracion = performance.now() - inicio
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion.toFixed(2)}ms)`)
  })

  next()
})

// RUTAS
app.use('/api/v1/tasks', taskRoutes)

// MIDDLEWARE DE ERRORES (siempre al final)
app.use((err, req, res, next) => {
  // Si el error es NOT_FOUND devolvemos 404
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }

  // Para cualquier otro error devolvemos 500
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`)
})      