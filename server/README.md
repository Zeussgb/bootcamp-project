# TaskFlow — Backend API

API RESTful construida con Node.js y Express para gestionar las tareas de TaskFlow.

---

## Requisitos previos

- Node.js v18 o superior
- npm

---

## Instalación y arranque

```bash
# Desde la raíz del proyecto, entrar en la carpeta del servidor
cd server

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
# (copiar el ejemplo y rellenar los valores)
cp .env.example .env

# Arrancar en modo desarrollo (con recarga automática)
npm run dev

# Arrancar en modo producción
npm start
```

El servidor arrancará en `http://localhost:3000` por defecto.

---

## Variables de entorno

Crea un archivo `.env` en la carpeta `server/` con estas variables:

```
PORT=3000
```

> ⚠️ Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

---

## Arquitectura de carpetas

```
server/
├── src/
│   ├── config/
│   │   └── env.js          ← Carga y valida las variables de entorno
│   ├── controllers/
│   │   └── task.controller.js  ← Extrae datos de la petición y llama al servicio
│   ├── routes/
│   │   └── task.routes.js  ← Mapea URLs y verbos HTTP a controladores
│   ├── services/
│   │   └── task.service.js ← Lógica de negocio pura (sin Express)
│   └── index.js            ← Punto de entrada, configura middlewares y arranca
├── .env                    ← Variables de entorno (no se sube a GitHub)
├── package.json
└── README.md
```

### Arquitectura por capas

El servidor sigue una arquitectura de tres capas estrictas:

**1. Capa de rutas (routes)**
Su única misión es escuchar la red y mapear cada URL y verbo HTTP al controlador correspondiente. No contiene ninguna lógica.

**2. Capa de controladores (controllers)**
Actúa como intermediario. Extrae los datos de `req.body` y `req.params`, aplica validaciones defensivas y llama al servicio. Si la validación falla devuelve un `400`. Si tiene éxito devuelve la respuesta con el código HTTP correcto.

**3. Capa de servicios (services)**
Es el corazón de la aplicación. Contiene la lógica de negocio pura y desconoce completamente la existencia de Express, HTTP, `req` o `res`. Al ser funciones puras de JavaScript, son fácilmente testeables.

---

## Middlewares

### `cors()`
Gestiona las cabeceras CORS (Cross-Origin Resource Sharing). Sin este middleware, el navegador bloquearía las peticiones del frontend al servidor por política de seguridad, ya que corren en puertos distintos (5500 y 3000).

### `express.json()`
Intercepta el flujo de datos crudo de la red y lo transforma en objetos JavaScript accesibles desde `req.body`. Sin él, el cuerpo de las peticiones POST y PATCH llegaría vacío.

### Middleware de auditoría (personalizado)
Registra en consola cada petición HTTP con su método, URL, código de estado y tiempo de respuesta. Útil para depurar y monitorizar el tráfico del servidor.

```javascript
app.use((req, res, next) => {
  const inicio = Date.now()
  res.on('finish', () => {
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${Date.now() - inicio}ms)`)
  })
  next()
})
```

### Middleware de errores (4 parámetros)
Express lo reconoce como manejador de errores porque tiene exactamente 4 parámetros `(err, req, res, next)`. Mapea el mensaje del error al código HTTP correcto: `NOT_FOUND` → 404, cualquier otro error → 500.

---

## Endpoints de la API

### Base URL
```
http://localhost:3000/api/v1
```

### GET /tasks
Devuelve todas las tareas.

**Ejemplo de petición:**
```bash
GET http://localhost:3000/api/v1/tasks
```

**Ejemplo de respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Hacer la compra",
    "completed": false,
    "priority": "alta",
    "deadline": "2026-05-01",
    "createdAt": "28/4/2026"
  }
]
```

---

### POST /tasks
Crea una tarea nueva.

**Body requerido:**
```json
{
  "title": "Nombre de la tarea",
  "priority": "alta | media | baja",
  "deadline": "2026-05-01"
}
```

**Ejemplo de respuesta (201 Created):**
```json
{
  "id": 2,
  "title": "Nombre de la tarea",
  "completed": false,
  "priority": "media",
  "deadline": null,
  "createdAt": "28/4/2026"
}
```

**Errores posibles:**
```json
// 400 Bad Request — título vacío o menor de 3 caracteres
{ "error": "El título es obligatorio y debe tener al menos 3 caracteres" }

// 400 Bad Request — prioridad inválida
{ "error": "La prioridad debe ser alta, media o baja" }
```

---

### PATCH /tasks/:id
Actualiza una tarea existente. Solo los campos enviados se modifican.

**Ejemplo de petición:**
```bash
PATCH http://localhost:3000/api/v1/tasks/1
```

**Body:**
```json
{
  "completed": true
}
```

**Ejemplo de respuesta (200 OK):**
```json
{
  "id": 1,
  "title": "Hacer la compra",
  "completed": true,
  "priority": "alta",
  "deadline": null,
  "createdAt": "28/4/2026"
}
```

**Errores posibles:**
```json
// 404 Not Found — la tarea no existe
{ "error": "Tarea no encontrada" }
```

---

### DELETE /tasks/:id
Elimina una tarea por su id.

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/api/v1/tasks/1
```

**Respuesta exitosa:** `204 No Content` (sin cuerpo)

**Errores posibles:**
```json
// 404 Not Found — la tarea no existe
{ "error": "Tarea no encontrada" }
```

---

## Códigos HTTP utilizados

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET y PATCH exitosos |
| 201 | Created | POST exitoso |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Datos de la petición inválidos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error inesperado del servidor |

---

*Desarrollado en 2026 como proyecto de Bootcamp.*