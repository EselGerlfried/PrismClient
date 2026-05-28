import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  const root = __dirname

  return {
    plugins: [
      react(),
      ...(isDev
        ? [
            electron([
              {
                entry: resolve(root, 'src/main/index.ts'),
                vite: { build: { outDir: resolve(root, 'dist/main'), sourcemap: true } },
              },
              {
                entry: resolve(root, 'src/main/preload.ts'),
                vite: { build: { outDir: resolve(root, 'dist/main'), sourcemap: true } },
                onstart(options: { reload(): void }) {
                  options.reload()
                },
              },
            ]),
            renderer(),
          ]
        : [renderer()]),
    ],
    build: {
      outDir: resolve(root, 'dist/renderer'),
      emptyOutDir: true,
    },
  }
})
