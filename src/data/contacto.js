// Dominio de publicación en GitHub Pages. Si el negocio pasa a un dominio
// propio, actualizar solo aquí — canonical, Open Graph, sitemap.xml y el
// JSON-LD (structuredData.js) lo leen todos de esta única constante.
export const SITE_URL = 'https://padelrookies.github.io';

// Datos reales y confirmados — no son placeholder.
export const contacto = {
  nombre: "El Racó d'en Tito",
  tagline: 'Menja bé, menja bo', // eslogan real, tomado del cartel de la fachada
  direccion: 'Avinguda dels Jocs Olímpics, 5, 08840 Viladecans, Barcelona',
  // Mismo domicilio, desglosado para el JSON-LD (schema.org PostalAddress
  // exige los campos por separado, no la cadena libre de arriba).
  direccionEstructurada: {
    calle: 'Avinguda dels Jocs Olímpics, 5',
    localidad: 'Viladecans',
    provincia: 'Barcelona',
    codigoPostal: '08840',
    pais: 'ES',
  },
  telefonoDisplay: '936 37 78 26',
  telefonoWhatsApp: '34625603720', // formato wa.me: sin +, sin espacios
  email: 'elracodeltito@gmail.com',
  googleMapsEmbedSrc:
    'https://www.google.com/maps?q=Avinguda+dels+Jocs+Ol%C3%ADmpics+5%2C+08840+Viladecans&output=embed',
  googleMapsLink:
    'https://www.google.com/maps/search/?api=1&query=Avinguda+dels+Jocs+Ol%C3%ADmpics+5%2C+08840+Viladecans',
  googleRating: { score: 4.3, count: '1000+', label: 'Google' },
  uberEatsRating: { score: 4.8, label: 'Uber Eats' },
  isPlaceholder: false,
};
