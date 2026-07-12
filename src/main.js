import './style/tokens.css';
import './style/base.css';
import './style/layout.css';
import './style/components/nav.css';
import './style/components/hero.css';
import './style/components/ubicacion.css';
import './style/components/reserva-cta.css';
import './style/components/footer.css';

import { renderNav } from './components/nav/nav.js';
import { initHero } from './components/hero/hero.js';
import { renderUbicacion } from './components/ubicacion/ubicacion.js';
import { renderFooter } from './components/footer/footer.js';
import { observeReveal } from './utils/dom.js';

renderNav();
initHero();

renderUbicacion(document.getElementById('ubicacion'));
renderFooter();

observeReveal();
