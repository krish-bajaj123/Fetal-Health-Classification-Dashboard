import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/predict': {
          target: 'https://capml.augi.ca',
          changeOrigin: true,
          secure: false,
          rewrite: () => '/api/hosted-models/18d776f2b2a9c69a126494dd67c08b83/predict',
        },
      },
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/predict': {
          target: 'https://capml.augi.ca',
          changeOrigin: true,
          secure: false,
          rewrite: () => '/api/hosted-models/18d776f2b2a9c69a126494dd67c08b83/predict',
        },
      },
    },
  };
});
