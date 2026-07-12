import '../style/components/carta.css';
import '../style/components/carta-accordion.css';
import { initPageShell, observeReveal } from './pageShell.js';
import { renderCarta } from '../components/carta/carta.js';
import { initCartaAccordion } from '../components/carta/cartaAccordion.js';

initPageShell();
initCartaAccordion(document.getElementById('carta-accordion'));
renderCarta(document.getElementById('carta'));
observeReveal();
