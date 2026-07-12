import { servicios } from '../../data/servicios.js';

export function renderServicios(container) {
  container.innerHTML = `
    <div class="container">
      <div class="section__heading">
        <span class="section__eyebrow">Servicios</span>
        <h2>Todo lo que encontrarás</h2>
      </div>
      <div class="servicios__grid reveal">
        ${servicios
          .map(
            (s) => `
          <div class="servicios__card">
            <img src="${s.icono}" alt="" width="28" height="28" />
            <h3>${s.nombre}</h3>
            <p>${s.descripcion}</p>
          </div>`
          )
          .join('\n')}
      </div>
    </div>`;
}
