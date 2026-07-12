import '../style/components/esencia.css';
import { initPageShell, observeReveal } from './pageShell.js';
import { renderEsencia } from '../components/esencia/esencia.js';

initPageShell();
renderEsencia(document.getElementById('esencia'));
observeReveal();
