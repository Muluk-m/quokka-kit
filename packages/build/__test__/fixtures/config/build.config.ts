import { defineConfig } from '../../../src/config'

export default defineConfig(
  [
    {
      dts: false,
      entry: ['src/index.ts'],
      format: ['cjs'],
    },
    {
      entry: ['src/config.ts'],
    },
  ],
)
