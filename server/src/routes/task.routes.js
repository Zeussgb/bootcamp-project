const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// GET /api/v1/tasks → obtener todas las tareas
router.get('/', taskController.getTasks)

// POST /api/v1/tasks → crear una tarea nueva
router.post('/', taskController.createTask)

// PATCH /api/v1/tasks/:id → actualizar una tarea
router.patch('/:id', taskController.updateTask)

// DELETE /api/v1/tasks/:id → eliminar una tarea
router.delete('/:id', taskController.deleteTask)

module.exports = router