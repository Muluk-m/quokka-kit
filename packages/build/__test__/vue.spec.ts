import { build } from '../src'

// describe('vue', () => {
// })

build({
  platform: 'node',
  entry: ['fixtures/input'],
  vue: {
    extractCss: true,
  },
  dts: false,
  scss: true,
  // format: ['cjs', 'esm'],
  outDir: 'fixtures/output',
  config: false,
})
