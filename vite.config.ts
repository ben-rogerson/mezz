import { defineConfig } from 'vitest/config'
import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: 'src/main.ts',
      name: 'mezz',
      fileName: 'main',
      formats: ['es', 'cjs'],
    },
    outDir: 'lib',
    rollupOptions: {
      external: ['react', 'react-dom'],
      plugins: [
        typescript({
          declaration: true,
          declarationDir: './lib',
        }),
      ],
    },
  },
  test: {
    root: 'src',
    environment: 'jsdom',
  },
})
