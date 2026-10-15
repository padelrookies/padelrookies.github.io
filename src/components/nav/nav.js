import { contacto } from '../../data/contacto.js';
import { buildWhatsAppUrl, buildTelUrl } from '../reserva-cta/ReservaCTA.js';
import { enVacaciones, desactivarContactoEnVacaciones } from '../../utils/vacaciones.js';

export function renderNav() {
  const root = document.getElementById('nav-root');
  root.innerHTML = `
    <nav class="nav-fixed" aria-label="Navegación principal">
      <div class="nav-fixed__inner">
        <a class="nav-fixed__brand" href="/">
          <img src="/images/logo/logo.png" alt="${contacto.nombre}" width="55" height="48" />
        </a>
        <ul class="nav-fixed__links" id="nav-links">
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
          <button
            class="nav-fixed__toggle"
            type="button"
            aria-expanded="false"
            aria-controls="nav-links"
            aria-label="Abrir menú"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    ${
      enVacaciones()
        ? `<div class="aviso-vacaciones" role="status">
      <p>Estamos de vacaciones. <strong>Volvemos a abrir el martes 27 de octubre.</strong></p>
    </div>`
        : ''
    }`;

  // renderNav se ejecuta en todas las páginas: aquí se engancha el bloqueo.
  desactivarContactoEnVacaciones();

  const nav = root.querySelector('.nav-fixed');
  const toggle = root.querySelector('.nav-fixed__toggle');
  const links = root.querySelector('#nav-links');

  const closeMenu = () => {
    nav.classList.remove('nav-fixed--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-fixed--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  // Al navegar (clic en un enlace) el menú debe cerrarse solo — si es un
  // enlace con ancla (#horarios) en la propia portada, no hay recarga de
  // página que lo cierre por sí sola.
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
