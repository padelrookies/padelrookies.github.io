import { buildWhatsAppUrl } from '../reserva-cta/ReservaCTA.js';
import { contacto } from '../../data/contacto.js';

// Menús de Navidad. Para quitarlos tras las fiestas: borrar la llamada a
// renderNavidad en src/main.js y src/pages/carta.js (y el enlace en nav.js).
const menus = [
  {
    id: 'menu-especial',
    titulo: 'Menú especial de Navidad y San Esteban',
    precio: '60 € por persona',
    resumen: 'Entrantes a compartir, plato a escoger, bebida y postre de la casa.',
    imagen: '/images/navidad/menu-especial-navidad.jpg',
    ancho: 1024,
    alto: 1536,
    alt:
      'Menú especial de Navidad y San Esteban, 60 € por persona. Entrantes a compartir: timbal de patatas con huevo y virutas de ibérico, croquetas de la casa, chocos de sepia, langostinos cocidos y pan con tomate. Plato a escoger: caldero de arroz con bogavante, piernas de cabrito rustida a baja temperatura, carrilleras de ternera con peras y ciruelas, abanico ibérico con crema de setas o suprema de bacalao a la vizcaína. Bebidas: bodega rioja tinto o blanco, refresco, agua o cerveza. Postre de la casa, café e infusiones.',
    mensaje: `Hola, querría reservar mesa para el Menú especial de Navidad y San Esteban en ${contacto.nombre}`,
  },
  {
    id: 'menu-infantil',
    titulo: 'Menú infantil de Navidad',
    precio: '30 €',
    resumen: 'Primero y segundo a escoger, con bebida y postre.',
    imagen: '/images/navidad/menu-infantil-navidad.jpg',
    ancho: 1160,
    alto: 1355,
    alt:
      'Menú infantil de Navidad, 30 €. Primero a escoger: canelones de carne, macarrones boloñesa o sopa con fideos y bolitas de carne. Segundo a escoger: tiras de pollo kentuky, croquetas de cocido o huevos con patatas y virutas de jamón ibérico. Incluye bebidas y postre.',
    mensaje: `Hola, querría reservar mesa con el Menú infantil de Navidad en ${contacto.nombre}`,
  },
];

export function renderNavidad(container) {
  container.innerHTML = `
    <div class="container navidad">
      <div class="section__heading reveal">
        <span class="section__eyebrow">Navidad en El Racó</span>
        <h2>Celebra la Navidad con nosotros</h2>
        <p>Dos menús para las fiestas: uno para la mesa de los mayores y otro pensado para los más pequeños. Reserva con tiempo.</p>
      </div>
      <div class="navidad__grid">
        ${menus
          .map(
            (m) => `
          <article class="navidad__card reveal" id="${m.id}">
            <button class="navidad__img-btn" type="button" data-src="${m.imagen}" data-alt="${m.alt}" aria-label="Ampliar: ${m.titulo}">
              <img src="${m.imagen}" alt="${m.alt}" width="${m.ancho}" height="${m.alto}" loading="lazy" decoding="async" />
            </button>
            <div class="navidad__body">
              <h3>${m.titulo}</h3>
              <p class="navidad__precio">${m.precio}</p>
              <p>${m.resumen}</p>
              <a class="btn btn--primary" href="${buildWhatsAppUrl(m.mensaje)}" target="_blank" rel="noopener">
                <img src="/icons/whatsapp.svg" alt="" width="20" height="20" /> Reservar por WhatsApp
              </a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
    <dialog class="navidad__dialog" aria-label="Menú ampliado">
      <form method="dialog"><button class="navidad__close" aria-label="Cerrar">×</button></form>
      <img alt="" />
    </dialog>`;

  const dialog = container.querySelector('dialog');
  const big = dialog.querySelector('img');
  container.querySelectorAll('.navidad__img-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      big.src = btn.dataset.src;
      big.alt = btn.dataset.alt;
      dialog.showModal();
    })
  );
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
