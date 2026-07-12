import { prefersReducedMotion } from './reducedMotion.js';

export function qs(sel, ctx = document) {
  return ctx.querySelector(sel);
}

export function qsa(sel, ctx = document) {
  return [...ctx.querySelectorAll(sel)];
}

/** Revela elementos .reveal cuando entran en viewport; instantáneo si el usuario pidió menos movimiento. */
export function observeReveal(root = document) {
  const els = qsa('.reveal', root);
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  els.forEach((el) => io.observe(el));
}
