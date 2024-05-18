import { defineConfig } from '@klook/quokka-build'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
})
