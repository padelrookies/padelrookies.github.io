// Procesa las fotos REALES entregadas en assets/ (fachada, comedor 360°,
// mesa) y las deja optimizadas en public/images/ con los nombres exactos
// que ya referencian los módulos de datos. No genera nada falso: solo
// redimensiona/comprime contenido real.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ASSETS = 'assets';
const OUT = 'public/images';

async function ensureDirs() {
  for (const dir of ['hero', 'panorama', 'galeria', 'og']) {
    await mkdir(path.join(OUT, dir), { recursive: true });
  }
}

async function run() {
  await ensureDirs();

  // Hero: foto de fachada real, ancha, para el Ken Burns por scroll.
  await sharp(path.join(ASSETS, 'TITOFACHADA.jpg'))
    .rotate()
    .resize({ width: 2200 })
    .jpeg({ quality: 74, mozjpeg: true })
    .toFile(path.join(OUT, 'hero/hero-fachada.jpg'));

  // Panorama: dos escenas reales del comedor (cámara 360, sin clientes).
  await sharp(path.join(ASSETS, 'COMEDOR 1.jpg'))
    .rotate()
    .resize({ width: 6000 })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path.join(OUT, 'panorama/panorama-comedor-1.jpg'));

  await sharp(path.join(ASSETS, 'comedor2.jpg'))
    .rotate()
    .resize({ width: 6000 })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path.join(OUT, 'panorama/panorama-comedor-2.jpg'));

  // Galería 01: mesa real del comedor.
  await sharp(path.join(ASSETS, 'mesatito.jpg'))
    .rotate()
    .resize({ width: 1400, height: 1050, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'galeria/galeria-01-comedor.jpg'));

  // Galería 02: entrada, recorte de la foto de fachada.
  await sharp(path.join(ASSETS, 'TITOFACHADA.jpg'))
    .rotate()
    .extract({ left: 700, top: 480, width: 580, height: 900 })
    .resize({ width: 1050, height: 1400, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'galeria/galeria-02-entrada.jpg'));

  // Galería 03: cartel real de "Nuestras tapas".
  await sharp(path.join(ASSETS, 'TITOFACHADA.jpg'))
    .rotate()
    .extract({ left: 380, top: 760, width: 280, height: 480 })
    .resize({ width: 1050, height: 1400, fit: 'cover' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, 'galeria/galeria-03-tapas.jpg'));

  // OG image para compartir en redes: fachada recortada 1200x630.
  await sharp(path.join(ASSETS, 'TITOFACHADA.jpg'))
    .rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'og/og-image.jpg'));

  console.log('Fotos reales procesadas en public/images/.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
