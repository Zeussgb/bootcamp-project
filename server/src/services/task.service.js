// Array en memoria que simula la base de datos
// (en la siguiente fase lo reemplazaremos por una base de datos real)
let tasks = []
let nextId = 1

/**
 * Devuelve todas las tareas
 * @returns {Array} Array de tareas
 */
const obtenerTodas = () => {
  return tasks
}

/**
 * Crea una nueva tarea y la añade al array
 * @param {Object} data - objeto con los datos de la tarea
 * @returns {Object} La tarea creada
 */
const crearTarea = (data) => {
  const tarea = {
    id: nextId++,
    title: data.title,
    completed: false,
    priority: data.priority || 'media',
    deadline: data.deadline || null,
    createdAt: new Date().toLocaleDateString('es-ES')
  }
  tasks.push(tarea)
  return tarea
}

/**
 * Elimina una tarea por su id
 * Si no existe lanza un error
 * @param {number} id - El id de la tarea a eliminar
 */
const eliminarTarea = (id) => {
    const index = tasks.findIndex(t => t.id === id)

    // Si no se encuentra la tarea, lanzamos un error
if (index === -1) {
  throw new Error('NOT_FOUND')
}

    tasks.splice(index, 1)
}

/**
 * Actualiza una tarea existente
 * Si no existe lanza un error
 * @param {number} id - El id de la tarea a actualizar
 * @param {Object} data - Los campos a actualizar
 * @returns {Object} La tarea actualizada
 */
const actualizarTarea = (id, data) => {
  const tarea = tasks.find(t => t.id === id)

    // Si no encontramos la tarea lanzamos un error
  if (!tarea) {
    throw new Error('NOT_FOUND')
  }

  // Solo actualizamos los campos que nos mandan
  if (data.title !== undefined) tarea.title = data.title
  if (data.completed !== undefined) tarea.completed = data.completed
  if (data.priority !== undefined) tarea.priority = data.priority
  if (data.deadline !== undefined) tarea.deadline = data.deadline

  return tarea
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea
}