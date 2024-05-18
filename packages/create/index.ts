#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import spawn from 'cross-spawn'
import minimist from 'minimist'
import prompts from 'prompts'
import {
  blue,
  cyan,
  green,
  lightBlue,
  lightGreen,
  lightRed,
  magenta,
  red,
  reset,
  yellow,
} from 'kolorist'

import renderTemplate from './utils/renderTemplate'
import * as banners from './utils/banners'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })
const cwd = process.cwd()

type ColorFunc = (str: string | number) => string
interface Framework {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}
interface FrameworkVariant {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}

const FRAMEWORKS: Framework[] = [
  {
    name: 'typescript',
    display: 'Typescript',
    color: yellow,
    variants: [
      {
        name: 'typescript',
        display: 'Typescript',
        color: lightBlue,
      },
      {
        name: 'typescript-docs',
        display: 'TypeScript Docs',
        color: yellow,
      },
    ],
  },
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue-components',
        display: 'Vue Components',
        color: blue,
      },
      {
        name: 'vue-components-docs',
        display: 'Vue Components + Docs',
        color: magenta,
      },
      {
        name: 'vue',
        display: 'Vue App ↗',
        color: lightGreen,
        customCommand: 'npx @klook/kiwi-cli TARGET_DIR',
      },
    ],
  },
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react-components',
        display: 'React Components',
        color: blue,
      },
      {
        name: 'react-components-docs',
        display: 'React Components + Docs',
        color: yellow,
      },
      {
        name: 'react',
        display: 'React App ↗',
        color: lightRed,
        customCommand: 'npx @klook/react-admin-cli create TARGET_DIR',
      },
    ],
  },
]

const TEMPLATES = FRAMEWORKS.map(
  f => (f.variants && f.variants.map(v => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), [])

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

const defaultTargetDir = 'quokka-project'

const MONOREPO_FILE = ['pnpm-workspace.yaml', 'lerna.json']
function isMonorepo(root: string) {
  const pkgPath = path.join(root, 'package.json')

  const pkgExist = fs.existsSync(pkgPath)
  return (
    pkgExist
    && (MONOREPO_FILE.some((file) => {
      return fs.existsSync(path.join(root, file))
    })
    )
  )
}

const isProjectInMonorepo = function (): boolean {
  return isMonorepo(cwd) || isMonorepo(path.resolve(cwd, '..'))
}

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner,
  )
  console.log()

  const argTargetDir = formatTargetDir(argv._[0])
  const argTemplate = argv.template || argv.t

  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<
    | 'projectName'
    | 'overwrite'
    | 'packageName'
    | 'framework'
    | 'variant'
    | 'monorepo'
    | 'needsLint'
    | 'needsCi'
    | 'needsTest'
  >

  prompts.override({
    overwrite: argv.overwrite,
  })

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'select',
          name: 'overwrite',
          message: () =>
            `${targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`
            } is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            {
              title: 'Remove existing files and continue',
              value: 'yes',
            },
            {
              title: 'Cancel operation',
              value: 'no',
            },
            {
              title: 'Ignore files and continue',
              value: 'ignore',
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === 'no')
              throw new Error(`${red('✖')} Operation cancelled`)

            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
          name: 'framework',
          message:
            typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
              ? reset(
                `"${argTemplate}" isn't a valid template. Please choose from below: `,
              )
              : reset('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            }
          }),
        },
        {
          type: (framework: Framework) =>
            framework && framework.variants ? 'select' : null,
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              }
            }),
        },
        {
          name: 'monorepo',
          type: () => isProjectInMonorepo() ? null : 'toggle',
          message: reset('Create it as monorepo?'),
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsLint',
          type: (_, { monorepo }) => monorepo ? null : 'toggle',
          message: reset('Add linting?'),
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsCi',
          type: (_, { monorepo }) => monorepo ? null : 'toggle',
          message: reset('Add CI config?'),
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsTest',
          type: (_, { monorepo }) => monorepo ? null : 'toggle',
          message: reset('Add testing?'),
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} Operation cancelled`)
        },
      },
    )
  }
  catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const { framework, overwrite, packageName, variant, monorepo } = result

  const needsLint = argv.lint || monorepo || result.needsLint
  const needsCi = argv.ci || monorepo || result.needsCi
  const needsTest = argv.test || !monorepo || result.needsTest

  const root = path.join(cwd, targetDir)

  if (overwrite === 'yes')
    emptyDir(root)
  else if (!fs.existsSync(root))
    fs.mkdirSync(root, { recursive: true })

  const template: string = variant || framework?.name || argTemplate

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

  const { customCommand }
    = FRAMEWORKS.flatMap(f => f.variants).find(v => v.name === template) ?? {}

  if (customCommand) {
    const fullCustomCommand = customCommand
      .replace(/^npm create /, () => {
        // `bun create` uses it's own set of templates,
        // the closest alternative is using `bun x` directly on the package
        if (pkgManager === 'bun')
          return 'bun x create-'

        return `${pkgManager} create `
      })
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
        if (pkgManager === 'pnpm')
          return 'pnpm dlx'

        if (pkgManager === 'yarn' && !isYarn1)
          return 'yarn dlx'

        if (pkgManager === 'bun')
          return 'bun x'

        // Use `npm exec` in all other cases,
        // including Yarn 1.x and other custom npm clients.
        return 'npm exec'
      })

    const [command, ...args] = fullCustomCommand.split(' ')
    // we replace TARGET_DIR here because targetDir may include a space
    const replacedArgs = args.map(arg => arg.replace('TARGET_DIR', targetDir))
    const { status } = spawn.sync(command, replacedArgs, {
      stdio: 'inherit',
    })
    process.exit(status ?? 0)
  }

  const templateRoot = path.resolve(__dirname, 'template')
  const callbacks: ((dataSource: Record<string, any>) => Promise<void>)[] = []
  const render = function render(templateName: string) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root, callbacks)
  }
  // Render base template
  render('base')

  // Add configs.
  if (needsLint)
    render('lint')

  if (needsCi)
    render('ci')

  if (needsTest)
    render('test')

  const dataStore = {}

  for (const cb of callbacks)
    await cb(dataStore)

  if (monorepo) {
    const packageDir = path.resolve(root, 'packages', targetDir)

    render('monorepo')

    renderTemplate(
      path.resolve(__dirname, `template-${template}`),
      packageDir,
      callbacks,
    )

    renderTemplate(
      path.resolve(templateRoot, 'base'),
      packageDir,
      callbacks,
    )
  }
  else {
    // Render template files.
    renderTemplate(
      path.resolve(__dirname, `template-${template}`),
      monorepo ? path.resolve(root, 'packages', targetDir) : root,
      callbacks,
    )
  }

  console.log(`\nScaffolding project in ${root}...`)

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content)
      fs.writeFileSync(targetPath, content)
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, `package.json`), 'utf-8'),
  )

  pkg.name = packageName || getProjectName()

  write(
    monorepo
      ? path.join('packages', targetDir, 'package.json')
      : 'package.json',
    `${JSON.stringify(pkg, null, 2)}\n`,
  )

  const cdProjectName = path.relative(cwd, root)
  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(
      `  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir))
    return

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git')
      continue

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent)
    return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

init().catch((e) => {
  console.error(e)
})
