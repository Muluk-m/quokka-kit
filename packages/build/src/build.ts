import process from 'node:process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { build as tsup } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'
import type { Options } from 'tsup'
import type { BuildOptions as EsbuildOptions } from 'esbuild'

import { builderName, targetNode, targetWeb } from './constants'
import type { BuildOptionsResolved } from './utils'
import { importConfig, normalizeConfig } from './utils'
import type { BuildOptions } from './config'
import type { VuePluginOptions } from './plugins/esbuild-vue'

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
    const vue2 = (await import('./plugins/esbuild-vue')).default
    const klkTokenPath = './node_modules/@nain/ui/src/styles/token/index.scss'
    const defaultOptions: VuePluginOptions = {
      extractCss: true,
    }

    if (existsSync(path.resolve(klkTokenPath))) {
      defaultOptions.style = {
        preprocessOptions: {
          scss: {
            data: `@import "${klkTokenPath}";`,
          },
        },
      }
    }

    options.esbuildPlugins.push(
      vue2(typeof config.vue === 'object'
        ? config.vue
        : defaultOptions,
      ),
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
        name: 'quokka',
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

  const normalizedConfig = configs.map(config => normalizeConfig(pkgDir, config))

  await Promise.all(normalizedConfig.map(buildItem))
}
