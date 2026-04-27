# Flujo de trabajo con Cursor

En este documento documento mi experiencia usando Cursor como IDE 
asistido por IA: atajos de teclado, ejemplos de uso y mejoras 
conseguidas en el proyecto TaskFlow.

---

## Atajos de teclado más usados

- **Ctrl + L** — Abre el chat para hacer preguntas sobre el código
- **Ctrl + K** — Edición inline: modifica una parte concreta del código
- **Ctrl + I** — Composer: hace cambios en varios archivos a la vez

---

## Qué he probado y qué me ha parecido

### Chat (Ctrl + L)
Le pregunté que me explicara qué hace la función `renderizarTareas` 
y me dio una explicación clara y detallada. Es muy útil para entender 
partes del código que no tienes del todo claras sin tener que salir 
del editor.

### Edición inline (Ctrl + K)
Le pedí que añadiera un comentario JSDoc a la función 
`guardarEnStorage`. Lo generó correctamente y directamente en el 
código. Es cómodo porque no tienes que salir del archivo ni copiar 
y pegar nada.

### Autocompletado
Escribí un comentario describiendo lo que quería hacer:
`// función que recibe una tarea y devuelve true si fue creada hoy`
Y Cursor generó la función entera automáticamente. Esto me ha 
gustado mucho porque con solo describir en el propio código lo que 
quieres, ya te lo implementa.

### Composer (Ctrl + I)
Le pedí que añadiera comentarios JSDoc a todas las funciones del 
`app.js` y los añadió todos directamente en el código. Lo que me 
ha gustado es que no acepta los cambios sin más, sino que te 
pregunta si quieres mantenerlos o quitarlos, lo que da más 
tranquilidad a la hora de usarlo.

---

## Conclusión
Cursor me ha parecido una herramienta muy útil. Lo que más me ha 
gustado es el autocompletado, porque con solo escribir un comentario 
describiendo lo que quieres, ya te genera el código. También el 
Composer es muy potente porque puede editar varios archivos a la 
vez, pero siempre pidiendo confirmación antes de aplicar los cambios.