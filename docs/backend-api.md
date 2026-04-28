# Herramientas del ecosistema backend

En este documento se explica qué son y para qué sirven algunas de las herramientas más usadas en el desarrollo backend profesional.

---

## Axios

Axios es una librería de JavaScript para hacer peticiones HTTP, tanto desde el navegador como desde Node.js. Es una alternativa más potente al `fetch` nativo del navegador.

**¿Por qué se usa?**
- Convierte automáticamente las respuestas a JSON sin necesidad de llamar a `.json()`
- Gestiona los errores de forma más clara: lanza un error automáticamente si el servidor devuelve un código 4xx o 5xx
- Permite configurar una URL base para no repetirla en cada petición
- Soporta interceptores para modificar peticiones o respuestas de forma global

**Ejemplo de uso:**
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
})

// GET
const { data } = await api.get('/tasks')

// POST
const { data: nuevaTarea } = await api.post('/tasks', {
  title: 'Nueva tarea',
  priority: 'alta'
})
```

**¿Cuándo usarlo?**
En proyectos donde se hacen muchas peticiones a la API y se quiere centralizar la configuración. Para proyectos simples, `fetch` es suficiente.

---

## Postman

Postman es una aplicación de escritorio para probar y documentar APIs REST. Permite hacer peticiones HTTP de cualquier tipo (GET, POST, PATCH, DELETE) sin necesidad de escribir código.

**¿Por qué se usa?**
- Permite probar los endpoints del servidor antes de conectar el frontend
- Guarda colecciones de peticiones organizadas por proyecto
- Permite simular errores enviando datos incorrectos a propósito
- Genera documentación de la API automáticamente
- Permite compartir las colecciones con el equipo

**¿Cuándo usarlo?**
Durante el desarrollo del backend para verificar que cada endpoint funciona correctamente y devuelve los códigos HTTP y datos esperados. En este proyecto usamos Thunder Client, que es la alternativa integrada en VS Code, pero Postman es el estándar en entornos profesionales.

---

## Sentry

Sentry es una plataforma de monitorización de errores en tiempo real. Cuando una aplicación falla en producción, Sentry captura el error y lo envía a un panel donde el equipo puede analizarlo.

**¿Por qué se usa?**
- Registra automáticamente los errores que ocurren en producción, con la traza completa del error
- Avisa al equipo por correo o Slack cuando hay un error nuevo
- Muestra cuántas veces ha ocurrido un error y qué usuarios se han visto afectados
- Permite marcar errores como resueltos y hacer seguimiento

**Ejemplo de integración en Express:**
```javascript
const Sentry = require('@sentry/node')

Sentry.init({ dsn: 'tu-dsn-de-sentry' })

// Middleware de Sentry para capturar errores
app.use(Sentry.Handlers.errorHandler())
```

**¿Cuándo usarlo?**
En aplicaciones en producción donde no puedes estar mirando los logs del servidor constantemente. Es esencial en proyectos reales para detectar y solucionar errores rápidamente.

---

## Swagger

Swagger (actualmente conocido como OpenAPI) es un estándar para documentar APIs REST. Permite generar automáticamente una interfaz web interactiva donde cualquier desarrollador puede ver y probar los endpoints de la API.

**¿Por qué se usa?**
- Genera documentación visual e interactiva de todos los endpoints
- Permite probar la API directamente desde el navegador sin herramientas externas
- Es el estándar de la industria para documentar APIs
- Facilita la comunicación entre el equipo de backend y el de frontend

**Ejemplo de integración en Express:**
```javascript
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
```

Una vez configurado, la documentación de la API queda accesible en `http://localhost:3000/api-docs`.

**¿Cuándo usarlo?**
En proyectos donde la API va a ser consumida por otros equipos o por terceros. Tener la documentación siempre actualizada y accesible ahorra mucho tiempo de comunicación.

---

## Resumen comparativo

| Herramienta | Tipo | Para qué sirve |
|-------------|------|----------------|
| Axios | Librería JS | Hacer peticiones HTTP desde el cliente o servidor |
| Postman | Aplicación | Probar y documentar APIs durante el desarrollo |
| Sentry | Plataforma | Monitorizar errores en producción en tiempo real |
| Swagger | Estándar + herramienta | Documentar y visualizar APIs REST |