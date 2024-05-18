import { defineConfig } from '@klook/quokka-build'

export default defineConfig({
  platform: 'node',
  entry: ['index.ts'],
  format: ['cjs'],
  dts: false,
})
