# Prompt Engineering aplicado al desarrollo

En este documento guardo los prompts más útiles que he usado durante 
esta fase, explicando por qué funcionan bien y en qué situaciones 
aplicarlos.

---

## Técnicas utilizadas

### 1. Rol
Le dices a la IA que actúe como alguien concreto. La respuesta cambia 
completamente según el papel que le das: no es lo mismo pedirle algo 
como un profesor que como un desarrollador senior.

### 2. Few-shot
Le das ejemplos del formato que quieres antes de hacer la pregunta. 
La IA aprende del patrón y reproduce el mismo estilo en su respuesta.

### 3. Paso a paso
Le pides que razone y explique cada parte antes de responder. 
Es muy útil para entender flujos de código complejos.

### 4. Restricciones
Le dices límites concretos como máximo de líneas, sin términos técnicos 
o solo ideas realizables para principiantes. La respuesta es más 
concisa y útil.

**La técnica más útil para mí ha sido el Rol**, porque cambia 
completamente el tono y el nivel de la respuesta según lo que necesito 
en cada momento.

---

## Los 10 prompts

### Prompt 1 — Rol
> "Actúa como un desarrollador senior con 10 años de experiencia en 
> JavaScript. Revisa esta función y dime si está bien escrita o cómo 
> mejorarla: [función]"

**Por qué funciona:** al darle un rol concreto la IA ajusta el nivel 
técnico y el tono de la respuesta. Da feedback más profesional y 
estructurado.

---

### Prompt 2 — Few-shot
> "Voy a darte un ejemplo de cómo quiero que documentes funciones. 
> Ejemplo: Función: sumar(a, b) → Documentación: 'Recibe dos números 
> y devuelve su suma'. Ahora documenta estas tres funciones del mismo 
> modo: guardarEnStorage(), borrarCompletadas(), obtenerTareasFiltradas()"

**Por qué funciona:** al darle un ejemplo del formato exacto que quieres, 
respeta ese patrón sin que tengas que explicar más.

---

### Prompt 3 — Paso a paso
> "Explica paso a paso qué ocurre exactamente cuando un usuario añade 
> una tarea nueva en TaskFlow, desde que pulsa el botón Añadir hasta 
> que la tarea aparece en pantalla"

**Por qué funciona:** al pedir razonamiento paso a paso la respuesta 
es más detallada y ordenada. Muy útil para entender flujos complejos.

---

### Prompt 4 — Restricciones
> "Explícame qué es el LocalStorage en máximo 3 líneas, sin usar 
> términos técnicos y como si se lo explicaras a alguien que nunca 
> ha programado"

**Por qué funciona:** las restricciones obligan a la IA a ser concisa 
y adaptar el nivel al destinatario.

---

### Prompt 5 — Rol + Restricciones ⭐ El que más me ha sorprendido
> "Actúa como un profesor de programación para principiantes. 
> Explícame qué es un array en JavaScript con un ejemplo del mundo 
> real, sin código y en menos de 5 líneas"

**Por qué funciona:** combinar rol y restricciones da respuestas muy 
precisas. El rol define el tono y las restricciones definen el formato. 
Me sorprendió lo clara y sencilla que fue la explicación sin usar 
ningún término técnico.

---

### Prompt 6 — Rol + Paso a paso
> "Actúa como un revisor de código senior. Analiza paso a paso si el 
> siguiente código tiene algún problema de rendimiento o seguridad: 
> [código]"

**Por qué funciona:** combinar rol senior con paso a paso hace que 
detecte problemas que tú no verías, como el riesgo de XSS al usar 
innerHTML con datos del usuario.

---

### Prompt 7 — Few-shot + Restricciones
> "Voy a darte ejemplos de buenos y malos nombres de variables. 
> Buenos: tareasCompletadas, filtroActivo. Malos: x, data, temp. 
> Ahora revisa estos nombres de mi proyecto y dime si son buenos 
> o malos y por qué: dragId, nextId, PRIORIDAD_CONFIG"

**Por qué funciona:** los ejemplos le dan el criterio exacto con el 
que evaluar, sin necesidad de explicar qué hace un buen nombre.

---

### Prompt 8 — Restricciones
> "Dame 3 ideas de funcionalidades nuevas para añadir a TaskFlow. 
> Cada idea en una sola línea y que sean realizables para un 
> programador principiante"

**Por qué funciona:** sin restricciones daría una lista enorme de 
ideas imposibles. Con restricciones las ideas son concretas y útiles.

---

### Prompt 9 — Paso a paso
> "Explica paso a paso cómo funciona el drag & drop en TaskFlow, 
> desde que el usuario empieza a arrastrar hasta que suelta la tarea 
> en su nueva posición"

**Por qué funciona:** el drag & drop implica varios eventos distintos 
que se disparan en orden. El paso a paso ayuda a entender la secuencia 
completa sin perderse.

---

### Prompt 10 — Rol + Few-shot
> "Actúa como un experto en accesibilidad web. Estos son ejemplos de 
> botones accesibles: <button aria-label='Cerrar menú'>X</button>. 
> Ahora revisa si los botones de mi proyecto siguen buenas prácticas 
> de accesibilidad: [botones]"

**Por qué funciona:** el rol de experto da criterio técnico y el 
ejemplo le muestra exactamente qué considera un botón accesible.