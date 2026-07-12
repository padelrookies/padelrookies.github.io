import { contacto } from '../../data/contacto.js';

// Único módulo que sabe CÓMO se reserva hoy (WhatsApp / llamada). Cuando
// exista un sistema de reservas real, solo hay que cambiar este archivo.

export function buildWhatsAppUrl(message = `Hola, querría reservar mesa en ${contacto.nombre}`) {
  return `https://wa.me/${contacto.telefonoWhatsApp}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl() {
  return `tel:+${contacto.telefonoWhatsApp}`;
}

/** variant: 'section' | 'panel' — misma lógica, distinto tamaño vía CSS. */
export function renderReservaCTA(target, { variant = 'section' } = {}) {
  target.innerHTML = `
    <div class="reserva-cta reserva-cta--${variant}">
      <a class="btn btn--on-dark" href="${buildWhatsAppUrl()}" target="_blank" rel="noopener">
        <img src="/icons/whatsapp.svg" alt="" width="20" height="20" />
        Reservar por WhatsApp
      </a>
      <a class="btn btn--secondary reserva-cta__tel" href="${buildTelUrl()}">
        <img src="/icons/phone.svg" alt="" width="18" height="18" />
        Llamar ahora
      </a>
    </div>`;
}
