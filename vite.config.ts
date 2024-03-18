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
    },
    outDir: 'lib',
    rollupOptions: {
      input: ['src/main.ts', 'src/tailwind.ts'],
      external: ['react', 'react-dom'],
      plugins: [
        typescript({
          declaration: true,
          declarationDir: './lib',
        }),
      ],
      output: [
        { format: 'es', entryFileNames: '[name].mjs' },
        { format: 'cjs', entryFileNames: '[name].js' },
      ],
    },
  },
  test: {
    root: 'src',
    environment: 'jsdom',
  },
})
