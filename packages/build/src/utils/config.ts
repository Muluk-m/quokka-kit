import path from 'node:path'
import { loadConfig } from 'unconfig'
import type { Format } from 'tsup'
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
    platform: 'web',
    tsup: {},
    ...(options ?? {}),
  } as BuildOptionsResolved
  normalized.tsup.entry ||= [path.resolve(pkgDir, 'src/index.ts')]
  normalized.tsup.format ||= ['esm', 'cjs']
  return normalized
}

export async function importConfig(
  pkgDir: string,
  userConfig: BuildOptions = {},
): Promise<BuildOptionsResolved[]> {
  const configFile = userConfig.config === true || userConfig.config === undefined ? configFileName : userConfig.config

  const config = configFile === false
    ? {}
    : (await loadConfig<BuildOptions | BuildOptions[]>({
        sources: [
          {
            files: configFile,
          },
        ],
        cwd: pkgDir,
        defaults: [],
      })).config

  const configs = Array.isArray(config) ? config : [config]

  return configs.map(config => normalizeConfig(pkgDir, { ...config, ...userConfig }))
}
