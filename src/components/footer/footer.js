import { contacto } from '../../data/contacto.js';
import { horarios } from '../../data/horarios.js';
import { social } from '../../data/social.js';

export function renderFooter() {
  const root = document.getElementById('footer-root');
  const socialLinks = [
    social.instagram ? `<a href="${social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><img src="/icons/instagram.svg" alt="" width="20" height="20" /></a>` : '',
    social.facebook ? `<a href="${social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><img src="/icons/facebook.svg" alt="" width="20" height="20" /></a>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  root.innerHTML = `
    <div class="container footer__grid">
      <div>
        <p class="footer__brand">${contacto.nombre}</p>
        <p>${contacto.direccion}</p>
        <p><a href="tel:+${contacto.telefonoWhatsApp}">${contacto.telefonoDisplay}</a> · <a href="mailto:${contacto.email}">${contacto.email}</a></p>
        <p class="footer__ratings">★ ${contacto.googleRating.score} en ${contacto.googleRating.label} (${contacto.googleRating.count} reseñas) · ★ ${contacto.uberEatsRating.score} en ${contacto.uberEatsRating.label}</p>
      </div>
      <div>
        <p class="footer__heading">${horarios.temporada}</p>
        ${horarios.dias
          .map((d) => `<p class="footer__horario-row">${d.dia}: ${d.tramos.length ? d.tramos.join(' y ') : d.nota || 'Cerrado'}</p>`)
          .join('\n')}
      </div>
      <div>
        ${socialLinks ? `<div class="footer__social">${socialLinks}</div>` : ''}
        <p class="footer__legal">
          © ${new Date().getFullYear()} ${contacto.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </div>`;
}
