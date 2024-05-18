import { build } from '../src'

// describe('vue', () => {
// })

build({
  platform: 'web',
  entry: ['fixtures/input/src/index.ts'],
  vue: {
    extractCss: true,
    data: {
      scss: '@import "../../../../node_modules/@klook/klook-ui/lib/styles/index.scss";',
    },
  },
  dts: false,
  scss: true,
  format: ['cjs', 'esm'],
  outDir: 'fixtures/output',
  config: false,
})
