import fs from 'node:fs'
import fsp from 'node:fs/promises'
import process from 'node:process'
import path from 'node:path'
import c from 'picocolors'
import * as p from '@clack/prompts'

import type { PromtResult } from '../types'
import { getStylelintConfigContent } from '../utils'

export async function updateStylelintFiles(result: PromtResult) {
  if (!result.stylelint)
    return

  const cwd = process.cwd()
  const configFileName = 'stylelint.config.mjs'
  const pathFlatConfig = path.join(cwd, configFileName)
  const stylelintConfigContent: string = getStylelintConfigContent()

  await fsp.writeFile(pathFlatConfig, stylelintConfigContent)
  p.log.success(c.green(`Created ${configFileName}`))

  const files = fs.readdirSync(cwd)
  const legacyConfig: string[] = []
  files.forEach((file) => {
    if (/\.stylelintrc/.test(file) && !/stylelint\.config\./.test(file))
      legacyConfig.push(file)
  })

  if (legacyConfig.length)
    p.note(`${c.dim(legacyConfig.join(', '))}`, 'You can now remove those files manually')
}
