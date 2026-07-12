import { prefersReducedMotion } from '../../utils/reducedMotion.js';
import { initPanorama } from './panorama.js';

export function initHero() {
  if (prefersReducedMotion()) {
    document.querySelector('.hero__frame-wrap').hidden = true;
    document.querySelector('.hero__overlay').hidden = true;
    const mount = document.querySelector('.hero__panorama-mount');
    mount.style.opacity = '1';
    mount.style.visibility = 'visible';
    mount.classList.add('is-interactive');
  } else {
    // Import dinámico: GSAP/ScrollTrigger solo se cargan si se va a animar de verdad.
    import('./heroScroll.js').then(({ initHeroScroll }) => initHeroScroll());
  }

  initPanorama();
}
