import { defineConfig } from '@nain/quokka-build/config'

export default defineConfig([
  {
    entry: [
      'src/index.ts',
    ],
  },
  {
    entry: [
      'src/cli.ts',
    ],
    format: 'esm',
    dts: false,
  },
  {
    entry: [
      'assets/*',
    ],
    format: 'cjs',
    dts: false,
  },
])
