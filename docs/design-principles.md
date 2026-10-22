# Principios de diseño

[Español](design-principles.md) · [English](design-principles.en.md)

Game feel es lo que hace que una interfaz se sienta como un buen juego: responde al tocarla, tiene carácter y da ganas de volver. Este documento es genérico. Lo que cambia por marca vive en un perfil de marca.

## 1. Disparador más respuesta

Una micro-interacción tiene dos partes. La persona hace algo (disparador) y la página contesta (respuesta). La respuesta tiene que ser clara, rápida y con carácter. Las ideas vienen del diseño de juegos: Martin Jonasson y Petri Purho («Juice it or lose it»), Jan Willem Nijman («The art of screenshake») y el trabajo de Renaud Forestié en More Mountains.

1. **Acciones núcleo primero.** Las tres cosas que más hace la persona (el botón principal, mandar un formulario, cambiar de sección) reciben la mejor respuesta. Lo demás, poco o nada.
2. **Consistencia.** Un idioma de respuesta por sitio: la misma clase de acción recibe el mismo tipo de golpe.
3. **Proporción.** Lo chico responde chico y lo importante responde grande. Un clic no merece fiesta. Terminar algo valioso, sí.
4. **Súbele y luego baja.** Prueba con todo exagerado, mira dónde sonríe la gente y recorta.
5. **Prueba con sonrisas.** Si nadie sonríe ni repite el gesto, la respuesta no sirve.
6. **Nunca estorba.** No tapa texto ni botones, no retrasa la tarea y siempre se puede apagar.

## 2. Capas, de la más barata a la más cara

| Capa | Qué es | Dónde |
|---|---|---|
| Timing | Respuesta en menos de 100 ms, easing con rebote | Todo |
| Anticipación | Se encoge un poco antes de soltar | Botones, tarjetas |
| Squash y stretch | Se aplasta y se estira al recibir el golpe | Lo que se pica |
| Partículas | Chispas en colores de marca, detrás del texto | Éxitos |
| Flash | Borde corto en el acento, sin glow | Confirmaciones |
| Sonido | Menos de 150 ms, volumen bajo | Acciones núcleo |
| Háptica | Vibración corta, solo después de un gesto | Móvil |
| Screenshake | Mueve el contenido principal, nunca el `body` | Solo Hardcore |
| Permanencia | Escombro que se queda, con tope | Solo Hardcore |
| Reacción del entorno | Tarjetas que se inclinan, títulos que entran con golpe | Mucho y Hardcore |
| Aleatoriedad | Tono, ángulo y frase un poco distintos | Lo repetido |
| Contexto | La respuesta cambia según dónde y cuándo | Logros, combos |

Orden de trabajo: timing, consistencia, visuales, sonido y háptica, reacciones secundarias, shake, aleatoriedad y contexto.

## 3. Niveles «Juega»

| Nivel | Qué pasa |
|---|---|
| Nada | Cero movimiento. `prefers-reduced-motion` lo fuerza. |
| Poquito | Respuesta discreta en acciones núcleo. Arranque por defecto. |
| Mucho | Todas las capas hasta reacción del entorno. |
| Hardcore | Todo al máximo. Se gana con un logro del sitio. |

La elección de la persona se respeta y se guarda en su navegador. Una página puede cambiar su nivel de arranque por configuración, nunca reescribiendo lo que la persona eligió.

Hardcore se gana. Cada sitio define su logro (acciones núcleo completadas, una colección, una mascota encontrada). El candado dice en una línea cómo abrirlo.

## 4. Sonido y háptica con consentimiento

- Botón visible para apagarlo. Si la persona lo apaga, se respeta en ese navegador.
- Nunca suena antes del primer gesto. Sin audio antes de un clic o una tecla.
- Sonidos cortos. Excepciones (fanfarria de logro, voz de mascota) se anotan en el perfil de marca.
- La vibración solo responde a un gesto real y respeta el nivel.

## 5. Loops de regreso éticos

El juice hace que se sienta bien. Un buen loop de regreso hace que valga la pena volver. Cada propuesta responde estas preguntas (modelo Hook de Nir Eyal):

| Fase | Pregunta |
|---|---|
| Disparador externo | ¿Qué trae a la persona de regreso? |
| Disparador interno | ¿Qué sentimiento la hace pensar en el sitio? |
| Acción | ¿Cuál es el gesto más chico que da valor? |
| Recompensa variable | ¿Qué descubre que no esperaba? |
| Inversión | ¿Qué deja que mejora la siguiente visita? |

Patrones que funcionan: escondidas diarias, colección, lo nuevo desde tu última visita, una tarjeta al azar de contenido real, racha amable que solo felicita.

Límites: nada de escasez falsa, contadores inventados, culpa por irse, castigos por no volver ni datos personales. Todo se puede apagar o borrar. La prueba: ¿ayuda de verdad a la persona?

## 6. Mascota opcional

Una marca puede tener mascota o no. Si la tiene:

- Solo assets aprobados del banco de esa marca. Nunca se espeja una pose ni se inventan poses sin las reglas de su brandkit.
- Nunca tapa un botón ni texto. Quieta en Nada. Sin loops permanentes.
- Habla en el idioma de la página con frases de su voz aprobada.

Nunca se usa la mascota de otra marca.

## 7. Perfil de marca

Antes de instalar en una marca, escribe su perfil:

- Dueño y quién aprueba.
- Colores de partículas (`--jz-c1`, `--jz-c2`, `--jz-c3`) y acento.
- Fuentes.
- Mascota, o «sin mascota».
- Idioma de respuesta: qué recibe cada acción núcleo.
- Sonido por defecto y excepciones.
- Nivel de arranque y logro que abre Hardcore.
- Loop de regreso elegido.

Si falta algo del perfil, se pregunta al dueño de la marca. No se inventa.

## 8. QA antes de publicar

En 375 y 1280 px como mínimo, en cada idioma, normal y con movimiento reducido:

1. Consola sin errores y todas las rutas responden.
2. `scrollWidth <= innerWidth` en todos los niveles, incluido Hardcore.
3. Apagar el sonido se respeta al recargar.
4. Hardcore con candado hasta el logro.
5. Movimiento reducido fuerza Nada y no crea partículas.
6. Nada tapa controles ni texto.
7. Las partículas se limpian solas y el escombro respeta su tope.
8. Lo servido coincide con los sha256 fijados.
9. Un solo cursor dueño del puntero.
