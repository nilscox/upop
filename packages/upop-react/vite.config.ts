import path from 'node:path';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
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
      external: ['@upop/core', 'react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['src/vitest.setup.ts'],
  },
});

function alias() {
  if (process.env.NODE_ENV === 'development') {
    return {
      '@upop/core': path.resolve(__dirname, '../upop-core/src'),
    };
  }
}
