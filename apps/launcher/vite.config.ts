import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    plugins: [
      react(),
      ...(isDev
        ? [
            electron([
              {
                entry: 'src/main/index.ts',
                vite: { build: { outDir: 'dist/main', sourcemap: true } },
              },
              {
                entry: 'src/main/preload.ts',
                vite: { build: { outDir: 'dist/main', sourcemap: true } },
                onstart(options: { reload(): void }) {
                  options.reload()
                },
              },
            ]),
            renderer(),
          ]
        : [renderer()]),
    ],
    root: 'src/renderer',
    build: {
      outDir: '../../dist/renderer',
      emptyOutDir: true,
    },
  }
})
