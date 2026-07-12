import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Secuencia cinemática única y continua (un solo pin, un solo scrub):
 *  0.00–0.30  Acercamiento — zoom sobre la fachada real hacia la puerta.
 *  0.30–0.40  Teletransporte — motion blur + fantasma + destello +
 *             crossfade al panorama 360°, con settle de escala/blur.
 *  0.40–1.00  Llegada + reposo — el panorama queda nítido e interactivo
 *             (is-interactive) y se mantiene así un tramo largo de scroll
 *             antes de que el pin se libere.
 *
 * IMPORTANTE (nuevo): el último tween es un "relleno" sobre un objeto
 * vacío (pos 0.40, duration 0.60) SOLO para fijar tl.duration() en
 * exactamente 1. GSAP mapea self.progress (0–1 del scroll) a
 * tl.totalProgress() (0–1 de tl.duration()); sin este relleno,
 * tl.duration() queda en el punto del último tween real (~0.391) y el
 * settle final coincide con el 100% del scroll — no queda reposo real.
 * Este relleno es lo que crea el tramo de pausa pedido (punto 3).
 *
 * IMPORTANTE (ya existente): cada .to()/.fromTo() lleva `duration`
 * explícita — sin ella GSAP usa 0.5s por defecto para CADA tween y el
 * scrub queda descuadrado respecto al scroll.
 */
export function initHeroScroll() {
  const mainFrame = document.querySelector('.hero__frame--main');
  const ghostFrame = document.querySelector('.hero__frame--ghost');
  const flash = document.querySelector('.hero__flash');
  const overlay = document.querySelector('.hero__overlay');
  const frameWrap = document.querySelector('.hero__frame-wrap');
  const panoramaMount = document.querySelector('.hero__panorama-mount');

  gsap.set(ghostFrame, { scale: 1, autoAlpha: 0 });
  gsap.set(panoramaMount, { scale: 1.12, filter: 'blur(14px)' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=500%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate(self) {
        panoramaMount.classList.toggle('is-interactive', self.progress > 0.4);
      },
    },
  });

  // Fase 1 — acercamiento (0 → 0.30)
  tl.to(mainFrame, { scale: 3.2, duration: 0.30, ease: 'none' }, 0)
    .to(ghostFrame, { scale: 3.2, duration: 0.30, ease: 'none' }, 0)
    .to(overlay, { autoAlpha: 0, y: -30, duration: 0.10, ease: 'none' }, 0.06)

    // Fase 2 — motion blur + capa fantasma disparándose hacia fuera
    .to(mainFrame, { scale: 4.0, filter: 'blur(16px)', duration: 0.043, ease: 'none' }, 0.30)
    .to(ghostFrame, { scale: 5.0, autoAlpha: 0.6, duration: 0.038, ease: 'none' }, 0.30)
    .to(ghostFrame, { autoAlpha: 0, duration: 0.014, ease: 'none' }, 0.333)

    // Fase 3 — destello del teletransporte
    .to(flash, { autoAlpha: 0.9, duration: 0.019, ease: 'none' }, 0.314)
    .to(flash, { autoAlpha: 0, duration: 0.033, ease: 'none' }, 0.333)

    // Fase 4 — crossfade: la fachada se disuelve, el panorama entra.
    // El settle (0.018) es deliberadamente mucho más corto que el
    // fade-in (0.043) para que el desenfoque se quite de golpe, no
    // como un aclarado gradual tras la llegada.
    .to(frameWrap, { autoAlpha: 0, duration: 0.033, ease: 'none' }, 0.338)
    .fromTo(panoramaMount, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.043, ease: 'none' }, 0.348)
    .to(panoramaMount, { scale: 1, filter: 'blur(0px)', duration: 0.018, ease: 'none' }, 0.348)

    // Fase 5 — reposo real: relleno sin propiedades (ver nota arriba).
    .to({}, { duration: 0.60 }, 0.40);

  return tl.scrollTrigger;
}
