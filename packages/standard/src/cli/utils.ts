import { execSync } from 'node:child_process'

export function isGitClean() {
  try {
    execSync('git diff-index --quiet HEAD --')
    return true
  }
  catch {
    return false
  }
}

export function getEslintConfigContent(
  mainConfig: string,
  additionalConfigs?: string[],
) {
  return `
import eslint from '@nain/quokka-standard'

export default eslint({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart()
}

export function getStylelintConfigContent() {
  return `
/** @type {import('stylelint').Config} */
export default {
  extends: [
    '@nain/quokka-standard/stylelint.config',
  ],
  rules: {},
}
`.trimStart()
}
