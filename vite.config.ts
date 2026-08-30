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
      // Allow local hot reload unless explicitly disabled for a developer environment.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching only when local tooling intentionally turns it off.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
