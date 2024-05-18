import { defineConfig } from './src/config'

export default defineConfig(
  [
    {
      dts: false,
      entry: ['src/cli.ts'],
      format: ['cjs'],
    },
    {
      entry: ['src/config.ts', 'src/index.ts'],
    },
  ],
)
