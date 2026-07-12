import { contacto } from '../../data/contacto.js';
import { horarios } from '../../data/horarios.js';
import { buildTelUrl, buildWhatsAppUrl } from '../reserva-cta/ReservaCTA.js';

export function renderUbicacion(container) {
  container.innerHTML = `
    <div class="container ubicacion">
      <div class="ubicacion__info reveal">
        <span class="section__eyebrow">Ubicación y contacto</span>
        <h2>Te esperamos en Viladecans</h2>

        <div id="horarios" class="ubicacion__horarios">
          <h3>${horarios.temporada}</h3>
          <table class="ubicacion__horarios-table">
            ${horarios.dias
              .map((d) => {
                const tramos = d.tramos.length ? d.tramos.join(' y ') : d.nota || 'Cerrado';
                return `<tr><th scope="row">${d.dia}</th><td>${tramos}</td></tr>`;
              })
              .join('')}
          </table>
        </div>

        <address class="ubicacion__address">
          ${contacto.direccion}
        </address>

        <div class="ubicacion__actions">
          <a class="btn btn--primary" href="${buildWhatsAppUrl()}" target="_blank" rel="noopener">
            <img src="/icons/whatsapp.svg" alt="" width="20" height="20" /> WhatsApp
          </a>
          <a class="btn btn--secondary" href="${buildTelUrl()}">
            <img src="/icons/phone.svg" alt="" width="18" height="18" /> ${contacto.telefonoDisplay}
          </a>
          <a class="btn btn--secondary" href="${contacto.googleMapsLink}" target="_blank" rel="noopener">Cómo llegar</a>
        </div>
      </div>

      <div class="ubicacion__map reveal">
        <iframe
          src="${contacto.googleMapsEmbedSrc}"
          title="Mapa de ubicación de ${contacto.nombre}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>`;
}
