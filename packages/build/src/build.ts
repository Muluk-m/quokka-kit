import process from 'node:process'
import { build as tsup } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'
import defu from 'defu'
import type { Options } from 'tsup'
import type { BuildOptions as EsbuildOptions } from 'esbuild'
import vue2 from './plugins/esbuild-vue'
import { builderName, targetNode, targetWeb } from './constants'
import type { BuildOptionsResolved } from './utils'
import { importConfig, normalizeConfig } from './utils'
import type { BuildOptions } from './config'

function modifyEsbuildOptions(options: EsbuildOptions, config: BuildOptions): Options['esbuildOptions'] {
  return (_options) => {
    if (config.define)
      _options.define = config.define

    if (config.alias)
      _options.alias = config.alias

    for (const [key, val] of Object.entries(options))
      _options[key] = val
  }
}

const buildItem = async (config: BuildOptionsResolved) => {
  const options: Options = {
    outDir: config.outDir || 'dist',
    name: builderName,
    clean: true,
    target: config.platform === 'web' ? targetWeb : targetNode,
    format: config.format,
    shims: true,
    config: false,
    treeshake: true,
    platform: config.platform === 'web' ? 'browser' : 'node',
    ...config.tsup,
  }

  options.esbuildPlugins ||= []

  if (config.vue) {
    options.esbuildPlugins.push(
      vue2(typeof config.vue !== 'object'
        ? {
            extractCss: true,
          }
        : config.vue),
    )
  }

  if (config.scss) {
    options.esbuildPlugins.push(
      sassPlugin(typeof config.scss !== 'object'
        ? {}
        : config.scss),
    )
  }

  if (config.dts)
    options.dts = config.dts

  if (config.entry)
    options.entry = config.entry

  if (config.format)
    options.format = config.format

  const tasks: Array<Promise<void>> = []

  if (config.minify === false || config.minify === 'both') {
    tasks.push(
      tsup({
        ...options,
        esbuildOptions: modifyEsbuildOptions({
          entryNames: `[dir]/[name]`,
        }, config),
      }),
    )
  }

  if (config.minify === true || config.minify === 'both') {
    tasks.push(
      tsup({
        ...options,
        name: 'klook',
        minify: true,
        esbuildOptions: modifyEsbuildOptions({
          entryNames: `[dir]/[name].min`,
        }, config),
      }),
    )
  }

  await Promise.all(tasks)
}

export async function build(userConfig: BuildOptions = {}) {
  const pkgDir = process.cwd()

  const configs = await importConfig(pkgDir, userConfig)

  const normalizedConfig = configs.map(config => normalizeConfig(pkgDir, defu(config, userConfig)))

  await Promise.all(normalizedConfig.map(buildItem))
}
