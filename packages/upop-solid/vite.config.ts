import path from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [solid(), dts({ rollupTypes: true })],
  resolve: {
    alias: alias(),
  },
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'upop',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['@upop/core', 'solid-js', 'solid-js/store'],
    },
  },
});

function alias() {
  if (process.env.NODE_ENV === 'development') {
    return {
      '@upop/core': path.resolve(__dirname, '../upop-core/src'),
    };
  }
}
