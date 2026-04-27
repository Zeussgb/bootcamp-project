# Experimentos con IA en programación

En este documento comparo la resolución de problemas de programación
con y sin ayuda de IA, midiendo tiempo, calidad del código y
comprensión del problema.

---

## Experimento 1: problemas de programación

### Los 3 problemas
1. Función que calcula el porcentaje de tareas completadas
2. Función que devuelve la tarea más reciente
3. Función que devuelve true si todas las tareas están completadas

### Sin IA
Intenté resolver los tres problemas por mi cuenta pero mi nivel
actual de JavaScript no me permite escribir el código desde cero
sin ayuda. Sé entender la lógica cuando me la explican, pero
traducirla a código todavía me cuesta bastante.

### Con IA
Con ayuda de Claude los tres problemas se resolvieron en menos de
un minuto. El código generado es limpio, tiene en cuenta casos
especiales como que el array esté vacío, y lo entiendo cuando lo leo.

### Comparación
| | Sin IA | Con IA |
|---|---|---|
| Tiempo | No conseguí terminarlo | Menos de 1 minuto |
| Calidad del código | — | Buena, cubre casos especiales |
| Comprensión | Entiendo la lógica pero no sé escribirla | Entiendo el código al leerlo |

### Conclusión
En este paso la IA es imprescindible para mi, debido a que no consigo escribir codigo 'bien',pero lo importante es que cuando lo leo lo entiendo. Eso significa que voy aprendiendo aunque no pueda escribirlo solo todavía

## Experimento 2: Cursor vs GitHub Copilot

### Pruebas realizadas

**Autocompletado**
Los dos generaron código con solo escribir un comentario describiendo 
la función. Sin embargo Copilot usó `tarea.fechaCreacion` en vez de 
`tarea.createdAt`, que es como se llama el campo en mi proyecto real. 
Cursor se adaptó mejor al contexto del proyecto.

**Chat**
Le pregunté a los dos que me explicaran qué hace `renderizarTareas`. 
Los dos dieron una explicación detallada y correcta. Copilot leyó el 
archivo directamente sin que se lo pidiera.

### Conclusión
Los dos son muy parecidos en funcionalidad. Me he quedado con Copilot 
porque me ha resultado más cómodo al estar integrado en VS Code, que 
es el editor que ya conocía. Cursor tiene la ventaja del MCP para 
conectarse a servicios externos, pero para el día a día Copilot me 
parece más intuitivo.