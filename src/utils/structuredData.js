import { contacto, SITE_URL } from '../data/contacto.js';
import { horarios } from '../data/horarios.js';

// Traduce las etiquetas de día en español usadas en horarios.js al listado
// de días que exige schema.org (en inglés, capitalizados). Cubre tanto
// días sueltos como rangos ("Martes a viernes").
const DIA_A_SCHEMA = {
  Lunes: ['Monday'],
  Martes: ['Tuesday'],
  Miércoles: ['Wednesday'],
  Jueves: ['Thursday'],
  Viernes: ['Friday'],
  Sábado: ['Saturday'],
  Domingo: ['Sunday'],
  'Martes a viernes': ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

function buildOpeningHoursSpecification() {
  return horarios.dias
    .filter((d) => d.tramos.length)
    .flatMap((d) => {
      const dayOfWeek = DIA_A_SCHEMA[d.dia];
      return d.tramos.map((tramo) => {
        const [opens, closes] = tramo.split('–').map((h) => h.trim());
        return { '@type': 'OpeningHoursSpecification', dayOfWeek, opens, closes };
      });
    });
}

function buildRestaurantSchema() {
  const { calle, localidad, provincia, codigoPostal, pais } = contacto.direccionEstructurada;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: contacto.nombre,
    image: `${SITE_URL}/images/hero/hero-fachada.jpg`,
    url: SITE_URL,
    telephone: `+${contacto.telefonoWhatsApp}`,
    servesCuisine: 'Española',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: calle,
      addressLocality: localidad,
      addressRegion: provincia,
      postalCode: codigoPostal,
      addressCountry: pais,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: contacto.googleRating.score,
      reviewCount: 1000,
    },
    openingHoursSpecification: buildOpeningHoursSpecification(),
  };
}

/** Inserta el JSON-LD del restaurante en <head>. Idempotente: si ya existe (navegación entre páginas en dev), lo reemplaza en vez de duplicarlo. */
export function injectRestaurantSchema() {
  const id = 'schema-restaurant';
  document.getElementById(id)?.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(buildRestaurantSchema());
  document.head.appendChild(script);
}
