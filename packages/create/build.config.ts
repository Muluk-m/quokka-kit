import { defineConfig } from '@klook/quokka-build'

export default defineConfig({
  platform: 'node',
  entry: ['index.ts'],
  format: ['cjs'],
  tsup: {
    onSuccess: 'mv dist/index.cjs outfile.cjs',
  },
  dts: false,
})
