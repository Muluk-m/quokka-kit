import path from 'path'
import sass from 'sass'
import type { Options } from 'sass'
import type { Plugin } from 'esbuild'

export default (opts: Options<'sync'>): Plugin => {
  return {
    name: 'sass',
    setup(build) {
      const cssCode = new Map()

      build.onResolve({ filter: /\.scss$/ }, (args) => {
        console.error({ args, scss: true })

        return {
          path: path.resolve(args.resolveDir, args.path),
          pluginData: { resolveDir: args.resolveDir },
          namespace: 'sass',
        }
      })

      build.onLoad({ filter: /\.scss$/, namespace: 'sass' }, ({ path, pluginData }) => {
        console.error({ path, pluginData })
        if (cssCode.has(path)) {
          return {
            contents: cssCode.get(path),
            loader: 'css',
          }
        }

        const compiled = sass.compile(path, opts)
        const contents = compiled.css.toString()

        cssCode.set(path, contents)

        return {
          resolveDir: pluginData.resolveDir,
          contents,
          loader: 'css',
        }
      })
    },
  }
}
