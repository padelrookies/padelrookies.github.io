import { esencia } from '../../data/esencia.js';
import { contacto } from '../../data/contacto.js';

export function renderEsencia(container) {
  container.innerHTML = `
    <div class="container esencia">
      <div class="section__heading">
        <span class="section__eyebrow">${esencia.eyebrow}</span>
        <h2>${esencia.titulo}</h2>
      </div>
      <div class="esencia__grid">
        <div class="esencia__text reveal">
          ${esencia.parrafos.map((p) => `<p>${p}</p>`).join('\n')}
          <div class="esencia__ratings">
            <span class="esencia__rating">★ ${contacto.googleRating.score} <small>Google · ${contacto.googleRating.count} reseñas</small></span>
            <span class="esencia__rating">★ ${contacto.uberEatsRating.score} <small>Uber Eats</small></span>
          </div>
        </div>
        <img
          class="esencia__photo reveal"
          src="/images/galeria/galeria-01-comedor.jpg"
          alt="Comedor de El Racó d'en Tito con las mesas preparadas"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>`;
}
