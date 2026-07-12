// Genera imágenes de relleno 100% locales para el acordeón 3D de la carta:
// una escena de fondo + 8 caras de panel (4 frontales, 4 dorso). Cada una
// lleva una etiqueta clara ("PANEL N · FRONTAL/DORSO") y la cinta
// "IMAGEN TEMPORAL" — ver PLACEHOLDERS.md. Idempotente: se puede volver a
// ejecutar con `npm run gen:carta-accordion`.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/images/carta';

const PALETTE = {
  cream: '#FBF3E7',
  magenta: '#950AA0',
  wine: '#5B1732',
  terracotta: '#8A5A3A',
  teal: '#3A7873',
};

function panelSvg({ label, accent, seed }) {
  const w = 900;
  const h = 2547; // proporción real de una hoja A2 plegada en 4 tiras (2.83:1)
  const lineCount = 9;
  const lines = Array.from({ length: lineCount })
    .map((_, i) => {
      const y = 420 + i * 130 + (Math.sin(seed + i) * 10);
      const lw = 420 + ((i * 37 + seed * 50) % 260);
      return `<rect x="${(w - lw) / 2}" y="${y.toFixed(1)}" width="${lw}" height="14" rx="7" fill="${accent}" opacity="${0.5 + (i % 3) * 0.12}"/>`;
    })
    .join('\n    ');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${PALETTE.cream}"/>
  <circle cx="${w * 0.5}" cy="${h * 0.16}" r="220" fill="${accent}" opacity="0.1"/>
  <circle cx="${w * 0.5}" cy="${h * 0.16}" r="150" fill="none" stroke="${accent}" stroke-width="5" opacity="0.7"/>
  <g fill="${accent}" opacity="0.8">
    <circle cx="${w * 0.5}" cy="${h * 0.16}" r="10"/>
  </g>
  <g>
    ${lines}
  </g>
  <g transform="translate(0,${h - 260})">
    <rect width="${w}" height="260" fill="${PALETTE.wine}"/>
    <text x="${w / 2}" y="110" font-family="Georgia, serif" font-size="52" font-weight="700" fill="${PALETTE.cream}" text-anchor="middle">${label}</text>
    <text x="${w / 2}" y="170" font-family="sans-serif" font-size="28" letter-spacing="1" fill="${PALETTE.cream}" text-anchor="middle" opacity="0.85">IMAGEN TEMPORAL</text>
    <text x="${w / 2}" y="212" font-family="sans-serif" font-size="24" letter-spacing="1" fill="${PALETTE.cream}" text-anchor="middle" opacity="0.7">PENDIENTE DE FOTO REAL</text>
  </g>
</svg>`;
}

const accents = [PALETTE.magenta, PALETTE.terracotta, PALETTE.teal, PALETTE.wine];

const panelItems = Array.from({ length: 4 }).flatMap((_, i) => [
  { file: `carta-panel-${i + 1}-frontal-placeholder.jpg`, label: `PANEL ${i + 1} · FRONTAL`, accent: accents[i], seed: i },
  { file: `carta-panel-${i + 1}-dorso-placeholder.jpg`, label: `PANEL ${i + 1} · DORSO`, accent: accents[i], seed: i + 0.5 },
]);

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const item of panelItems) {
    await sharp(Buffer.from(panelSvg(item)))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT, item.file));
  }
  // La escena de fondo ya tiene foto real (carta-bg-scene.jpg) — no se
  // regenera un placeholder que la pisaría sin querer.
  console.log(`Generados ${panelItems.length} placeholders en ${OUT}/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
