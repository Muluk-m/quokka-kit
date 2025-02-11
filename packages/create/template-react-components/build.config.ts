import { defineConfig } from '@nain/quokka-build'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
})
