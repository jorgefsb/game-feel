# Game Feel

[Español](SKILL.es.md) · [English](SKILL.md)

Haz que la página conteste cuando la usan: clara, rápida, con carácter y sin estorbar. Skill genérico: lo específico de cada marca vive en su perfil. Mascota opcional.

Repos separados (destinos públicos previstos; verifica que existan antes de enlazar): [Cursor líquido](https://github.com/jorgefsb/cursor-liquido), motor del puntero; [Game Feel](https://github.com/jorgefsb/game-feel), método y adaptador; [Papacito Juice](https://github.com/jorgefsb/papacito-juice), perfil de Jorge Suárez con Moki.

## 1. Límites

- Cada marca conserva colores, voz, mascota y código. Nunca uses identidad o mascota ajenas.
- Pregunta quién es dueño del sitio antes de tocarlo. Publica solo con su aprobación.
- Conserva contenido: palabras, cifras, enlaces, navegación, formularios y selector de idioma. Cambiar formato no cambia contenido.

## 2. Disparador más respuesta

Una microinteracción une lo que hace la persona con la respuesta de la página. Referencias: Martin Jonasson y Petri Purho («Juice it or lose it»), Jan Willem Nijman («The art of screenshake»), Renaud Forestié (More Mountains).

1. **Acciones núcleo primero.** Las tres más frecuentes reciben mejor respuesta; las demás poco o nada.
2. **Consistencia.** Una clase de acción recibe el mismo tipo de respuesta en todo el sitio.
3. **Proporción.** Lo chico responde chico; lo importante, grande. Un clic no merece fiesta, terminar algo valioso quizá sí.
4. **Súbele y luego baja.** Exagera, observa sonrisas y recorta.
5. **Prueba con sonrisas.** Si nadie sonríe ni repite el gesto, no funciona.
6. **Nunca estorba.** No tapa texto ni botones, no retrasa la tarea y siempre se apaga.

## 3. Capas, baratas primero

Timing (menos de 100 ms, easing con rebote), anticipación, squash/stretch, partículas de marca detrás de texto, flash corto sin glow, sonido corto, háptica tras un gesto, screenshake del contenido principal (nunca `body`, solo Hardcore), escombro persistente acotado (solo Hardcore), reacción del entorno (Mucho/Hardcore), pequeña aleatoriedad y contexto. Trabaja en ese orden.

## 4. Niveles «Juega»

| Nivel | `data-jz-level` | Comportamiento | Cursor líquido |
|---|---|---|---|
| Nada | `off` | Sin movimiento; lo fuerza `prefers-reduced-motion` | `nada`, apagado |
| Poquito | `subtle` | Respuesta discreta en acciones núcleo; por defecto | `poquito`, puntos originales 7 px (marca, `#22211F`, `#F4E8D5`) |
| Mucho | `full` | Capas hasta reacción del entorno | `mucho`, fluido 10 px CSS |
| Hardcore | `hard` | Todo al máximo; se gana con logro real | `hardcore`, fluido 18 px CSS |

No hay quinto nivel estable. Respeta la elección guardada. Configura inicio con `data-jz-default="full"` en juice 1.2.0, nunca pisando lo elegido. Sin mascota define un logro propio; al completarlo abre Hardcore con `data-jz-hard="open"` y evento `jz:unlock-hard`.

## 5. Sonido y háptica con consentimiento

Control visible para apagar sonido y elección persistente. No contexto de audio antes del primer clic o tecla. Sonidos de menos de 150 ms; excepciones como fanfarria se anotan en el perfil. Vibración solo tras gesto real.

## 6. Loops éticos de regreso

Contesta Hook (Nir Eyal): disparador externo e interno, mínima acción útil, recompensa variable e inversión. Patrones: escondidas diarias, colección, novedades desde la última visita, tarjeta aleatoria de contenido real, racha amable que solo felicita. Nunca escasez falsa, contadores inventados, culpa, castigo por no volver ni datos personales. Todo se apaga o borra.

## 7. Mascota opcional

Solo assets aprobados de esa marca. Nunca espejes ni inventes poses fuera de sus reglas. No tapa texto ni botones; quieta en Nada, sin loops permanentes. Habla el idioma de la página con voz aprobada.

## 8. Perfil de marca

Antes de instalar: dueño y aprobador; partículas (`--jz-c1`, `--jz-c2`, `--jz-c3`) y acento; fuentes; mascota o «sin mascota»; respuesta por acción núcleo; sonido por defecto y excepciones; nivel inicial; logro Hardcore; loop de regreso. Si falta algo pregunta al dueño, no inventes.

## 9. Instalar con Cursor líquido

1. Todo desde el origen del sitio, sin CDN en runtime. No edites juice ni Cursor líquido publicados; un arreglo requiere nueva versión.
2. Subconjunto genérico juice 1.2.0 (núcleo, menú, `hardcore/`) de `jorgefsb/game-industry-resources`, carpeta `juice/1.2.0`, commit fijado. Compara cada sha256 con su `manifest.json`, local y servido. Lee manifest, no notas viejas.
3. `dist` Cursor líquido 1.0.1: renderer byte a byte, comprueba hash dorado publicado.
4. Adaptador `src/game-feel-cursor.js` y `src/game-feel-cursor.css`, luego `GameFeelCursor.mount({ requireJuice: true })`.
5. Un dueño del puntero. El adapter marca `<html data-game-feel-cursor="liquid">`; CSS oculta solo los puntos viejos `.jzh-t`, conserva celebraciones, escombro, combos y sonido. No impide crear nodos ocultos: dilo. `destroy()` restaura atributo previo.
6. Nunca pases `off|subtle|full|hard` a un motor fluido viejo: usa mapping `followJuice` del cursor.
7. Sin juice puedes usar Cursor líquido solo con intensidad fija, sin preguntar al visitante.

## 10. QA antes de publicar

375/1280 px mínimo, cada idioma, normal/reduced motion: consola limpia, rutas responden, `scrollWidth <= innerWidth` en todos los niveles, mute persiste, Hardcore cerrado hasta logro, reduced motion fuerza Nada sin partículas, nada tapa texto/controles, partículas se limpian, archivos servidos coinciden con sha256, una estela visible. Emulación no es prueba física: di cuál ejecutaste.

## 11. Mejora continua

Un experimento por sitio a la vez: mide, cambia, vuelve a medir. Registra intento, sonrisa o métrica y ajuste del perfil. «Sin datos» es válido. Sin datos no afirmes éxito.

## 12. Escritura

Texto visible corto y claro en el idioma de la página, con versión inglesa. Sin rayas largas ni notas internas públicas.
