import path from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
  },
  resolve: {
    alias: {
      '@upop/core': path.resolve(__dirname, '../../upop-core/src'),
      '@upop/vue': path.resolve(__dirname, '..', 'src'),
    },
  },
});
