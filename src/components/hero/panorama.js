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

  const [{ Viewer }, { MarkersPlugin }, { VirtualTourPlugin }, { GyroscopePlugin }, THREE] = await Promise.all([
    import('@photo-sphere-viewer/core'),
    import('@photo-sphere-viewer/markers-plugin'),
    import('@photo-sphere-viewer/virtual-tour-plugin'),
    import('@photo-sphere-viewer/gyroscope-plugin'),
    import('three'),
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
    // Un solo dedo para mirar alrededor (más cómodo/intuitivo que exigir
    // dos). Contrapartida: ese mismo dedo ya no hace scroll de página
    // dentro de la foto, así que el botón "Seguir bajando ↓" (más abajo,
    // se muestra en cuanto la foto es interactiva) es la única forma de
    // continuar hacia "Ubicación" en móvil sin quedarse atrapado.
    touchmoveTwoFingers: false,
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

  // --- Giroscopio con recalibración manual en los dos ejes ---
  //
  // El plugin oficial de PSV solo "recuerda" la referencia para el giro
  // izquierda-derecha (yaw): al activarse, calibra un desfase respecto a
  // la vista actual y lo mantiene. El arriba-abajo (pitch) lo toma
  // SIEMPRE en crudo del sensor, en cada fotograma, sin desfase — así
  // que arrastrar con el dedo para corregirlo solo dura un instante: el
  // propio bucle de render del plugin lo vuelve a fijar según la
  // inclinación física real del móvil (p.ej. tumbado en el sofá, mirando
  // hacia arriba). No hay ninguna opción de configuración para esto.
  //
  // Para que el pitch TAMBIÉN recalibre — que el giroscopio siga desde
  // donde se suelta el arrastre, en vez de saltar siempre a la
  // inclinación real del móvil, como pidió el cliente — se reimplementa
  // aquí la aplicación de yaw/pitch con desfase propio en ambos ejes.
  // Se sigue usando el GyroscopePlugin oficial, pero solo para lo que sí
  // hace bien: pedir permiso de movimiento en iOS (`start()`) y mantener
  // actualizado su objeto `controls` (la lectura del sensor, ya
  // convertida a cuaternión) — se le llama `.stop()` justo después de
  // `start()` para que su PROPIO bucle de render nunca escriba nada (así
  // no compite con el nuestro), y se lee `controls` a mano en cada
  // fotograma con el mismo helper que usa el plugin internamente.
  const gyroscopePlugin = viewer.getPlugin(GyroscopePlugin);
  const gyroDirection = new THREE.Vector3();
  let gyroActive = false;
  let gyroYawOffset = null; // null = recalibrar en el próximo fotograma válido
  let gyroPitchOffset = 0;
  let gyroOriginalMoveInertia = null;
  let gyroControlsReady = false;
  let isPointerDown = false;

  function readGyroSpherical() {
    if (!gyroscopePlugin.controls?.update()) return null;
    gyroscopePlugin.controls.object.getWorldDirection(gyroDirection);
    return viewer.dataHelper.vector3ToSphericalCoords(gyroDirection);
  }

  function enableGyroTracking() {
    gyroActive = true;
    gyroYawOffset = null;
    if (gyroOriginalMoveInertia === null) {
      gyroOriginalMoveInertia = viewer.config.moveInertia;
    }
    viewer.config.moveInertia = 0;
  }

  function disableGyroTracking() {
    gyroActive = false;
    if (gyroOriginalMoveInertia !== null) {
      viewer.config.moveInertia = gyroOriginalMoveInertia;
    }
  }

  viewer.addEventListener('before-render', () => {
    if (!gyroActive) return;
    const spherical = readGyroSpherical();
    if (!spherical) return;
    if (gyroYawOffset === null) {
      // Primer fotograma tras (re)activar: calibra sin mover la cámara,
      // tomando la vista actual — donde el usuario la haya dejado —
      // como referencia. Esto es lo que hace que "siga desde ahí".
      const current = viewer.getPosition();
      gyroYawOffset = spherical.yaw - current.yaw;
      gyroPitchOffset = -spherical.pitch - current.pitch;
      return;
    }
    viewer.dynamics.position.goto(
      { yaw: spherical.yaw - gyroYawOffset, pitch: -spherical.pitch - gyroPitchOffset },
      3,
    );
  });

  // Arranca el permiso/sensor una vez (en iOS necesita un gesto real del
  // usuario, por eso también se reintenta al primer toque) y deja el
  // plugin oficial siempre parado — solo se usa como fuente del sensor,
  // el bucle propio de arriba es quien manda sobre la cámara.
  const initGyroControls = () => {
    if (gyroControlsReady) return;
    gyroscopePlugin
      .start()
      .then(() => {
        gyroscopePlugin.stop();
        gyroControlsReady = true;
        // Si el permiso se concede a mitad de un arrastre (el propio
        // toque que lo concede), no lo activamos todavía — se activará
        // solo al soltar el dedo, igual que tras cualquier otro gesto.
        if (!isPointerDown) enableGyroTracking();
      })
      .catch(() => {});
  };
  initGyroControls();
  container.addEventListener('touchstart', initGyroControls, { passive: true });
  container.addEventListener('click', initGyroControls);

  container.addEventListener('touchstart', () => (isPointerDown = true), { passive: true });
  container.addEventListener('mousedown', () => (isPointerDown = true));

  // En cuanto se detecta un arrastre manual real (no un simple roce o
  // pellizco de zoom, filtrado con MANUAL_DRAG_THRESHOLD), se pausa
  // nuestro bucle para no pelearse con el gesto — y en cuanto se suelta
  // el dedo, se reactiva recalibrando desde donde se ha quedado la
  // vista.
  const MANUAL_DRAG_THRESHOLD = 0.02; // ~1.1°, para no confundir un pellizco de zoom con un arrastre real
  viewer.addEventListener('before-rotate', ({ position }) => {
    if (!gyroActive) return;
    const current = viewer.getPosition();
    const delta = Math.abs(position.pitch - current.pitch) + Math.abs(position.yaw - current.yaw);
    if (delta > MANUAL_DRAG_THRESHOLD) {
      disableGyroTracking();
    }
  });

  const onPointerUp = () => {
    isPointerDown = false;
    if (gyroControlsReady && !gyroActive) enableGyroTracking();
  };
  container.addEventListener('touchend', onPointerUp, { passive: true });
  container.addEventListener('mouseup', onPointerUp);

  if (import.meta.env.DEV) {
    window.__psvDebug = {
      viewer,
      markersPlugin,
      gyro: () => ({
        active: gyroActive,
        controlsReady: gyroControlsReady,
        isPointerDown,
        yawOffset: gyroYawOffset,
        pitchOffset: gyroPitchOffset,
      }),
      // Solo para pruebas automatizadas (Puppeteer no tiene sensor de
      // movimiento real): permite inyectar un `controls` simulado y
      // forzar encendido/apagado para probar la lógica de calibración.
      __gyroTestHooks: {
        THREE,
        setControls: (c) => {
          gyroscopePlugin.controls = c;
        },
        enable: enableGyroTracking,
        disable: disableGyroTracking,
        forceControlsReady: () => {
          gyroControlsReady = true;
        },
      },
    };

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
      hint.textContent = 'Desliza para mirar alrededor';
    }
    // Con un solo dedo controlando la vista 360°, ya no queda ningún
    // gesto táctil libre para hacer scroll de página desde dentro de la
    // foto — este botón es la única salida en móvil.
    document.querySelector('.hero__continue-hint')?.addEventListener('click', () => {
      document.querySelector('#ubicacion')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}
