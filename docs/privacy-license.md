# Privacidad y licencias

[Español](privacy-license.md) · [English](privacy-license.en.md)

## Datos

El adapter no guarda nada, no lee cookies, no hace peticiones de red y no manda telemetría. Solo escribe un atributo en `<html>` mientras está montado.

juice 1.2.0 guarda preferencias de la persona en `localStorage` de su propio navegador:

| Clave | Quién la escribe | Para qué |
|---|---|---|
| `gamedev_sfx` | `juice.js` | Sonido prendido o apagado |
| `jz-level` | `juice.js` | Nivel elegido en «Juega» |
| `jz-menu-seen` | `juice-menu.js` | Que el marco de invitación no vuelva a salir |
| `jz-hard` | el módulo de logro del sitio | Hardcore desbloqueado |

Nada de eso sale del navegador. La persona lo borra al limpiar los datos del sitio. Si tu sitio agrega analítica, avísalo en tu propia política, no en el juice.

La demo y los tests sirven todo desde `127.0.0.1` y fallan si una página pide algo a otro origen.

## Licencias

| Material | Licencia | En este repo |
|---|---|---|
| Código e instrucciones de Game Feel | MIT, ver [../LICENSE](../LICENSE) | Sí |
| juice 1.2.0 | El repo de origen no declara licencia en el commit fijado | No. Se descarga a `vendor/`, ignorado |
| Cursor líquido 1.0.1 | MIT, con sombreado adaptado de Pavel Dobryakov (MIT) | No. Se descarga o se construye en `vendor/`, ignorado |
| Arte de mascotas | De cada marca | No. Game Feel no usa mascota |

Detalle en [../NOTICES](../NOTICES).

## Marcas y mascotas

Game Feel es genérico y cualquier marca lo puede usar con su propia mascota o sin ninguna. No da derecho a usar la identidad, la voz ni la mascota de otra marca. Moki pertenece a la marca personal de Jorge Suárez y vive solo en el perfil `papacito-juice`.

Medios de documentación: [aviso de arte y marca](ASSET-NOTICE.md).
