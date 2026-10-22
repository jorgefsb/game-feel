# Roadmap

La versión estable tiene cuatro niveles: Nada, Poquito, Mucho y Hardcore. Lo que sigue es una propuesta. No está implementado y no es un quinto nivel en esta versión.

## Propuesta: «Legendario»

**Idea.** El entorno responde a acciones útiles. Cuando la persona termina algo que vale (manda un formulario, completa una colección, encuentra lo que buscaba), la zona donde ocurrió contesta con una respuesta visual corta y una celebración que depende del contexto.

**Qué sí incluiría**

- Respuestas cortas atadas a acciones útiles, no a cualquier movimiento del puntero.
- Celebración contextual: el tamaño depende de lo que se logró, siguiendo el principio de proporción.
- Mascota solo si la marca tiene una y su perfil lo aprueba. Game Feel no agrega ninguna.

**Qué no cambia**

- El campo del cursor no crece. El radio máximo sigue siendo el de Hardcore (18 px).
- El algoritmo del renderer y su GPU no cambian. El renderer de Cursor líquido sigue siendo el aprobado, byte por byte.
- Movimiento reducido apaga todo, igual que hoy.
- Nada bloquea la navegación, los clics, el scroll ni el teclado.

**Condiciones para pasar de propuesta a nivel**

1. Un perfil de marca que lo pida, con su logro y su métrica.
2. Pruebas con personas: si no hay sonrisas ni repetición del gesto, no entra.
3. Versión nueva de juice que lo soporte sin parchar versiones publicadas.
4. Pruebas automáticas que demuestren que no tapa controles, respeta movimiento reducido y no deja trabajo corriendo sin fin.

## Pendientes conocidos

- Un interruptor documentado en juice para apagar la estela vieja de Hardcore, en lugar de ocultarla con CSS.
- Texto del candado de Hardcore configurable por marca en `juice-menu.js`.
- Publicar el release v1.0.1 de Cursor líquido para que `npm run setup` no necesite `--cursor-dir`.
