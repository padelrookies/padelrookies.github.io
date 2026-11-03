import '../style/components/navidad.css';
import { initPageShell, observeReveal } from './pageShell.js';
import { renderNavidad } from '../components/navidad/navidad.js';

initPageShell();
renderNavidad(document.getElementById('navidad'));
observeReveal();
