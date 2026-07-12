// Genera imágenes de relleno 100% locales (sin red) para el contenido que
// todavía no tiene foto real: algunos platos de la galería. Cada imagen
// lleva una cinta "IMAGEN TEMPORAL" visible para que sea obvio que hay que
// sustituirla — ver PLACEHOLDERS.md. Idempotente: se puede volver a
// ejecutar con `npm run gen:placeholders`.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/images/galeria';

const PALETTE = {
  cream: '#FBF3E7',
  magenta: '#950AA0',
  wine: '#5B1732',
  terracotta: '#8A5A3A',
  teal: '#3A7873',
};

function plateSvg({ title, accent, seed }) {
  const w = 1200;
  const h = 900;
  const cx = w / 2;
  const cy = h / 2 - 20;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${PALETTE.cream}"/>
  <circle cx="${cx - 260}" cy="${cy + 180}" r="340" fill="${accent}" opacity="0.08"/>
  <circle cx="${cx + 300}" cy="${cy - 200}" r="260" fill="${accent}" opacity="0.08"/>

  <circle cx="${cx}" cy="${cy}" r="230" fill="none" stroke="${accent}" stroke-width="6"/>
  <circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="${accent}" stroke-width="3" opacity="0.6"/>
  <g stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.75">
    <path d="M${cx - 40} ${cy - 40} q10 -40 0 -70" fill="none"/>
    <path d="M${cx} ${cy - 55} q10 -40 0 -70" fill="none"/>
    <path d="M${cx + 40} ${cy - 40} q10 -40 0 -70" fill="none"/>
  </g>
  <g fill="${accent}" opacity="0.85">
    ${Array.from({ length: 6 })
      .map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + seed;
        const r = 70 + (i % 3) * 18;
        const x = cx + Math.cos(a) * r;
        const y = cy + 40 + Math.sin(a) * r * 0.5;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${16 + (i % 2) * 6}"/>`;
      })
      .join('\n    ')}
  </g>

  <g transform="translate(0,${h - 150})">
    <rect width="${w}" height="150" fill="${PALETTE.wine}"/>
    <text x="${w / 2}" y="60" font-family="Georgia, serif" font-size="40" font-weight="700" fill="${PALETTE.cream}" text-anchor="middle">${title}</text>
    <text x="${w / 2}" y="102" font-family="sans-serif" font-size="22" letter-spacing="2" fill="${PALETTE.cream}" text-anchor="middle" opacity="0.85">IMAGEN TEMPORAL — PENDIENTE DE FOTO REAL</text>
  </g>
</svg>`;
}

const items = [
  { file: 'galeria-04-ambiente-placeholder.jpg', title: 'La sala', accent: PALETTE.teal, seed: 0.4 },
  { file: 'galeria-05-bravas-placeholder.jpg', title: 'Patatas bravas', accent: PALETTE.magenta, seed: 1.1 },
  { file: 'galeria-06-croquetas-placeholder.jpg', title: 'Croquetas de la casa', accent: PALETTE.terracotta, seed: 2.2 },
  { file: 'galeria-07-boquerones-placeholder.jpg', title: 'Boquerones a la andaluza', accent: PALETTE.wine, seed: 3.3 },
  { file: 'galeria-08-menudia-placeholder.jpg', title: 'Menú del día', accent: PALETTE.magenta, seed: 4.4 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const item of items) {
    const svg = plateSvg(item);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(OUT, item.file));
  }
  console.log(`Generados ${items.length} placeholders en ${OUT}/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
