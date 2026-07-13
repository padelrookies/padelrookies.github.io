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

// Página en la que "abre" la carta antes de dejar el resto al carrusel:
// la portada (índice 0) es la tapa cerrada, así que se abre directo en
// la primera página de platos.
const OPENING_SLIDE_INDEX = MOBILE_SLIDES.findIndex((s) => s.alt === 'Carta — página 1');

function buildMobileCarouselHtml() {
  const slides = MOBILE_SLIDES.map(
    ({ src, alt }) => `
      <div class="carta-accordion__slide">
        <img src="/images/carta/${src}" alt="${alt}" loading="lazy" decoding="async" />
      </div>`,
  ).join('');
  const dots = MOBILE_SLIDES.map(() => '<span class="carta-accordion__dot"></span>').join('');
  return `
    <div class="carta-accordion__intro" aria-hidden="true">
      <img class="carta-accordion__intro-cover" src="/images/carta/carta-panel-1-dorso.jpg" alt="" decoding="async" />
    </div>
    <div class="carta-accordion__mobile-carousel">${slides}</div>
    <div class="carta-accordion__dots" aria-hidden="true">${dots}</div>
    <p class="carta-accordion__mobile-hint">Desliza para ver el resto de la carta ←→</p>`;
}

// Misma idea que la escena de escritorio (mesa de fondo + carta cerrada
// que se abre), adaptada a algo fiable en móvil: en vez de enganchar el
// scroll (riesgo ya conocido de líos con la barra de direcciones etc.),
// se reproduce UNA vez, como un vídeo corto, en cuanto la sección entra
// en pantalla — mismo patrón que `.reveal`/`observeReveal()`, pero con
// una animación propia en vez del fundido genérico. La tapa (portada)
// se aleja/desvanece mientras el carrusel —ya colocado en la página de
// Tapas por debajo— crece hasta tamaño completo.
function initMobileCartaReveal(container) {
  if (prefersReducedMotion()) {
    container.classList.add('carta-accordion--opened');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          container.classList.add('carta-accordion--opened');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 },
  );
  io.observe(container);
}

// Efecto "página girando": mientras se desliza el dedo, cada página se
// inclina en 3D según lo lejos que esté del centro (la que se va, la que
// llega), y en cuanto una página queda centrada/en reposo vuelve a
// rotationY:0 — a tamaño completo, igual que antes. Puro scroll nativo:
// solo se lee `scrollLeft` para calcular la inclinación, nunca se
// interviene el scroll en sí (sigue siendo tan fiable como un scroll
// normal en cualquier móvil).
function initMobileCarouselTilt(container) {
  const carousel = container.querySelector('.carta-accordion__mobile-carousel');
  const slides = [...container.querySelectorAll('.carta-accordion__slide')];
  const dots = [...container.querySelectorAll('.carta-accordion__dot')];
  if (!carousel || !slides.length) return;

  let ticking = false;
  const MAX_TILT = 38;

  function update() {
    ticking = false;
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    let activeIndex = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const offset = (slideCenter - carouselCenter) / slide.offsetWidth; // -1..0..1 durante la transición
      const clamped = Math.max(-1, Math.min(1, offset));
      slide.style.transform = `perspective(1400px) rotateY(${clamped * -MAX_TILT}deg) scale(${1 - Math.abs(clamped) * 0.08})`;
      slide.style.opacity = String(1 - Math.abs(clamped) * 0.35);
      const dist = Math.abs(offset);
      if (dist < closestDist) {
        closestDist = dist;
        activeIndex = i;
      }
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
  }

  carousel.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
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
    // Se coloca en la página de Tapas ANTES de que nada sea visible (el
    // carrusel arranca en opacity:0 mientras dura la animación de
    // apertura), así que no hay ningún salto perceptible: cuando se
    // revela, ya está mostrando esa página.
    const carousel = container.querySelector('.carta-accordion__mobile-carousel');
    carousel.scrollLeft = carousel.clientWidth * OPENING_SLIDE_INDEX;
    if (!prefersReducedMotion()) {
      initMobileCarouselTilt(container);
    }
    initMobileCartaReveal(container);
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
