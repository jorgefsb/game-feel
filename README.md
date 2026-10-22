# Game Feel 1.0.1

Método y adaptador genérico para que una página responda a tus acciones. Conecta el menú «Juega» de juice con Cursor líquido, sin mascota obligatoria y sin decidir por la persona.

[Repositorio](https://github.com/jorgefsb/game-feel) · [Versión 1.0.1](https://github.com/jorgefsb/game-feel/releases/tag/v1.0.1) · [Cursor líquido 1.0.1](https://github.com/jorgefsb/cursor-liquido/releases/tag/v1.0.1)

![Demo real: cambio de intensidad del cursor](docs/media/demo.gif)

[Ver el video MP4](docs/media/demo.mp4). Capturas y grabación de [examples/](examples/index.html), con eventos reales del puntero y sin tinta simulada. Chromium con WebGL por SwiftShader; no es una prueba en un teléfono físico.

## Qué hace

Al tocar, escribir o guardar, la página responde con movimiento y sonido según el nivel elegido. Cursor líquido añade la estela del puntero. El adaptador evita que la estela vieja de Hardcore se dibuje encima: conserva las celebraciones y no bloquea clics, escritura ni scroll. El puntero nativo permanece visible.

| Juega | Valor | Respuesta del cursor |
|---|---|---|
| Nada | `off` | Sin efecto; reduced motion fuerza este nivel |
| Poquito | `subtle` | Puntos originales de 7 px, sin WebGL |
| Mucho | `full` | Fluido con radio de 10 px CSS |
| Hardcore | `hard` | Fluido con radio de 18 px CSS |

No hay quinto nivel estable. El visitante conserva su elección de sonido y nivel.

### Poquito
![Poquito: puntos originales](docs/media/poquito.png)

### Mucho
![Mucho: fluido de 10 px](docs/media/mucho.png)

### Hardcore
![Hardcore: fluido de 18 px](docs/media/hardcore.png)

## Instalar y probar

Requiere Node.js 20 o posterior. No hay paquete publicado en npm.

```sh
npm ci
npm run setup
npm run verify
npm run demo
npm test
npm run test:browser
```

Abre la dirección que imprime el servidor y entra a `/examples/`. `setup` descarga las dependencias de fuentes versionadas y verifica sus SHA-256 antes de escribir `vendor/`. No necesita opciones locales. Para ejecutar Chromium instala su navegador con `npx playwright install chromium`.

Para una comprobación sin descargar el release puedes usar `npm run setup -- --cursor-dir ruta/a/cursor-liquido/dist`. Solo se acepta el `dist` estable 1.0.1 con manifest, JS y CSS exactos. No existe un fallback que empaquete fuentes antiguas. `--juice-dir` permite una copia local del mismo núcleo verificado.

## Versiones y garantías

- **Game Feel 1.0.1** es la versión de este adaptador.
- **juice 1.2.0** es otro paquete: permanece byte por byte en el commit `f1b3b9c77a43ffbcbd331bb88420a436614fdbc3` de [game-industry-resources](https://github.com/jorgefsb/game-industry-resources/tree/f1b3b9c77a43ffbcbd331bb88420a436614fdbc3/juice/1.2.0).
- **Cursor líquido 1.0.1 estable** conserva renderer y adaptador aprobados. Incluye el guard externo que preserva input pendiente cuando baja la calidad, sin cambiar shaders, color ni presupuesto de cuadros.
- Solo se descargan los 6 archivos genéricos de juice y su manifest. No se descarga Moki.

Los hashes completos están en [scripts/setup-demo.mjs](scripts/setup-demo.mjs). `verify` comprueba los archivos en disco contra pins propios, no solo contra un informe generado. El bundle se valida completo y también por renderer, adapter, guard y wrapper.

## Integrar en otra página

Sirve desde tu propio origen juice 1.2.0 (núcleo, menú y Hardcore), Cursor líquido 1.0.1 y `src/game-feel-cursor.{js,css}`. Después llama `GameFeelCursor.mount({ requireJuice: true })`. El adaptador lee `data-jz-level`, no lo escribe. `destroy()` restaura el atributo previo de compatibilidad. El perfil con Moki está en [Papacito Juice](https://github.com/jorgefsb/papacito-juice).

Orden de scripts, API, opciones y rollback en [Integración](docs/integration.md). También: [Arquitectura](docs/architecture.md), [Principios](docs/design-principles.md), [Licencia y privacidad](docs/privacy-license.md).

## Verificación y límites

Los resultados reales viven en [reports/browser-report.json](reports/browser-report.json) y [reports/media-report.json](reports/media-report.json). La suite cubre niveles, controles, desmontaje, móvil emulado, reduced motion y preferencias. Las capturas de QA quedan en `qa/`, ignorado por Git.

En SwiftShader el motor puede reducir calidad o pausarse si supera su presupuesto; ese límite sigue activo. La estela vieja de Hardcore se oculta mediante CSS, pero juice sigue creando sus nodos. El fluido se mezcla con `screen` y se aprecia mejor en fondo oscuro.

## Licencia

Código e instrucciones: [MIT](LICENSE). Moki, su arte y la marca personal **no son MIT**: no se concede permiso de reutilización. Las capturas y el video muestran la integración autorizada de la marca personal; no son un paquete de assets. Los WEBP de Moki no se incluyen en este repositorio. Las dependencias descargadas permanecen en `vendor/`, ignorado por Git. Ver [NOTICES](NOTICES).
