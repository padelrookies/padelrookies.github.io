import { panoramaScenes } from '../../data/panorama-scenes.js';
import { horarios } from '../../data/horarios.js';
import { prefersReducedMotion } from '../../utils/reducedMotion.js';
import { renderReservaCTA } from '../reserva-cta/ReservaCTA.js';

function horariosPanelHtml() {
  const filas = horarios.dias
    .map((d) => {
      const tramos = d.tramos.length ? d.tramos.join(' y ') : d.nota || 'Cerrado';
      return `<tr><th scope="row">${d.dia}</th><td>${tramos}</td></tr>`;
    })
    .join('');
  return `
    <div class="panorama-panel">
      <h3>${horarios.temporada}</h3>
      <table class="panorama-panel__table">${filas}</table>
    </div>`;
}

function reservaPanelHtml() {
  const holder = document.createElement('div');
  renderReservaCTA(holder, { variant: 'panel' });
  return `<div class="panorama-panel"><h3>Reservar mesa</h3>${holder.innerHTML}</div>`;
}

// Convierte los datos de marcador (icono + texto) de panorama-scenes.js en
// un marcador PSV de tipo `html`: icono + bocadillo de CTA siempre visible
// (no un tooltip que solo aparece al pasar el ratón), agrupados en un único
// elemento para que el latido (`panorama-marker--pulse`, en hero.css) anime
// el conjunto entero como una sola pieza.
function buildActionMarker(marker) {
  const { id, position, image, cta, data } = marker;
  return {
    id,
    position,
    html: `
      <div class="panorama-marker">
        <span class="panorama-marker__cta">${cta}</span>
        <img class="panorama-marker__icon" src="${image}" alt="" />
      </div>`,
    anchor: 'bottom center',
    className: 'panorama-marker--pulse',
    data,
  };
}

function handleMarkerAction(viewer, action) {
  if (!action) return;
  if (action.type === 'link') {
    window.location.assign(action.href);
  } else if (action.type === 'scroll') {
    const target = document.querySelector(action.target);
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  } else if (action.type === 'panel') {
    const content = action.panelType === 'horarios' ? horariosPanelHtml() : reservaPanelHtml();
    viewer.panel.show({ id: `panel-${action.panelType}`, content, width: '340px' });
  }
}

/**
 * Monta el visor 360° dentro del hero. Se llama de forma inmediata desde
 * hero.js (no hay carga diferida por scroll: el panorama forma parte de
 * la secuencia visible desde el primer momento, solo queda oculto tras la
 * capa de fachada hasta que el timeline de heroScroll.js lo revela).
 */
