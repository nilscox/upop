import path from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@upop/core': path.resolve(__dirname, '../../upop-core/src'),
      '@upop/solid': path.resolve(__dirname, '../src'),
    },
  },
});
