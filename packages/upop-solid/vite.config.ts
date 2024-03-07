import path from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [solid(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@upop/core': path.resolve(__dirname, '../upop-core/src'),
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'upop',
      fileName: 'index',
      formats: ['es'],
    },
  },
});
