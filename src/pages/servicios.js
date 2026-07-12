import '../style/components/servicios.css';
import { initPageShell, observeReveal } from './pageShell.js';
import { renderServicios } from '../components/servicios/servicios.js';

initPageShell();
renderServicios(document.getElementById('servicios'));
observeReveal();
