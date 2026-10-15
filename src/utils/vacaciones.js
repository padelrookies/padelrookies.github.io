// Cierre por vacaciones. Hasta REAPERTURA se muestra el aviso y se desactivan
// WhatsApp y teléfono; a partir de esa fecha todo vuelve solo, sin tocar nada.
// 27 de octubre 2026, 00:00 hora de Madrid (CET, UTC+1).
const REAPERTURA = new Date('2026-10-27T00:00:00+01:00');

export function enVacaciones(ahora = new Date()) {
  return ahora < REAPERTURA;
}

const SELECTOR_CONTACTO = 'a[href^="tel:"], a[href*="wa.me"]';

function desactivar(root) {
  root.querySelectorAll(SELECTOR_CONTACTO).forEach((a) => {
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('title', 'Estamos de vacaciones: volvemos el 27 de octubre');
    a.classList.add('is-disabled');
  });
}

// Los componentes se pintan en momentos distintos (nav, footer, CTA de cada
// página), así que se vigila el body y se desactiva lo que vaya apareciendo.
export function desactivarContactoEnVacaciones() {
  if (!enVacaciones()) return;
  desactivar(document);
  new MutationObserver(() => desactivar(document)).observe(document.body, {
    childList: true,
    subtree: true,
  });
}
