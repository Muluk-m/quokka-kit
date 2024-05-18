import { defineConfig } from './src/config'

export default defineConfig(
  [
    {
      platform: 'node',
      dts: false,
      entry: ['src/cli.ts'],
      format: ['esm'],
    },
    {
      platform: 'node',
      dts: true,
      entry: ['src/config.ts', 'src/index.ts'],
      format: ['esm', 'cjs'],
    },
  ],
)
