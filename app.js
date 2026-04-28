// DATOS

// Array donde guardamos las tareas (ahora vienen del servidor)
let tareas = []

// Variables para el filtro y la búsqueda
let filtroActivo = 'todas'
let textoBusqueda = ''

// Variable para el drag & drop
let dragId = null

// Configuración de colores y textos para cada prioridad
const PRIORIDAD_CONFIG = {
  alta:  { texto: '🔴 Alta',  clase: 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-300' },
  media: { texto: '🟡 Media', clase: 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900 dark:text-amber-300' },
  baja:  { texto: '🟢 Baja',  clase: 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300' }
}


// REFERENCIAS AL HTML

const form = document.getElementById('form-nueva-tarea')
const inputTarea = document.getElementById('input-tarea')
const inputBusqueda = document.getElementById('input-busqueda')
const inputFecha = document.getElementById('input-fecha')
const selectPrioridad = document.getElementById('select-prioridad')
const listaTareas = document.getElementById('lista-tareas')
const statTotal = document.getElementById('stat-total')
const statCompletadas = document.getElementById('stat-completadas')
const statPendientes = document.getElementById('stat-pendientes')
const btnMarcarTodas = document.getElementById('btn-marcar-todas')
const btnBorrarCompletadas = document.getElementById('btn-borrar-completadas')
const botonesFiltro = document.querySelectorAll('.filtro')
const btnDarkMode = document.getElementById('btn-dark-mode')


// ESTADOS DE LA UI

/**
 * Muestra un mensaje de carga mientras esperamos al servidor
 */
function mostrarCargando() {
  listaTareas.innerHTML = '<p class="text-gray-400 text-sm mt-2 animate-pulse">Cargando tareas...</p>'
}

/**
 * Muestra un mensaje de error si el servidor no responde
 * @param {string} mensaje - El mensaje de error a mostrar
 */
function mostrarError(mensaje) {
  listaTareas.innerHTML = `<p class="text-red-400 text-sm mt-2">❌ ${mensaje}</p>`
}


// FUNCIONES PRINCIPALES

/**
 * Carga todas las tareas desde el servidor y las muestra en pantalla
 */
async function cargarTareas() {
  mostrarCargando()
  try {
    tareas = await getTasks()
    renderizarTareas()
    actualizarEstadisticas()
  } catch (error) {
    mostrarError('No se pudo conectar con el servidor. ¿Está corriendo?')
  }
}

/**
 * Añade una tarea nueva enviándola al servidor
 * @param {string} titulo - El texto de la tarea
 * @param {string} prioridad - La prioridad: 'alta', 'media' o 'baja'
 * @param {string} fecha - La fecha límite (opcional)
 */
async function añadirTarea(titulo, prioridad, fecha) {
  try {
    const tarea = await createTask({ title: titulo, priority: prioridad, deadline: fecha || null })
    tareas.push(tarea)
    renderizarTareas()
    actualizarEstadisticas()
  } catch (error) {
    alert('Error al añadir la tarea: ' + error.message)
  }
}

/**
 * Cambia el estado de una tarea entre completada y pendiente
 * @param {number} id - El id de la tarea a cambiar
 */
async function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  if (!tarea) return
  try {
    const tareaActualizada = await updateTask(id, { completed: !tarea.completed })
    tarea.completed = tareaActualizada.completed
    renderizarTareas()
    actualizarEstadisticas()
  } catch (error) {
    alert('Error al actualizar la tarea: ' + error.message)
  }
}

/**
 * Elimina una tarea del servidor con animación de salida
 * @param {number} id - El id de la tarea a eliminar
 */
async function eliminarTarea(id) {
  const elemento = document.querySelector(`[data-id="${id}"]`)

  if (elemento) {
    elemento.classList.add('tarea-exit')
    setTimeout(async () => {
      try {
        await deleteTask(id)
        tareas = tareas.filter(t => t.id !== id)
        renderizarTareas()
        actualizarEstadisticas()
      } catch (error) {
        alert('Error al eliminar la tarea: ' + error.message)
        renderizarTareas() // Volvemos a mostrar la tarea si falló
      }
    }, 300)
  }
}

/**
 * Marca todas las tareas como completadas
 */
async function marcarTodas() {
  try {
    // Actualizamos todas las tareas pendientes en el servidor
    const promesas = tareas
      .filter(t => !t.completed)
      .map(t => updateTask(t.id, { completed: true }))
    await Promise.all(promesas)
    // Recargamos las tareas del servidor
    await cargarTareas()
  } catch (error) {
    alert('Error al marcar las tareas: ' + error.message)
  }
}

/**
 * Elimina todas las tareas completadas del servidor
 */
async function borrarCompletadas() {
  try {
    // Borramos todas las tareas completadas en el servidor
    const promesas = tareas
      .filter(t => t.completed)
      .map(t => deleteTask(t.id))
    await Promise.all(promesas)
    // Recargamos las tareas del servidor
    await cargarTareas()
  } catch (error) {
    alert('Error al borrar las tareas: ' + error.message)
  }
}


// RENDERIZAR (pintar las tareas en el HTML)

/**
 * Devuelve las tareas filtradas según el filtro activo y el texto de búsqueda
 * @returns {Array} Array de tareas filtradas
 */
function obtenerTareasFiltradas() {
  let tareasFiltradas = tareas.filter(t => {
    if (filtroActivo === 'pendientes') return t.completed === false
    if (filtroActivo === 'completadas') return t.completed === true
    return true // 'todas'
  })

  if (textoBusqueda !== '') {
    tareasFiltradas = tareasFiltradas.filter(t =>
      t.title.toLowerCase().includes(textoBusqueda.toLowerCase())
    )
  }

  return tareasFiltradas
}

/**
 * Formatea una fecha del formato YYYY-MM-DD al formato DD/MM/YYYY
 * y comprueba si la tarea está vencida o es para hoy
 * @param {string} fecha - La fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con el texto formateado y la clase de color
 */
function formatearFecha(fecha) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaLimite = new Date(fecha + 'T00:00:00')

  const partes = fecha.split('-')
  const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`

  if (fechaLimite < hoy) {
    return { texto: `⚠️ ${fechaFormateada}`, clase: 'text-red-500 dark:text-red-400' }
  } else if (fechaLimite.getTime() === hoy.getTime()) {
    return { texto: `🔔 Hoy`, clase: 'text-amber-500 dark:text-amber-400' }
  } else {
    return { texto: `📅 ${fechaFormateada}`, clase: 'text-gray-400 dark:text-gray-500' }
  }
}

/**
 * Dibuja todas las tareas filtradas en el HTML
 * Vacía la lista primero para evitar duplicados
 */
function renderizarTareas() {
  listaTareas.innerHTML = ''

  const tareasFiltradas = obtenerTareasFiltradas()

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p id="mensaje-vacio" class="text-gray-400 text-sm mt-2">No hay tareas todavía. ¡Añade una!</p>'
    return
  }

  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li')
    li.dataset.id = tarea.id

    li.classList.add(
      'tarea-enter',
      'flex', 'items-center', 'gap-3', 'bg-white', 'dark:bg-gray-800',
      'px-4', 'py-3', 'rounded-lg', 'border', 'border-gray-200',
      'dark:border-gray-700', 'shadow', 'cursor-grab'
    )

    if (tarea.completed) {
      li.classList.add('opacity-60')
    }

    const prioridad = PRIORIDAD_CONFIG[tarea.priority] || PRIORIDAD_CONFIG.media

    const fechaHTML = tarea.deadline
      ? (() => {
          const { texto, clase } = formatearFecha(tarea.deadline)
          return `<span class="text-xs ${clase} flex-shrink-0">${texto}</span>`
        })()
      : ''

    li.innerHTML = `
      <span class="text-gray-300 dark:text-gray-600 cursor-grab select-none text-lg flex-shrink-0" title="Arrastra para reordenar">⠿</span>
      <input
        type="checkbox"
        ${tarea.completed ? 'checked' : ''}
        onchange="toggleTarea(${tarea.id})"
        class="w-4 h-4 cursor-pointer accent-indigo-500 flex-shrink-0"
      >
      <span class="flex-1 text-base text-gray-800 dark:text-gray-100 break-words min-w-0 ${tarea.completed ? 'line-through text-gray-400' : ''}">${tarea.title}</span>
      ${fechaHTML}
      <span class="text-xs px-2 py-1 rounded-full flex-shrink-0 ${prioridad.clase}">${prioridad.texto}</span>
      <button
        class="text-gray-400 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-xs hover:border-indigo-500 hover:text-indigo-500 transition-colors flex-shrink-0"
        onclick="editarTarea(${tarea.id})"
        aria-label="Editar tarea"
      >Editar</button>
      <button
        class="text-red-500 border border-red-400 px-2 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition-colors flex-shrink-0"
        onclick="eliminarTarea(${tarea.id})"
        aria-label="Eliminar tarea"
      >Borrar</button>
    `

    // DRAG & DROP
    li.setAttribute('draggable', 'true')

    li.addEventListener('dragstart', () => {
      dragId = tarea.id
      li.classList.add('opacity-50')
    })

    li.addEventListener('dragend', () => {
      dragId = null
      li.classList.remove('opacity-50')
    })

    li.addEventListener('dragover', (e) => {
      e.preventDefault()
      li.classList.add('drag-over')
    })

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over')
    })

    li.addEventListener('drop', () => {
      li.classList.remove('drag-over')
      if (dragId === null || dragId === tarea.id) return

      const fromIndex = tareas.findIndex(t => t.id === dragId)
      const toIndex = tareas.findIndex(t => t.id === tarea.id)

      const tareaArrastrada = tareas.splice(fromIndex, 1)[0]
      tareas.splice(toIndex, 0, tareaArrastrada)

      renderizarTareas()
    })

    listaTareas.appendChild(li)
  })
}

/**
 * Actualiza los contadores de estadísticas en el panel lateral
 */
function actualizarEstadisticas() {
  const total = tareas.length
  const completadas = tareas.filter(t => t.completed === true).length
  const pendientes = total - completadas

  statTotal.textContent = total
  statCompletadas.textContent = completadas
  statPendientes.textContent = pendientes
}


// EDITAR TAREA

/**
 * Permite editar el título de una tarea existente mediante un prompt
 * @param {number} id - El id de la tarea a editar
 */
async function editarTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  if (!tarea) return

  const nuevoTitulo = prompt('Edita el título de la tarea:', tarea.title)
  if (nuevoTitulo === null || nuevoTitulo.trim() === '') return

  try {
    const tareaActualizada = await updateTask(id, { title: nuevoTitulo.trim() })
    tarea.title = tareaActualizada.title
    renderizarTareas()
  } catch (error) {
    alert('Error al editar la tarea: ' + error.message)
  }
}


// MODO OSCURO
// El modo oscuro sigue usando LocalStorage porque es una preferencia
// visual del usuario, no datos de la aplicación

/**
 * Activa o desactiva el modo oscuro y guarda la preferencia en LocalStorage
 * @param {boolean} activar - true para activar el modo oscuro, false para desactivarlo
 */
function aplicarModoOscuro(activar) {
  if (activar) {
    document.documentElement.classList.add('dark')
    btnDarkMode.textContent = 'Modo claro'
  } else {
    document.documentElement.classList.remove('dark')
    btnDarkMode.textContent = 'Modo oscuro'
  }
  localStorage.setItem('modoOscuro', activar)
}

btnDarkMode.addEventListener('click', function() {
  const estaActivo = document.documentElement.classList.contains('dark')
  aplicarModoOscuro(!estaActivo)
})


// EVENTOS

// Cuando se envía el formulario
form.addEventListener('submit', async function(e) {
  e.preventDefault()

  const titulo = inputTarea.value.trim()
  const prioridad = selectPrioridad.value
  const fecha = inputFecha.value

  if (titulo === '') {
    alert('Por favor escribe una tarea')
    return
  }

  if (titulo.length < 3) {
    alert('El título debe tener al menos 3 caracteres')
    return
  }

  if (titulo.length > 100) {
    alert('El título no puede tener más de 100 caracteres')
    return
  }

  await añadirTarea(titulo, prioridad, fecha)

  inputTarea.value = ''
  selectPrioridad.value = 'media'
  inputFecha.value = ''
})

// Cuando se hace clic en un filtro
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', function() {
    botonesFiltro.forEach(b => b.classList.remove('activo', 'bg-indigo-500', 'text-white'))
    this.classList.add('activo', 'bg-indigo-500', 'text-white')
    filtroActivo = this.dataset.filtro
    renderizarTareas()
  })
})

// Cuando se escribe en el buscador
inputBusqueda.addEventListener('input', function() {
  textoBusqueda = this.value
  renderizarTareas()
})

// Cuando se pulsa "Marcar todas"
btnMarcarTodas.addEventListener('click', marcarTodas)

// Cuando se pulsa "Borrar completadas"
btnBorrarCompletadas.addEventListener('click', borrarCompletadas)


// ARRANQUE

const modoOscuroGuardado = localStorage.getItem('modoOscuro') === 'true'
aplicarModoOscuro(modoOscuroGuardado)
cargarTareas() // Cargamos las tareas desde el servidor