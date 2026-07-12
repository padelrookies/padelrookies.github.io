import { contacto } from '../../data/contacto.js';
import { buildWhatsAppUrl, buildTelUrl } from '../reserva-cta/ReservaCTA.js';

export function renderNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = `
    <nav class="nav-fixed" aria-label="Navegación principal">
      <div class="nav-fixed__inner">
        <a class="nav-fixed__brand" href="/">
          <img src="/images/logo/logo.png" alt="${contacto.nombre}" width="55" height="48" />
        </a>
        <ul class="nav-fixed__links">
          <li><a href="/carta.html">Carta</a></li>
          <li><a href="/esencia.html">Nuestra esencia</a></li>
          <li><a href="/servicios.html">Servicios</a></li>
          <li><a href="/#horarios">Horarios</a></li>
          <li><a href="/#ubicacion">Cómo llegar</a></li>
        </ul>
        <div class="nav-fixed__actions">
          <a class="nav-fixed__icon-link" href="${buildTelUrl()}" aria-label="Llamar a ${contacto.nombre}">
            <img src="/icons/phone.svg" alt="" width="20" height="20" />
          </a>
          <a
            class="nav-fixed__icon-link nav-fixed__icon-link--whatsapp"
            href="${buildWhatsAppUrl()}"
            target="_blank"
            rel="noopener"
            aria-label="Escribir por WhatsApp"
          >
            <img src="/icons/whatsapp.svg" alt="" width="20" height="20" />
          </a>
        </div>
      </div>
    </nav>`;
}
