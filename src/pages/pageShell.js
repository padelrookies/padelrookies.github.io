// Esqueleto común de las páginas secundarias: estilos base + nav + footer.
import '../style/tokens.css';
import '../style/base.css';
import '../style/layout.css';
import '../style/components/nav.css';
import '../style/components/footer.css';
import '../style/components/reserva-cta.css';

import { renderNav } from '../components/nav/nav.js';
import { renderFooter } from '../components/footer/footer.js';
import { observeReveal } from '../utils/dom.js';

export function initPageShell() {
  renderNav();
  renderFooter();
}

export { observeReveal };
