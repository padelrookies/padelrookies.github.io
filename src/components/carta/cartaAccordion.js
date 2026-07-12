import { prefersReducedMotion } from '../../utils/reducedMotion.js';
import { MOBILE_BREAKPOINT } from './cartaAccordionConfig.js';

// Mapa de las 8 fotos reales de la carta física a los 8 huecos de cara
// del acordeón. Físicamente el dorso de cada panel de lectura (P1-P4) es
// la cara exterior de la carta cerrada: el dorso de P1 es la PORTADA y
// el de P4 la CONTRAPORTADA; los dorsos de P2/P3 son las caras P5/P6.
const FACES = {
  p1: { front: 'carta-panel-1-frontal.jpg', back: 'carta-panel-1-dorso.jpg' }, // dorso = portada
  p2: { front: 'carta-panel-2-frontal.jpg', back: 'carta-panel-2-dorso.jpg' }, // dorso = p5
  p3: { front: 'carta-panel-3-frontal.jpg', back: 'carta-panel-3-dorso.jpg' }, // dorso = p6
  p4: { front: 'carta-panel-4-frontal.jpg', back: 'carta-panel-4-dorso.jpg' }, // dorso = contraportada
};

function panelHtml(id, innerHtml = '') {
  const { front, back } = FACES[id];
  return `
    <div class="carta-accordion__panel carta-accordion__panel--${id}" data-panel="${id}">
      <div class="carta-accordion__face carta-accordion__face--front">
        <img src="/images/carta/${front}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="carta-accordion__face carta-accordion__face--back">
        <img src="/images/carta/${back}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="carta-accordion__fold-shadow"></div>
      ${innerHtml}
    </div>`;
}

// Secuencia del carrusel móvil: portada + las 6 páginas de lectura
// (P1-P4 y el dorso interior P5/P6). Sin contraportada — solo el logo,
// bajo valor como página de carrusel.
const MOBILE_SLIDES = [
  { src: 'carta-panel-1-dorso.jpg', alt: 'Portada de la carta' },
  { src: 'carta-panel-1-frontal.jpg', alt: 'Carta — página 1' },
  { src: 'carta-panel-2-frontal.jpg', alt: 'Carta — página 2' },
  { src: 'carta-panel-3-frontal.jpg', alt: 'Carta — página 3' },
  { src: 'carta-panel-4-frontal.jpg', alt: 'Carta — página 4' },
  { src: 'carta-panel-2-dorso.jpg', alt: 'Carta — página 5' },
  { src: 'carta-panel-3-dorso.jpg', alt: 'Carta — página 6' },
];

function buildMobileCarouselHtml() {
  const slides = MOBILE_SLIDES.map(
    ({ src, alt }) => `
      <div class="carta-accordion__slide">
        <img src="/images/carta/${src}" alt="${alt}" loading="lazy" decoding="async" />
      </div>`,
  ).join('');
  return `
    <div class="carta-accordion__mobile-carousel">${slides}</div>
    <p class="carta-accordion__mobile-hint">Desliza para ver la carta →</p>`;
}

/**
 * Monta el DOM de la carta y decide qué experiencia usar:
 * - Móvil: carrusel horizontal con scroll-snap nativo (sin GSAP, sin
 *   scroll-jacking) — el usuario desliza el dedo hacia la derecha y las
 *   páginas van pasando una a una.
 * - Escritorio: acordeón 3D fijado con scroll vertical (ScrollTrigger,
 *   cargado bajo demanda), o su versión estática ya abierta si
 *   prefers-reduced-motion — mismo patrón que hero.js.
 */
export function initCartaAccordion(container) {
  if (!container) return;

  if (window.matchMedia(MOBILE_BREAKPOINT).matches) {
    container.classList.add('carta-accordion--mobile');
    container.innerHTML = buildMobileCarouselHtml();
    return;
  }

  const p4 = panelHtml('p4');
  const p3 = panelHtml('p3', p4);
  const p1 = panelHtml('p1');
  const p2 = panelHtml('p2', p1 + p3);

  container.innerHTML = `
    <div class="carta-accordion__stage-wrap">
      <img class="carta-accordion__bg" src="/images/carta/carta-bg-scene.jpg" alt="" decoding="async" />
      <div class="carta-accordion__ground"></div>
      <div class="carta-accordion__flip">${p2}</div>
    </div>`;

  if (prefersReducedMotion()) {
    container.classList.add('carta-accordion--static');
    return;
  }

  import('./cartaAccordionScroll.js').then(({ initCartaAccordionScroll }) => initCartaAccordionScroll());
}
