import path from 'node:path'
import fsp from 'node:fs/promises'
import process from 'node:process'
import c from 'picocolors'
import * as p from '@clack/prompts'

import { dependenciesMap, pkgJson, stylelintDependencies } from '../constants'
import type { ExtraLibrariesOption, PromtResult } from '../types'

export async function updatePackageJson(result: PromtResult) {
  const cwd = process.cwd()

  const pathPackageJSON = path.join(cwd, 'package.json')

  p.log.step(c.cyan(`Bumping @nain/quokka-standard to v${pkgJson.version}`))

  const pkgContent = await fsp.readFile(pathPackageJSON, 'utf-8')
  const pkg: Record<string, any> = JSON.parse(pkgContent)

  pkg.devDependencies ??= {}
  pkg.devDependencies['@nain/quokka-standard'] = `^${pkgJson.version}`
  pkg.devDependencies.eslint = pkgJson.devDependencies.eslint
    .replace('npm:eslint-ts-patch@', '')
    .replace(/-\d+$/, '')

  const addedPackages: string[] = []

  if (result.extra.length) {
    result.extra.forEach((item: ExtraLibrariesOption) => {
      switch (item) {
        case 'formatter':
          (<const>[
            'eslint-plugin-format',
          ]).forEach((f) => {
            if (!f)
              return
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          })
          break
        case 'unocss':
          (<const>[
            '@unocss/eslint-plugin',
          ]).forEach((f) => {
            pkg.devDependencies[f] = pkgJson.devDependencies[f]
            addedPackages.push(f)
          })
          break
      }
    })
  }

  if (result.stylelint) {
    const isLess = Object.keys(pkg.devDependencies).includes('less')
    const isScss = Object.keys(pkg.devDependencies).includes('scss')
    const additionalConfig: (keyof typeof pkgJson.devDependencies)[] = []

    stylelintDependencies.forEach((f) => {
      pkg.devDependencies[f] = pkgJson.devDependencies[f]
      addedPackages.push(f)
    })

    if (isLess)
      additionalConfig.push('postcss-less')

    if (isScss)
      additionalConfig.push('postcss-scss')

    additionalConfig.forEach((f) => {
      pkg.devDependencies[f] = pkgJson.devDependencies[f]
      addedPackages.push(f)
    })
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework]
    if (deps) {
      deps.forEach((f) => {
        pkg.devDependencies[f] = pkgJson.devDependencies[f]
        addedPackages.push(f)
      })
    }
  }

  if (addedPackages.length)
    p.note(`${c.dim(addedPackages.join(', '))}`, 'Added packages')

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2))
  p.log.success(c.green(`Changes wrote to package.json`))
}
