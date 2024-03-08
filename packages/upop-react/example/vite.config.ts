import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
  },
  resolve: {
    alias: {
      '@upop/core': path.resolve(__dirname, '../../upop-core/src'),
      '@upop/react': path.resolve(__dirname, '..', 'src'),
    },
  },
});
