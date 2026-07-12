// Por debajo de este ancho, la carta usa el carrusel horizontal de
// deslizamiento nativo (cartaAccordion.js) en vez del acordeón 3D con
// scroll vertical (cartaAccordionScroll.js) — deben coincidir con el
// media query de carta-accordion.css.
export const MOBILE_BREAKPOINT = '(max-width: 640px)';

// Los 4 goznes que se abren, en orden de apertura.
export const HINGES = ['p1', 'p3', 'p4'];

export const CONFIG = {
  CLOSED_ANGLE: 178, // pliegue cerrado (178 en vez de 180 evita parpadeos)
  UNFOLD_STAGGER: 0.22, // desfase entre paneles -> se abre pliegue a pliegue
  SHADOW_MAX: 0.75, // opacidad de la sombra del pliegue cuando está plegado

  // DIRECCIÓN DE CADA PLIEGUE (patrón acordeón valle-montaña-valle):
  // -1 = se pliega hacia DELANTE (valle, los frentes se tocan)
  // +1 = se pliega hacia DETRÁS  (montaña, las traseras se tocan)
  FOLD: { p1: 1, p3: 1, p4: -1 },

  // "Ángulo de cámara" 3D mientras se despliega (se endereza al final)
  VIEW_TILT_X: 11,
  VIEW_TILT_Y: -20,

  // Escala de "cerrada": arranca más pequeña. La escala de "abierta" no
  // es un número fijo — se calcula en cartaAccordionScroll.js a partir
  // del hueco real disponible, para que ocupe casi toda la pantalla sea
  // cual sea el tamaño del viewport.
  CLOSED_SCALE: 0.78,

  READ_PAUSE: 0.4, // "respiro" de lectura una vez abierta
  FLIP_DURATION: 1.3, // duración relativa del giro final de 180º
  SCRUB: 1, // suavizado del scroll (segundos)
};

// El acordeón GSAP solo se carga en escritorio (ver MOBILE_BREAKPOINT
// arriba), así que este único valor basta.
export const SCROLL_END = '+=420%';
