# Pendientes — El Racó d'en Tito

> Estructura actual del sitio: la página principal (`index.html`) tiene solo
> el hero cinemático con panorama 360° y ubicación/horarios (la sección
> "Reservar mesa" se quitó — reservar se hace por WhatsApp/llamada desde
> la nav, la propia sección de ubicación o el marcador del panorama).
> Carta, esencia y servicios viven en páginas propias (`carta.html`,
> `esencia.html`, `servicios.html`), enlazadas desde la barra de
> navegación y desde el marcador "carta" del panorama 360°. La página de
> galería se eliminó: las fotos se integrarán directamente en `carta.html`
> más adelante.

Este archivo es el checklist vivo de todo lo que sigue siendo relleno o
necesita confirmación antes de publicar la web. Cuando el cliente aporte un
dato, edita el archivo indicado y cambia el flag `isPlaceholder` a `false`
(o táchalo aquí).

Durante la construcción aparecieron fotos reales en `assets/` (fachada,
dos fotos 360° del comedor y una foto de mesa) que ya se han usado — ver
sección "Ya resuelto con datos reales" al final.

## 1. Horarios — CONFIRMAR, no inventado
`src/data/horarios.js` — horario leído directamente de la pizarra
"HORARIO DE VERANO" fotografiada en la entrada. Lunes cerrado, confirmado
por el cliente. Sigue pendiente:
- Es horario de VERANO — confirmar si hay horario de invierno distinto.

## 2. Platos estrella con precio
`src/data/menu.js` → categoría `tapas`, items con `destacado: true`
(Patatas bravas, Boquerones a la andaluza, Croquetas de la casa). Los
nombres son reales pero **siguen sin precio en `menu.js`** — ver punto 3,
ahora SÍ hay precios reales disponibles (fotos de la carta física), solo
falta transcribirlos a este archivo.

## 3. Carta completa con precios — YA HAY DATOS REALES, falta transcribir
`src/data/menu.js` todavía tiene nombres/precios placeholder en varias
categorías, pero ya no hace falta inventar nada ni esperar al cliente:
las fotos reales de la carta física (`assets/CARTA/*.pdf`, ya usadas
para las imágenes del acordeón — ver `public/images/carta/carta-panel-*`)
contienen la carta completa con precios reales: Tapas (18 platos +
Nachos), Bocadillos, Ensaladas, y el resto de categorías en los paneles
2 y 3 (no revisados en detalle aún). Pendiente: transcribir esos precios
reales a `src/data/menu.js` (y quitar los `isPlaceholder: true` que
correspondan) — decir cuándo se quiere hacer este trabajo.
- El menú del día (`menuDelDia`) SÍ es real: 15,00 € laborables / 25,90 €
  fin de semana y festivos, incluye pan, bebida, postre y café (cartel de
  precios de la fachada). Falta confirmar el horario exacto de servicio
  del menú (parcialmente ilegible en la foto).

## 4. Historia / anécdota fundacional — YA NO HACE FALTA (resuelto)
La antigua página "historia" se sustituyó por "Nuestra esencia"
(`esencia.html` / `src/data/esencia.js`) con texto REAL redactado por el
cliente (jul 2026) sobre la filosofía del local. Ya no dependemos del año
de apertura ni de la anécdota fundacional — no hay nada que pedir.

## 5. Redes sociales
`src/data/social.js` — `instagram`/`facebook` en `null`. Mientras sea así,
el footer no muestra los iconos (no hay enlaces rotos). Pedir @handles.

## 6. Fotografía — pendiente de integrar en la carta
La página de galería se eliminó (el cliente prefiere meter las fotos
directamente en `carta.html` cuando se trabaje esa página). Los archivos
siguen disponibles en `public/images/galeria/`: 3 fotos reales (comedor,
entrada, cartel de tapas) + 5 placeholders generados localmente marcados
con cinta "IMAGEN TEMPORAL" (ambiente de sala, patatas bravas, croquetas,
boquerones, menú del día). Al construir `carta.html` con fotos, reusar o
sustituir estos archivos y borrar los que sobren.

## 7. Vídeo/fotos de dron para el hero
El hero usa la foto real de fachada (`assets/TITOFACHADA.jpg`) con un
zoom tipo Ken Burns por scroll hacia la puerta — no hay ningún placeholder
falso aquí. Si en el futuro se graba vídeo de dron, se puede extender
`src/components/hero/heroScroll.js` para encadenar 2-3 fotogramas reales
en vez de una sola imagen (la estructura ya usa un timeline de GSAP, solo
hay que añadir más `<img class="hero__frame">` y frames al timeline).

## 8. Aviso legal del footer
`src/components/footer/footer.js` — solo tiene "© año, todos los derechos
reservados". Pedir razón social / NIF si se necesita un aviso legal más
formal.

## 9. Carta — resuelto (ver "Ya resuelto" más abajo)
Escritorio usa el acordeón 3D con scroll vertical; por debajo de 640px
de ancho se usa un carrusel horizontal con scroll-snap nativo (deslizar
con el dedo) en vez del pliegue 3D — ver
`src/components/carta/cartaAccordion.js` (`MOBILE_BREAKPOINT`).

---

## Ya resuelto con datos reales (no tocar salvo que cambien)

- **Eslogan real**: "Menja bé, menja bo" (cartel de fachada) — usado en
  el hero, no inventado.
- **Paleta de color**: magenta/fucsia, granate y terracota extraídos por
  muestreo de píxel de las fotos reales (cartel, manteles, pilar) — no es
  la paleta mediterránea genérica planeada inicialmente.
- **Panorama 360°**: dos fotos reales del comedor
  (`public/images/panorama/panorama-comedor-1.jpg` y `-2.jpg`), no
  placeholder.
- **Fachada real** para el hero (`public/images/hero/hero-fachada.jpg`).
- **Menú del día con precios reales** (ver punto 3 arriba).
- **Nombres reales de tapas** (ver punto 2 y 3).
- **Teléfono de WhatsApp real**: `625603720` (`src/data/contacto.js` →
  `telefonoWhatsApp`), distinto del fijo (`936 37 78 26`) que se usa para
  llamadas normales.
- **Marcadores del panorama 360°**: posiciones yaw/pitch de "carta"
  (mesa de sofás) y "horarios" (cuadro de la columna) ajustadas a ojo
  sobre las fotos reales y verificadas en navegador; "reserva" sin tocar.
- **Escena de fondo del acordeón de la carta**: foto real de la mesa con
  sofás (`public/images/carta/carta-bg-scene.jpg`), no placeholder.
- **Las 8 caras del acordeón de la carta**: fotos reales de la carta
  física, extraídas de `assets/CARTA/*.pdf` (P1-P6, PORTADA,
  CONTRAPORTADA) → `public/images/carta/carta-panel-{1..4}-frontal.jpg`
  y `-dorso.jpg`, no placeholder. Estas mismas fotos son la fuente para
  transcribir precios reales a `menu.js` (ver punto 3).
- **Versión móvil de la carta**: decidido — por debajo de 640px de
  ancho es un carrusel horizontal (scroll-snap nativo, sin GSAP) con
  portada + las 6 páginas de lectura (P1-P4, P5, P6); no lleva
  contraportada.
