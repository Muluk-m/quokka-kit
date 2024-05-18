import path from 'node:path'
import { loadConfig } from 'unconfig'
import type { Format } from 'tsup'
import defu from 'defu'
import type { BuildOptions } from '../config'
import { configFileName } from '../constants'

export type BuildOptionsResolved = Required<BuildOptions> & {
  tsup: { entry: string[], format?: Format[] }
  format: Format[]
}

export function normalizeConfig(
  pkgDir: string,
  options?: BuildOptions,
): BuildOptionsResolved {
  const normalized = {
    minify: false,
    vue: false,
    dts: true,
    platform: 'node',
    tsup: {},
    ...(options ?? {}),
  } as BuildOptionsResolved
  normalized.entry ||= [path.resolve(pkgDir, 'src/index.ts')]
  normalized.format ||= ['esm', 'cjs']
  return normalized
}

function applyDefaults(...args: any[]): any {
  // defu does not support top-level array merging, we wrap it with an object and unwrap it
  // @ts-expect-error cast
  return defu(...args.map((i: any) => ({ config: i }))).config
}

export async function importConfig(
  pkgDir: string,
  userConfig: BuildOptions = {},
) {
  const configFile = userConfig.config === true || userConfig.config === undefined ? configFileName : userConfig.config

  const config = configFile === false
    ? userConfig
    : (await loadConfig<BuildOptions | BuildOptions[]>({
        sources: [
          {
            files: configFile,
          },
        ],
        cwd: pkgDir,
      })).config

  const configs = Array.isArray(config) ? config : [config]

  return configs.map(i => applyDefaults(i, userConfig))
}
