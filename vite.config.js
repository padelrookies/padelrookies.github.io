import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        carta: resolve(import.meta.dirname, 'carta.html'),
        esencia: resolve(import.meta.dirname, 'esencia.html'),
        servicios: resolve(import.meta.dirname, 'servicios.html'),
      },
    },
  },
});
