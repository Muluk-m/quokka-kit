import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { importConfig } from '../src'

const fixtureDir = resolve(__dirname, 'fixtures')

it('config', async () => {
  const cwd = resolve(fixtureDir, 'config')
  const result = await importConfig(cwd, {
    dts: false,
    vue: true,
    alias: {
      '@': './src',
    },
  })

  expect(result)
    .toMatchSnapshot()
})
