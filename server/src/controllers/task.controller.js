const taskService = require('../services/task.service');

/**
 * GET /api/v1/tasks
 * Devuelve todas las tareas
 */
const getTasks = (req, res) => {
  const tareas = taskService.obtenerTodas()
  res.status(200).json(tareas) 
}

/**
 * POST /api/v1/tasks
 * Crea una nueva tarea
 */
const createTask = (req, res, next) => {
    try {
        const { title, priority, deadline } = req.body

    // Validación: el título es obligatorio y debe tener al menos 3 caracteres
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        error: 'El título es obligatorio y debe tener al menos 3 caracteres'
      })
    }

    // Validación: la prioridad debe ser una de las tres opciones válidas
    const prioridadesValidas = ['alta', 'media', 'baja']
    if (priority && !prioridadesValidas.includes(priority)) {
      return res.status(400).json({
        error: 'La prioridad debe ser alta, media o baja'
      })
    }

    const tarea = taskService.crearTarea({ title: title.trim(), priority, deadline })
    res.status(201).json(tarea)

  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/v1/tasks/:id
 * Actualiza una tarea existente
 */
const updateTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    // Validación: el id debe ser un número válido
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El id debe ser un número válido' })
    }

    const tarea = taskService.actualizarTarea(id, req.body)
    res.status(200).json(tarea)

  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/v1/tasks/:id
 * Elimina una tarea por su id
 */
const deleteTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    // Validación: el id debe ser un número válido
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El id debe ser un número válido' })
    }

    taskService.eliminarTarea(id)
    res.status(204).send()

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
}