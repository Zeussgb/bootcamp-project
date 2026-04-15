// DATOS

// Array (guardamos todas las tareas)
let tareas = []

// Variable (genera IDs únicos para cada tarea)
let nextId = 1
let filtroActivo = 'todas'
let textoBusqueda = ''

// Guarda las tareas en LocalStorage
function guardarEnStorage() {
  localStorage.setItem('tareas', JSON.stringify(tareas))
  localStorage.setItem('nextId', nextId)
}

// Recupera las tareas de LocalStorage
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
const listaTareas = document.getElementById('lista-tareas')
const statTotal = document.getElementById('stat-total')
const statCompletadas = document.getElementById('stat-completadas')
const statPendientes = document.getElementById('stat-pendientes')
const btnMarcarTodas = document.getElementById('btn-marcar-todas')
const btnBorrarCompletadas = document.getElementById('btn-borrar-completadas')
const inputBusqueda = document.getElementById('input-busqueda')
const botonesFiltro = document.querySelectorAll('.filtro')


// FUNCIONES PRINCIPALES

// Crea un objeto tarea nuevo
function crearTarea(titulo) {
  return {
    id: nextId++,
    title: titulo,
    completed: false,
    createdAt: new Date().toLocaleDateString('es-ES')
  }
}

// Añade una tarea al array y actualiza la pantalla
function añadirTarea(titulo) {
  const tarea = crearTarea(titulo)
  tareas.push(tarea)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage() // ← CAMBIO 2
}

// Marca una tarea como completada o pendiente
function toggleTarea(id) {
  // Buscamos la tarea que tiene ese id
  const tarea = tareas.find(t => t.id === id)
  // Le cambiamos el estado: si era true pasa a false y si era false pasa a true
  tarea.completed = !tarea.completed
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage() // ← CAMBIO 2
}

// Esta funcion elimina una tarea del array
function eliminarTarea(id) {
  // Se queda solo con las tareas que NO tienen ese id
  tareas = tareas.filter(t => t.id !== id)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage() // ← CAMBIO 2
}

// Esta funcion marca todas las tareas como completadas
function marcarTodas() {
  tareas.forEach(t => t.completed = true)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage() // ← CAMBIO 2
}

// Esta funcion elimina todas las tareas que están completadas
function borrarCompletadas() {
  tareas = tareas.filter(t => t.completed === false)
  renderizarTareas()
  actualizarEstadisticas()
  guardarEnStorage() // ← CAMBIO 2
}


// RENDERIZAR (pintar las tareas en el HTML)

// Esta funcion dibuja todas las tareas en el HTML
function renderizarTareas() {
  listaTareas.innerHTML = ''

  // Filtramos según el botón activo
  let tareasFiltradas = tareas.filter(t => {
    if (filtroActivo === 'pendientes') return t.completed === false
    if (filtroActivo === 'completadas') return t.completed === true
    return true // 'todas'
  })

  // Filtramos también por el texto de búsqueda
  if (textoBusqueda !== '') {
    tareasFiltradas = tareasFiltradas.filter(t =>
      t.title.toLowerCase().includes(textoBusqueda.toLowerCase())
    )
  }

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p id="mensaje-vacio">No hay tareas todavía. ¡Añade una!</p>'
    return
  }

  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li')
    li.classList.add('tarea')

    if (tarea.completed) {
      li.classList.add('completada')
    }

    li.innerHTML = `
      <input 
        type="checkbox" 
        ${tarea.completed ? 'checked' : ''}
        onchange="toggleTarea(${tarea.id})"
      >
      <span class="tarea-titulo">${tarea.title}</span>
      <button class="btn-editar" onclick="editarTarea(${tarea.id})">Editar</button>
      <button class="btn-eliminar" onclick="eliminarTarea(${tarea.id})">Borrar</button>
    `

    listaTareas.appendChild(li)
  })
}

// Actualiza los números de las estadísticas
function actualizarEstadisticas() {
  const total = tareas.length
  const completadas = tareas.filter(t => t.completed === true).length
  const pendientes = total - completadas

  statTotal.textContent = total
  statCompletadas.textContent = completadas
  statPendientes.textContent = pendientes
}


// EDITAR TAREA

function editarTarea(id) {
  const tarea = tareas.find(t => t.id === id)

  // Pedimos al usuario un nuevo título con el actual como valor por defecto
  const nuevoTitulo = prompt('Edita el título de la tarea:', tarea.title)

  // Si el usuario canceló o dejó el campo vacío no hacemos nada
  if (nuevoTitulo === null || nuevoTitulo.trim() === '') return

  tarea.title = nuevoTitulo.trim()
  renderizarTareas()
  guardarEnStorage() // ← CAMBIO 2
}


// EVENTOS

// Cuando se envía el formulario
form.addEventListener('submit', function(e) {
  // Evitamos que la página se recargue (comportamiento por defecto del form)
  e.preventDefault()

  const titulo = inputTarea.value.trim()

  // Si el input está vacío no hacemos nada
  if (titulo === '') {
    alert('Por favor escribe una tarea')
    return
  }

  añadirTarea(titulo)

  // Limpiamos el input después de añadir
  inputTarea.value = ''
})

// Cuando se pulsa "Marcar todas"
btnMarcarTodas.addEventListener('click', marcarTodas)

// Cuando se pulsa "Borrar completadas"
btnBorrarCompletadas.addEventListener('click', borrarCompletadas)

// Cuando se hace clic en un filtro
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', function() {
    // Quitamos la clase 'activo' de todos los botones
    botonesFiltro.forEach(b => b.classList.remove('activo'))
    // Se la ponemos solo al que han pulsado
    this.classList.add('activo')
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

// ARRANQUE

cargarDeStorage() // ← CAMBIO 3: carga los datos antes de renderizar
renderizarTareas()
actualizarEstadisticas()