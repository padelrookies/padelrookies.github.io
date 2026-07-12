// Escenas del recorrido 360°. Ambas fotos son REALES (comedor del local,
// tomadas con cámara 360, sin clientes) — no son placeholder. Los valores
// yaw/pitch de los marcadores son una estimación visual inicial: conviene
// afinarlos a ojo una vez visto el visor funcionando en el navegador.
//
// IMPORTANTE: Photo Sphere Viewer interpreta los números sueltos como
// RADIANES, no grados — por eso yaw/pitch van siempre como string con
// sufijo "deg" (p.ej. '90deg'), tal como exige su API.
export const panoramaScenes = [
  {
    id: 'comedor-1',
    name: 'Comedor principal',
    panorama: '/images/panorama/panorama-comedor-1.jpg',
    isPlaceholder: false,
    // El punto físico real desde el que se tomó panorama-comedor-2.jpg
    // (junto a la mesa redonda de la puerta "Privat"). Coordenadas
    // clicadas por el cliente sobre la propia foto con el chivato de
    // "último clic" del modo dev (panorama.js) — no estimadas. Al ser
    // una posición fija en la esfera (no en pantalla), se queda anclada
    // ahí aunque gires la vista, como en Google Street View.
    links: [{ nodeId: 'comedor-2', position: { yaw: '16.4deg', pitch: '-22.8deg' } }],
    // `image`+`cta` (en vez de `tooltip`) porque panorama.js construye un
    // marcador `html` para cada uno: icono + bocadillo de texto SIEMPRE
    // visible (no un tooltip que solo aparece al pasar el ratón), para que
    // se note a simple vista que son botones — ver buildActionMarker().
    markers: [
      {
        id: 'marker-carta',
        position: { yaw: '107deg', pitch: '-18deg' },
        image: '/icons/marker-carta.svg',
        cta: 'Ver la carta',
        data: { action: { type: 'link', href: '/carta.html' } },
      },
      {
        id: 'marker-horarios',
        position: { yaw: '-30deg', pitch: '9deg' },
        image: '/icons/marker-horarios.svg',
        cta: 'Horarios',
        data: { action: { type: 'panel', panelType: 'horarios' } },
      },
      {
        id: 'marker-reserva',
        position: { yaw: '-79deg', pitch: '-5deg' },
        image: '/icons/marker-reserva.svg',
        cta: 'Reservar mesa',
        data: { action: { type: 'panel', panelType: 'reserva' } },
      },
    ],
  },
  {
    id: 'comedor-2',
    name: 'Comedor — otra vista',
    panorama: '/images/panorama/panorama-comedor-2.jpg',
    isPlaceholder: false,
    // El punto físico real desde el que se tomó panorama-comedor-1.jpg —
    // coordenadas clicadas por el cliente sobre la propia foto con el
    // chivato de "último clic" del modo dev (panorama.js).
    links: [{ nodeId: 'comedor-1', position: { yaw: '162.2deg', pitch: '-22.8deg' } }],
    markers: [],
  },
];
