import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'

import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

/**
 * Renders a template folder/file to the file system,
 * by recursively copying all files under the `src` directory,
 * with the following exception:
 *   - `_filename` should be renamed to `.filename`
 *   - Fields in `package.json` should be recursively merged
 * @param {string} src source filename to copy
 * @param {string} dest destination filename of the copy operation
 */
function renderTemplate(src, dest, callbacks) {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    // skip node_module
    if (path.basename(src) === 'node_modules')
      return

    // if it's a directory, render its subdirectories and files recursively
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src))
      renderTemplate(path.resolve(src, file), path.resolve(dest, file), callbacks)

    return
  }

  const filename = path.basename(src)

  if (filename === 'package.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const pkg = sortDependencies(deepMerge(newPackage, existing))
    fs.writeFileSync(dest, `${JSON.stringify(pkg, null, 2)}\n`)
    return
  }

  if (filename === 'tsconfig.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newTsconfig = JSON.parse(fs.readFileSync(src, 'utf8'))
    const tsconfig = deepMerge(existing, newTsconfig)
    fs.writeFileSync(dest, `${JSON.stringify(tsconfig, null, 2)}\n`)
    return
  }

  if (filename === 'extensions.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newExtensions = JSON.parse(fs.readFileSync(src, 'utf8'))
    const extensions = deepMerge(existing, newExtensions)
    fs.writeFileSync(dest, `${JSON.stringify(extensions, null, 2)}\n`)
    return
  }

  if (filename === 'settings.json' && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newSettings = JSON.parse(fs.readFileSync(src, 'utf8'))
    const settings = deepMerge(existing, newSettings)
    fs.writeFileSync(dest, `${JSON.stringify(settings, null, 2)}\n`)
    return
  }

  if (filename === '_gitignore') {
    // rename `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }

  if (filename.startsWith('_eslint')) {
    // rename `_file` to `file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_(\w+)/, '$1'))
  }

  if (filename === '_gitignore' && fs.existsSync(dest)) {
    // append to existing .gitignore
    const existing = fs.readFileSync(dest, 'utf8')
    const newGitignore = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, `${existing}\n${newGitignore}`)
    return
  }

  // data file for EJS templates
  if (filename.endsWith('.data.mjs')) {
    // use dest path as key for the data store
    dest = dest.replace(/\.data\.mjs$/, '')

    // Add a callback to the array for late usage when template files are being processed
    callbacks.push(async (dataStore) => {
      const getData = (await import(pathToFileURL(src).toString())).default

      // Though current `getData` are all sync, we still retain the possibility of async
      dataStore[dest] = await getData({
        oldData: dataStore[dest] || {},
      })
    })

    return // skip copying the data file
  }

  fs.copyFileSync(src, dest)
}

export default renderTemplate
