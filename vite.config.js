import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        projects: resolve(__dirname, 'projects.html'),
        404: resolve(__dirname, '404.html'),
      },
    },
  },
  // Ensure assets are correctly referenced
  publicDir: 'public',
});
