import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG, HINGES, SCROLL_END } from './cartaAccordionConfig.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Solo se importa/ejecuta en escritorio — en móvil, cartaAccordion.js
 * monta un carrusel horizontal con scroll-snap nativo y ni siquiera
 * carga este archivo (ver MOBILE_BREAKPOINT en cartaAccordionConfig.js).
 *
 * Acordeón con física real de pliegue: P2 es la base fija (ancla); P1
 * cuelga a su izquierda y P3→P4 se despliegan en zigzag hacia la derecha
 * (ver cartaAccordion.js para la estructura DOM anidada). Timeline
 * encadenada de forma relativa (igual que el prototipo de referencia):
 * como cada tramo es un tween real con su propia duración, GSAP
 * normaliza solo mediante tl.duration() — no hace falta el truco de
 * "relleno para fijar tl.duration()===1" de heroScroll.js porque aquí
 * no se asume ninguna fracción absoluta del total, todo es relativo.
 *
 *  Fase 1 — desplegar: los 3 goznes van a 0º con desfase (efecto
 *           acordeón secuencial) mientras el conjunto se recentra y
 *           endereza (la "cámara" vuelve al frente) y se desvanecen
 *           las sombras de pliegue / crece la sombra del suelo.
 *  Fase 2 — pausa de lectura (relleno sin propiedades).
 *  Fase 3 — giro final de 180º sobre el propio centro, revela el dorso.
 */
export function initCartaAccordionScroll() {
  const flip = document.querySelector('.carta-accordion__flip');
  const p2 = document.querySelector('.carta-accordion__panel--p2');
  const hinges = HINGES.map((id) => document.querySelector(`.carta-accordion__panel--${id}`));
  const foldShadows = gsap.utils.toArray('.carta-accordion__fold-shadow');
  const ground = document.querySelector('.carta-accordion__ground');

  const panelW = p2.offsetWidth;
  const closedOffsetX = 0.5 * panelW;

  // Escala de "abierta" calculada en tiempo real para que ocupe casi
  // toda la pantalla disponible, sea cual sea el tamaño del viewport
  // (un multiplicador fijo se quedaría corto o se saldría del
  // contenedor según la anchura). Se compara contra el hueco real de
  // la sección (ancho completo, alto del viewport menos la nav) y se
  // toma el eje más restrictivo, con un margen del 6%/10% para que no
  // quede pegada a los bordes.
  const section = document.getElementById('carta-accordion');
  const sectionRect = section.getBoundingClientRect();
  const naturalOpenWidth = panelW * 4;
  const naturalOpenHeight = flip.offsetHeight;
  const openScale = Math.min(
    (sectionRect.width * 0.94) / naturalOpenWidth,
    (sectionRect.height * 0.9) / naturalOpenHeight,
  );

  // #carta-accordion vive dentro de .page-main, que ya tiene
  // padding-top: var(--nav-height) — en reposo la sección empieza en
  // y = navHeight, no en y = 0. Con start:'top top' habría que hacer
  // scroll "normal" esos primeros navHeight px (la página deslizándose)
  // antes de que el pin se active; con start:'top navHeightpx' el pin
  // se activa justo donde la sección ya está en reposo, así el primer
  // tick de scroll entra directo en la animación, sin salto previo.
  const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 0;

  gsap.set(flip, {
    x: closedOffsetX,
    rotationX: CONFIG.VIEW_TILT_X,
    rotationY: CONFIG.VIEW_TILT_Y,
    scale: CONFIG.CLOSED_SCALE,
  });
  HINGES.forEach((id, i) => {
    gsap.set(hinges[i], { rotationY: CONFIG.FOLD[id] * CONFIG.CLOSED_ANGLE });
  });
  gsap.set(foldShadows, { opacity: CONFIG.SHADOW_MAX });
  gsap.set(ground, { transformOrigin: '50% 50%', scaleX: 0.3, opacity: 0.18 });

  const tl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    scrollTrigger: {
      trigger: '#carta-accordion',
      start: `top ${navHeight}px`,
      end: SCROLL_END,
      scrub: CONFIG.SCRUB,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  tl.to(hinges, { rotationY: 0, duration: 1, stagger: CONFIG.UNFOLD_STAGGER, ease: 'power2.inOut' }, 0)
    .to(flip, { x: 0, rotationX: 0, rotationY: 0, scale: openScale, ease: 'power2.inOut', duration: 1.4 }, 0)
    .to(foldShadows, { opacity: 0, ease: 'power1.out', duration: 1 }, 0)
    .to(ground, { opacity: 0.5, scaleX: 1, ease: 'power1.out', duration: 1.2 }, 0);

  tl.to({}, { duration: CONFIG.READ_PAUSE });

  tl.to(flip, { rotationY: 180, ease: 'power2.inOut', duration: CONFIG.FLIP_DURATION });

  if (import.meta.env.DEV) {
    window.__cartaAccordionDebug = { timeline: tl, scrollTrigger: tl.scrollTrigger };
  }

  return tl.scrollTrigger;
}
