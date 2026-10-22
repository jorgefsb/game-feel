# Arquitectura

## Piezas y dueños

| Pieza | Dueño de | Nunca toca |
|---|---|---|
| `juice.js` 1.2.0 | El nivel (`data-jz-level`), el sonido, los presets de respuesta | El cursor |
| `juice-menu.js` 1.2.0 | El menú «Juega» y el candado de Hardcore | El cursor |
| `hardcore/hardcore.js` 1.2.0 | Imán, squash, chispas, combos, escombro y su estela vieja `.jzh-t` | El nivel |
| Cursor líquido 1.0.1 | Las capas del puntero: puntos de Poquito y fluido de Mucho y Hardcore | El nivel, el sonido, la mascota |
| `GameFeelCursor` (este repo) | Montar un solo cursor y marcar `data-game-feel-cursor` | Todo lo demás |
| La página | Sus acciones núcleo, sus logros y su marca | Archivos publicados de juice o del cursor |

Cada pieza tiene un solo dueño. Por eso el adapter es chico: no decide nada que ya tenga dueño.

## Flujo

1. `juice.js` arranca y escribe `<html data-jz-level>` según la elección guardada de la persona, `data-jz-default` de la página o `prefers-reduced-motion`.
2. La página llama `GameFeelCursor.mount()`.
3. El adapter valida que `LiquidCursor` mapee `off, subtle, full, hard` a `nada, poquito, mucho, hardcore` con 0, 0, 10 y 18 px. Si hay `window.JZ`, valida que su nivel sea uno de esos cuatro.
4. Marca `<html data-game-feel-cursor="liquid">` y comprueba con un elemento de prueba que `game-feel-cursor.css` ya oculta `.jzh-t`. Si no, deshace la marca y falla.
5. Llama `LiquidCursor.mount({ followJuice: true, … })`. Desde ahí el cursor lee `data-jz-level` con un `MutationObserver` y cambia solo de capa.
6. `destroy()` destruye la instancia del cursor y devuelve el atributo al valor previo. Si otro código cambió el atributo mientras tanto, lo deja como está.

## Un solo dueño del puntero

En Hardcore, `hardcore.js` pinta su propia estela de puntos (`i.jzh-t` dentro de `.jzh-layer`) en cada `pointermove` de mouse, una cada 38 ms como máximo, hasta 29 vivas, 480 ms cada una. Cursor líquido pinta su fluido de 18 px. Juntas serían dos estelas.

juice 1.2.0 no trae un interruptor documentado para esa estela. `JZ_CONFIG` y `data-jz-off` cubren los efectos del núcleo (press, flash, ripple y demás), no la estela de `hardcore.js`. Las opciones descartadas:

- Parchar `hardcore.js`: rompe el sha256 publicado y la regla de no editar versiones.
- Interceptar `pointermove` global: cambia el input de toda la página.
- Bajar el nivel: quita a la persona lo que eligió.

Lo que queda es CSS de la página, angosto y con vida acotada:

```css
html[data-game-feel-cursor="liquid"] .jzh-t { display: none !important; }
```

Solo aplica mientras el adapter está montado. No oculta `.jzh-p`, `.jzh-b`, `.jzh-ring` ni `.jzh-pop`, así que celebraciones, escombro, combos y sonidos siguen igual. La suite del navegador lo comprueba en las dos direcciones: con el adapter montado hay cero `.jzh-t` visibles y sí hay partículas de celebración. Después de `destroy()` la estela vieja vuelve a verse.

**Trabajo residual:** el CSS oculta la estela, no la apaga. `hardcore.js` sigue creando, animando y quitando esos nodos invisibles mientras el nivel es Hardcore. Es trabajo acotado (29 nodos como máximo) y se documenta como tal. Un interruptor real tendría que llegar en una versión nueva de juice.

## Idempotencia y ciclo de vida

- `mount` dos o más veces deja un solo cursor: la instancia anterior se destruye primero. Cursor líquido además reemplaza su propia instancia en cada `mount`.
- El valor previo del atributo se toma antes de la primera marca y se respeta a través de montajes repetidos.
- `destroy` es seguro de llamar varias veces.
- Movimiento reducido: juice fuerza Nada y Cursor líquido apaga sus capas al cargar y cuando la preferencia cambia en vivo.

## Lo que no es

- No es un motor nuevo ni una copia del motor. El renderer viaja sin cambios dentro de Cursor líquido.
- No es un selector de mascota. Game Feel no conoce a ninguna mascota.
- No es un quinto nivel.
