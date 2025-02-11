import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs', 'es'],
      fileName: format => `index.${format === 'es' ? 'm' : ''}js`,
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})
