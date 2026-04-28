// URL base de nuestra API
const API_URL = 'http://localhost:3000/api/v1/tasks';

/**
 * Obtiene todas las tareas del servidor
 * @returns {Promise<Array>} Lista de tareas
 */
const getTasks = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al obtener las tareas')
  return response.json()
}

/**
 * Crea una tarea nueva en el servidor
 * @param {Object} tarea - Objeto con title, priority y deadline
 * @returns {Promise<Object>} La tarea creada
 */
const createTask = async (tarea) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarea)
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  return response.json()
}

/**
 * Actualiza una tarea existente en el servidor
 * @param {number} id - El id de la tarea
 * @param {Object} datos - Los campos a actualizar
 * @returns {Promise<Object>} La tarea actualizada
 */
const updateTask = async (id, datos) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  return response.json()
}

/**
 * Elimina una tarea del servidor
 * @param {number} id - El id de la tarea a eliminar
 */
const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error al eliminar la tarea')
}