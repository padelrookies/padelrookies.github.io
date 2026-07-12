import { menuDelDia } from '../../data/menu.js';

function formatPrecio(precio) {
  return precio == null ? 'Consultar' : `${precio.toFixed(2).replace('.', ',')} €`;
}

export function renderCarta(container) {
  container.innerHTML = `
    <div class="container">
      <div class="section__heading">
        <span class="section__eyebrow">La carta</span>
        <h2>Comida honesta, sin postureo</h2>
      </div>

      <div class="carta__menu-dia reveal">
        <h3>${menuDelDia.nombre}</h3>
        <div class="carta__menu-dia-prices">
          <div>
            <strong>${formatPrecio(menuDelDia.precioLaborable)}</strong>
            <span>Lunes a viernes</span>
          </div>
          <div>
            <strong>${formatPrecio(menuDelDia.precioFinDeSemana)}</strong>
            <span>Sábados, domingos y festivos</span>
          </div>
        </div>
        <p class="carta__menu-dia-incluye">Incluye ${menuDelDia.incluye.toLowerCase()}.</p>
      </div>
    </div>`;
}
