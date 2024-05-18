import type { Options } from 'tsup'
import type { BuildOptions as EsbuildOptions } from 'esbuild'
import type { VuePluginOptions } from './plugins/esbuild-vue'

export interface BuildOptions {
  // name?: string
  minify?: boolean | 'both'
  vue?: boolean | VuePluginOptions
  scss?: boolean | import('sass').Options<'sync'>
  dts?: Options['dts']
  outDir?: string
  platform?: 'web' | 'node'
  config?: boolean | string
  /** Documentation: https://esbuild.github.io/api/#define */
  define?: EsbuildOptions['define']
  /** Documentation: https://esbuild.github.io/api/#alias */
  alias?: Record<string, string>
  entry?: Options['entry']
  format?: Options['format']
  tsup?: Omit<Options, 'dts' | 'tsconfig' | 'platform' | 'entry' | 'format' | 'outDir' | 'config'>
}

export const defineConfig = (
  options:
    | BuildOptions
    | BuildOptions[]
    | ((
      /** The options derived from CLI flags */
      overrideOptions: BuildOptions
    ) => BuildOptions | BuildOptions[]),
) => options
