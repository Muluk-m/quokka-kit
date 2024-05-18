import { defineConfig } from '@klook/quokka-build'

export default defineConfig({
  platform: 'node',
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
})
