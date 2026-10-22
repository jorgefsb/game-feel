# Game Feel: demostración explicada

[Español](README.md) · [English](README.en.md) · [← README](../../README.md)

[MP4](demo.mp4) · [GIF](demo.gif) · [Captions ES](demo.es.vtt) · [Captions EN](demo.en.vtt) · [Player](player.html)

Grabación existente reutilizada sin modificar: 13.88 s, H.264, 1280 × 900, 25 fps, sin pista de audio. Los captions son descripción editorial, no transcripción de una voz inexistente.

Fuente reproducible: `scripts/capture-demo.mjs`, página `examples/`, eventos reales de puntero en Chromium + SwiftShader. Los PNG/GIF/MP4 originales permanecen iguales al baseline. No se simula tinta ni se altera el presupuesto del motor. No demuestra rendimiento de teléfono físico.

## Transcripción descriptiva

- **0–2.5 s:** Demo genérica: tocar, guardar una nota y cambiar de pestaña.
- **2.5–4 s:** Las tres acciones completadas abren Hardcore, sin mascota.
- **4–10 s:** Mucho: el puntero mueve el fluido real sobre la página.
- **10–13.88 s:** Hardcore: radio mayor; controles y puntero nativo siguen visibles.

## Capturas y lectura

![Poquito](poquito.png)

**Poquito:** puntos originales de 7 px, sin WebGL.

![Mucho](mucho.png)

**Mucho:** fluido de 10 px CSS siguiendo eventos reales del puntero.

![Hardcore](hardcore.png)

**Hardcore:** fluido de 18 px CSS; el logro ya se completó en la grabación.

Game Feel no usa Moki ni descarga mascota.

Notas y contenido de muestra: datos de demostración, no información de clientes. La demo está en español; captions y esta explicación ofrecen ES/EN sin fingir una UI traducida. Para respetar movimiento reducido, mira los PNG en lugar del GIF.

[Aviso de arte y marca](../ASSET-NOTICE.md)