export async function initPanorama() {
  const container = document.getElementById('panorama-container');
  if (!container) return;

  const [{ Viewer }, { MarkersPlugin }, { VirtualTourPlugin }, { GyroscopePlugin }] = await Promise.all([
    import('@photo-sphere-viewer/core'),
    import('@photo-sphere-viewer/markers-plugin'),
    import('@photo-sphere-viewer/virtual-tour-plugin'),
    import('@photo-sphere-viewer/gyroscope-plugin'),
  ]);
  await Promise.all([
    import('@photo-sphere-viewer/core/index.css'),
    import('@photo-sphere-viewer/markers-plugin/index.css'),
    import('@photo-sphere-viewer/virtual-tour-plugin/index.css'),
  ]);

  const reduced = prefersReducedMotion();

  // defaultZoomLvl fija el FOV VERTICAL, siempre igual en cualquier
  // pantalla — pero el FOV HORIZONTAL que realmente se percibe depende
  // del aspect ratio del contenedor. En una pantalla ancha (escritorio)
  // ese mismo FOV vertical da un FOV horizontal amplio; en una pantalla
  // estrecha y alta (móvil) da un FOV horizontal mucho más estrecho —
  // efecto túnel, se ve "con más zoom" aunque el número configurado sea
  // el mismo. Por eso en móvil hace falta un zoom bastante menor (y un
  // maxFov más alto, ya que 90° se queda corto) para compensar y lograr
  // una sensación de amplitud parecida a la de escritorio.
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  const viewer = new Viewer({
    container,
    // Sin `panorama` de nivel superior a propósito: con VirtualTourPlugin
    // activo, cargar un panorama aquí Y que el plugin navegue a
    // `startNodeId` a la vez provoca una carrera que aborta la primera
    // petición de la imagen (visto en pruebas: net::ERR_ABORTED).
    //
    // touchmoveTwoFingers:true a propósito — el panorama ocupa toda la
    // pantalla en móvil, así que un arrastre de un solo dedo tiene que
    // seguir haciendo scroll de página con normalidad (para poder llegar
    // a "Ubicación"/footer sin quedarse "atrapado" dentro del visor).
    // Mirar alrededor pasa a requerir dos dedos, igual que en Google Maps
    // Street View embebido.
    touchmoveTwoFingers: true,
    mousewheel: false,
    // Sin botón de "gyroscope" en la navbar a propósito: el giroscopio se
    // activa solo (ver más abajo), no hace falta que el usuario lo pulse.
    navbar: ['zoom', 'caption', 'fullscreen'],
    // Un poco menos de zoom que el 50 por defecto = FOV más ancho = la
    // sala del comedor-1 (nodo de arranque) se ve un poco más alejada.
    // En móvil, bastante menos zoom todavía (ver nota de isMobile arriba).
    defaultZoomLvl: isMobile ? 5 : 40,
    maxFov: isMobile ? 105 : 90,
    // Encuadre de arranque: coordenadas leídas a mano con el chivato de
    // yaw/pitch en vivo (ver panel dev-only más abajo), ajustadas por el
    // cliente para encarar los sofás con un poco de la tele en el encuadre.
    defaultYaw: '56deg',
    defaultPitch: '-11deg',
    plugins: [
      VirtualTourPlugin.withConfig({
        positionMode: 'manual',
        renderMode: '3d',
        startNodeId: panoramaScenes[0].id,
        nodes: panoramaScenes.map((s) => ({
          id: s.id,
          panorama: s.panorama,
          name: s.name,
          links: s.links,
          markers: s.markers.map(buildActionMarker),
        })),
      }),
      MarkersPlugin,
      GyroscopePlugin,
    ],
  });

  const markersPlugin = viewer.getPlugin(MarkersPlugin);
  markersPlugin.addEventListener('select-marker', ({ marker }) => {
    handleMarkerAction(viewer, marker.data?.action);
  });

  // Giroscopio activo desde el principio, sin botón: en Android no hace
  // falta permiso y este start() ya vale. En iOS, DeviceOrientationEvent
  // exige que el permiso se pida DENTRO de un gesto real del usuario (un
  // toque), así que este start() de aquí fallará en silencio ahí.
  //
  // Además, PSV apaga el giroscopio solo cada vez que se detecta un
  // gesto táctil de mover/hacer zoom (StopAllEvent interno — pensado
  // para que el gesto manual no compita con el giroscopio mientras
  // dura, pero de paso lo deja apagado para siempre tras un pellizco de
  // zoom). Por eso reintentamos encenderlo no solo una vez al principio,
  // sino cada vez que se suelta el dedo: así, además de servir como el
  // primer gesto que pide permiso en iOS, también lo reactiva solo justo
  // después de cualquier pellizco de zoom o arrastre con dos dedos.
  const gyroscopePlugin = viewer.getPlugin(GyroscopePlugin);
  const resumeGyroscope = () => {
    if (!gyroscopePlugin.isEnabled()) gyroscopePlugin.start().catch(() => {});
  };
  resumeGyroscope();
  container.addEventListener('touchend', resumeGyroscope, { passive: true });
  container.addEventListener('mouseup', resumeGyroscope);

  // (Se probó a "anclar" el pitch del giroscopio — que PSV toma tal
  // cual del sensor, sin relativizar como hace con el yaw — forzando la
  // posición en cada `position-updated`. Se revirtió: pelea con el
  // suavizado interno del propio giroscopio (que anima con su sistema
  // de "dynamics", no con `viewer.rotate()`) y el resultado era un
  // giro brusco y nada fluido. Queda pendiente encontrar una forma de
  // evitar el salto inicial de pitch sin interferir cada fotograma.)

  if (import.meta.env.DEV) {
    window.__psvDebug = { viewer, markersPlugin };

    // Chivato visual (solo en `npm run dev`, nunca en producción): un
    // pequeño cartel en la esquina que muestra yaw/pitch en vivo mientras
    // arrastras la vista, para poder leer a ojo el encuadre exacto que se
    // quiere fijar como `defaultYaw`/`defaultPitch` (o como posición de un
    // marcador) sin tener que abrir la consola del navegador.
    const readout = document.createElement('div');
    readout.style.cssText =
      'position:fixed;bottom:12px;left:12px;z-index:9999;background:rgba(0,0,0,.75);color:#fff;' +
      'font:13px/1.4 monospace;padding:8px 12px;border-radius:8px;pointer-events:none;white-space:pre;';
    document.body.appendChild(readout);
    let lastClick = '';
    const deg = (rad) => ((rad * 180) / Math.PI).toFixed(1);
    const updateReadout = ({ position }) => {
      readout.textContent =
        `escena: ${viewer.getPlugin(VirtualTourPlugin).getCurrentNode()?.id}\n` +
        `yaw: ${deg(position.yaw)}deg\npitch: ${deg(position.pitch)}deg${lastClick}`;
    };
    viewer.addEventListener('position-updated', updateReadout);
    // Al hacer clic sobre la foto, guarda y muestra las coordenadas del
    // punto EXACTO clicado (más preciso que centrar la vista a ojo) —
    // pensado para ubicar marcadores/flechas en un sitio concreto.
    viewer.addEventListener('click', ({ data }) => {
      lastClick = `\n— último clic —\nyaw: ${deg(data.yaw)}deg\npitch: ${deg(data.pitch)}deg`;
      updateReadout({ position: viewer.getPosition() });
    });
  }

  viewer.addEventListener('ready', () => {
    container.classList.add('is-mounted');
    if (reduced) {
      viewer.stopAutorotate?.();
    }
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const hint = document.querySelector('.hero__drag-hint');
    if (hint && isTouch) {
      hint.textContent = 'Desliza con dos dedos para mirar alrededor';
    }
  });
}
