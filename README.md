# ✅ TaskFlow - Gestor de Tareas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Aplicación web de gestión de tareas construida como proyecto práctico de Bootcamp. Permite organizar el día a día añadiendo, completando y eliminando tareas, con persistencia de datos en el navegador y soporte para modo oscuro.

🌐 **Live Demo:** [Probar TaskFlow en Vercel](https://bootcamp-project-tau.vercel.app)

> ¿No quieres instalar nada? Puedes usar la aplicación directamente desde el enlace de arriba, sin instalar nada en tu ordenador.

---

## 🚀 Funcionalidades

- **Gestión de tareas:** Añade, edita, completa y elimina tareas fácilmente.
- **Filtros dinámicos:** Visualiza todas las tareas, solo las pendientes o solo las completadas.
- **Búsqueda en tiempo real:** Filtra tareas por texto mientras escribes.
- **Estadísticas automáticas:** Contadores de tareas totales, completadas y pendientes.
- **Persistencia de datos:** Las tareas se guardan en el navegador y no se pierden al recargar la página.
- **Modo Oscuro / Claro:** Cambia la interfaz con un clic. La preferencia se guarda automáticamente.
- **Diseño responsive:** Funciona correctamente en móvil y escritorio.

---

## 💻 Cómo ejecutarlo en tu ordenador

Si quieres tener el proyecto en tu propio ordenador, sigue estos pasos. No necesitas saber programar para hacerlo funcionar.

### Lo que necesitas instalar antes

1. **Git** — Sirve para descargar el proyecto desde GitHub.
   Descárgalo aquí: https://git-scm.com/downloads
   Cuando lo instales deja todas las opciones por defecto.

2. **Visual Studio Code** — Es el programa con el que abrirás y verás el proyecto.
   Descárgalo aquí: https://code.visualstudio.com

3. **Extensión Live Server** — Sirve para ver la app en el navegador.
   - Abre Visual Studio Code
   - Haz clic en el icono de extensiones (el de los cuadraditos en el menú izquierdo)
   - Busca **Live Server** e instálala

### Pasos para ejecutar el proyecto

**Paso 1 — Descarga el proyecto**

Abre una terminal (en Windows busca "cmd" en el buscador) y escribe:

```
git clone https://github.com/Zeussgb/bootcamp-project.git
```

Esto creará una carpeta llamada `bootcamp-project` en tu ordenador.

**Paso 2 — Abre la carpeta en Visual Studio Code**

- Abre Visual Studio Code
- Ve a `Archivo → Abrir carpeta`
- Selecciona la carpeta `bootcamp-project` que acabas de descargar

**Paso 3 — Lanza la aplicación**

- Dentro de Visual Studio Code, busca el archivo `index.html` en el panel izquierdo
- Haz clic derecho sobre él
- Selecciona **Open with Live Server**
- Se abrirá el navegador automáticamente con la aplicación funcionando ✅

---

## 📁 Estructura del proyecto

```
bootcamp-project/
├── docs/
│   └── design/
│       └── wireframe.png    ← Diseño inicial de la app
├── index.html               ← Estructura de la página
├── app.js                   ← Toda la lógica de la aplicación
├── style.css                ← Estilos base
├── README.md                ← Este archivo
└── .gitignore               ← Archivos ignorados por Git
```

---

## 🛠️ Tecnologías utilizadas

- **Estructura:** HTML5 Semántico
- **Estilos:** Tailwind CSS (vía CDN) con soporte para Dark Mode
- **Lógica:** JavaScript Vanilla (ES6+)
- **Despliegue:** Vercel

---

## 🧪 Testing y Accesibilidad

Se ha realizado un testeo manual de la aplicación confirmando que:

- **Validación de input:** No es posible añadir tareas vacías.
- **Títulos largos:** El diseño no se rompe con textos muy largos.
- **Persistencia:** Al recargar la página (F5) las tareas y el modo oscuro se mantienen.
- **Filtros y búsqueda:** Funcionan correctamente de forma combinada.
- **Accesibilidad (a11y):** Navegación correcta mediante teclado (tabulador) y etiquetas `aria-label` en los botones.

---

*Desarrollado en 2026 como proyecto de Bootcamp.*