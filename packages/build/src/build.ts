import process from 'node:process'
import { build as tsup } from 'tsup'
import type { Options } from 'tsup'
import vue2 from './plugins/esbuild-vue'
import scss from './plugins/esbuild-scss'
import { builderName, targetNode, targetWeb } from './constants'
import type { BuildOptionsResolved } from './utils'
import { importConfig } from './utils'
import type { BuildOptions } from './config'

export async function build(userConfig: BuildOptions = {}) {
  const pkgDir = process.cwd()

  const configs = await importConfig(pkgDir, userConfig)

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
        scss(typeof config.scss !== 'object'
          ? {}
          : config.scss),
      )
    }

    if (config.dts)
      options.dts = true

    if (config.entry)
      options.entry = config.entry

    if (config.format)
      options.format = config.format

    const tasks: Array<Promise<void>> = []
    if (config.minify === false || config.minify === 'both') {
      tasks.push(
        tsup({
          ...options,
          esbuildOptions(options) {
            options.entryNames = `[dir]/[name]`
          },
        }),
      )
    }
    if (config.minify === true || config.minify === 'both') {
      tasks.push(
        tsup({
          ...options,
          name: 'klook',
          minify: true,
          esbuildOptions(options) {
            options.entryNames = `[dir]/[name].min`
          },
        }),
      )
    }

    await Promise.all(tasks)
  }

  await Promise.all(configs.map(buildItem))
}
