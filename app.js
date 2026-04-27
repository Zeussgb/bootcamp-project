// DATOS

// Array (guardamos todas las tareas)
let tareas = []

// Variable (genera IDs únicos para cada tarea)
let nextId = 1

// Variables para el filtro y la búsqueda
let filtroActivo = 'todas'
let textoBusqueda = ''

// Variable para el drag & drop (guarda el id de la tarea que se está arrastrando)
let dragId = null

// Configuración de colores y textos para cada prioridad
const PRIORIDAD_CONFIG = {
  alta:  { texto: '🔴 Alta',  clase: 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-300' },
  media: { texto: '🟡 Media', clase: 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900 dark:text-amber-300' },
  baja:  { texto: '🟢 Baja',  clase: 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300' }
}

/**
 * Guarda las tareas y el nextId en LocalStorage
 */
function guardarEnStorage() {
  localStorage.setItem('tareas', JSON.stringify(tareas))
  localStorage.setItem('nextId', nextId)
}

/**
 * Carga las tareas y el nextId desde LocalStorage
 * Si no hay datos guardados el array se queda vacío
 */
function cargarDeStorage() {
  const tareasGuardadas = localStorage.getItem('tareas')
  const idGuardado = localStorage.getItem('nextId')

  // Si hay datos guardados los cargamos, si no el array se queda vacío
  if (tareasGuardadas !== null) {
    tareas = JSON.parse(tareasGuardadas)
  }

  // Recuperamos también el último id para que no se repitan
  if (idGuardado !== null) {
    nextId = parseInt(idGuardado)
  }
}


// REFERENCIAS AL HTML

// Cogemos elementos del HTML y los ponemos como variables para usarlos aqui
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


// FUNCIONES PRINCIPALES

/**
 * Crea y devuelve un objeto tarea nuevo
 * @param {string} titulo - El texto de la tarea
 * @param {string} prioridad - La prioridad: 'alta', 'media' o 'baja'
 * @param {string} fecha - La fecha límite (opcional)
 * @returns {Object} El objeto tarea creado
 */
function crearTarea(titulo, prioridad, fecha) {
  return {
    id: nextId++,
    title: titulo,
    completed: false,
    createdAt: new Date().toLocaleDateString('es-ES'),
    priority: prioridad,
    deadline: fecha || null // Si no hay fecha guardamos null
  }
}

/**
 * Añade una tarea nueva al array y actualiza la pantalla
 * @param {string} titulo - El texto de la tarea
 * @param {string} prioridad - La prioridad: 'alta', 'media' o 'baja'
 * @param {string} fecha - La fecha límite (opcional)
 */
function añadirTarea(titulo, prioridad, fecha) {
  const tarea = crearTarea(titulo, prioridad, fecha)
  tareas.push(tarea)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage()
}

/**
 * Cambia el estado de una tarea entre completada y pendiente
 * @param {number} id - El id de la tarea a cambiar
 */
function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  // Si la tarea no existe no hacemos nada
  if (!tarea) return
  tarea.completed = !tarea.completed
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage()
}

/**
 * Elimina una tarea del array con animación de salida
 * Si el elemento no está en el DOM lo borra directamente del array
 * @param {number} id - El id de la tarea a eliminar
 */
function eliminarTarea(id) {
  const elemento = document.querySelector(`[data-id="${id}"]`)

  if (elemento) {
    elemento.classList.add('tarea-exit')
    setTimeout(() => {
      tareas = tareas.filter(t => t.id !== id)
      renderizarTareas()
      actualizarEstadisticas()
      guardarEnStorage()
    }, 300)
  } else {
    // Si el elemento no está en el DOM lo borramos directamente del array
    tareas = tareas.filter(t => t.id !== id)
    actualizarEstadisticas()
    guardarEnStorage()
  }
}

/**
 * Marca todas las tareas como completadas
 */
function marcarTodas() {
  tareas.forEach(t => t.completed = true)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage()
}

/**
 * Elimina todas las tareas que están completadas
 */
function borrarCompletadas() {
  tareas = tareas.filter(t => t.completed === false)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage()
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

  // Convertimos al formato DD/MM/YYYY para mostrar
  const partes = fecha.split('-')
  const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`

  if (fechaLimite < hoy) {
    // La fecha ya pasó → rojo
    return { texto: `⚠️ ${fechaFormateada}`, clase: 'text-red-500 dark:text-red-400' }
  } else if (fechaLimite.getTime() === hoy.getTime()) {
    // Es hoy → naranja
    return { texto: `🔔 Hoy`, clase: 'text-amber-500 dark:text-amber-400' }
  } else {
    // Fecha futura → gris normal
    return { texto: `📅 ${fechaFormateada}`, clase: 'text-gray-400 dark:text-gray-500' }
  }
}

/**
 * Dibuja todas las tareas filtradas en el HTML
 * Vacía la lista primero para evitar duplicados
 */
function renderizarTareas() {
  // Primero vaciamos la lista de esta forma evitamos duplicados
  listaTareas.innerHTML = ''

  // Usamos la función separada en vez de hacer el filtrado aquí
  const tareasFiltradas = obtenerTareasFiltradas()

  // Si no hay tareas mostramos un mensaje
  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p id="mensaje-vacio" class="text-gray-400 text-sm mt-2">No hay tareas todavía. ¡Añade una!</p>'
    return
  }

  // Recorremos el array y creamos un elemento HTML por cada tarea
  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li')

    // Guardamos el id en el elemento para poder encontrarlo luego (para la animación de borrado)
    li.dataset.id = tarea.id

    li.classList.add(
      'tarea-enter',     // animación de entrada
      'flex', 'items-center', 'gap-3', 'bg-white', 'dark:bg-gray-800',
      'px-4', 'py-3', 'rounded-lg', 'border', 'border-gray-200',
      'dark:border-gray-700', 'shadow', 'cursor-grab'
    )

    // Si está completada le añadimos opacidad para diferenciarla
    if (tarea.completed) {
      li.classList.add('opacity-60')
    }

    // Cogemos la configuración de color del badge según la prioridad
    const prioridad = PRIORIDAD_CONFIG[tarea.priority] || PRIORIDAD_CONFIG.media

    // Preparamos el HTML de la fecha límite si existe
    const fechaHTML = tarea.deadline
      ? (() => {
          const { texto, clase } = formatearFecha(tarea.deadline)
          return `<span class="text-xs ${clase} flex-shrink-0">${texto}</span>`
        })()
      : ''

    // Escribimos el HTML de dentro de cada tarjeta
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

    // DRAG & DROP: eventos de arrastrar
    li.setAttribute('draggable', 'true')

    // Cuando empieza a arrastrarse esta tarea
    li.addEventListener('dragstart', () => {
      dragId = tarea.id
      li.classList.add('opacity-50')
    })

    // Cuando se suelta el ratón (termine de arrastrar)
    li.addEventListener('dragend', () => {
      dragId = null
      li.classList.remove('opacity-50')
    })

    // Cuando otra tarea está siendo arrastrada encima de esta
    li.addEventListener('dragover', (e) => {
      e.preventDefault() // necesario para que funcione el drop
      li.classList.add('drag-over')
    })

    // Cuando la tarea arrastrada sale de encima de esta
    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over')
    })

    // Cuando soltamos la tarea arrastrada encima de esta
    li.addEventListener('drop', () => {
      li.classList.remove('drag-over')

      // Si es la misma tarea no hacemos nada
      if (dragId === null || dragId === tarea.id) return

      // Buscamos las posiciones de ambas tareas en el array original
      const fromIndex = tareas.findIndex(t => t.id === dragId)
      const toIndex = tareas.findIndex(t => t.id === tarea.id)

      // Sacamos la tarea arrastrada de su posición y la insertamos en la nueva
      const tareaArrastrada = tareas.splice(fromIndex, 1)[0]
      tareas.splice(toIndex, 0, tareaArrastrada)

      guardarEnStorage()
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
function editarTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  // Si la tarea no existe no hacemos nada
  if (!tarea) return
  const nuevoTitulo = prompt('Edita el título de la tarea:', tarea.title)
  if (nuevoTitulo === null || nuevoTitulo.trim() === '') return
  tarea.title = nuevoTitulo.trim()
  renderizarTareas()
  guardarEnStorage()
}


// MODO OSCURO

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
  // Guardamos la preferencia en LocalStorage
  localStorage.setItem('modoOscuro', activar)
}

btnDarkMode.addEventListener('click', function() {
  // Comprobamos si el modo oscuro está activo ahora mismo
  const estaActivo = document.documentElement.classList.contains('dark')
  // Lo cambiamos al contrario
  aplicarModoOscuro(!estaActivo)
})


// EVENTOS

// Cuando se envía el formulario
form.addEventListener('submit', function(e) {
  // Evitamos que la página se recargue (comportamiento por defecto del form)
  e.preventDefault()

  const titulo = inputTarea.value.trim()
  const prioridad = selectPrioridad.value
  const fecha = inputFecha.value // Puede estar vacío si no se seleccionó fecha

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

  añadirTarea(titulo, prioridad, fecha)

  // Limpiamos el formulario después de añadir
  inputTarea.value = ''
  selectPrioridad.value = 'media'
  inputFecha.value = ''
})

// Cuando se hace clic en un filtro
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', function() {
    // Quitamos la clase 'activo' de todos los botones
    botonesFiltro.forEach(b => b.classList.remove('activo', 'bg-indigo-500', 'text-white'))
    // Se la ponemos solo al que han pulsado
    this.classList.add('activo', 'bg-indigo-500', 'text-white')
    // Guardamos qué filtro está activo
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
cargarDeStorage()
renderizarTareas()
actualizarEstadisticas()