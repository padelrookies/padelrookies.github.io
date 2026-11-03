import '../style/components/carta.css';
import '../style/components/carta-accordion.css';
import '../style/components/navidad.css';
import { initPageShell, observeReveal } from './pageShell.js';
import { renderCarta } from '../components/carta/carta.js';
import { renderNavidad } from '../components/navidad/navidad.js';
import { initCartaAccordion } from '../components/carta/cartaAccordion.js';

initPageShell();
initCartaAccordion(document.getElementById('carta-accordion'));
renderNavidad(document.getElementById('navidad'));
renderCarta(document.getElementById('carta'));
observeReveal();
