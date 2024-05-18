import { dirname, relative, resolve } from 'path'
import fs from 'fs'
import process from 'node:process'
import { basename } from 'node:path'
import MagicString from 'magic-string'
import hash from 'hash-sum'

import type { Loader, Plugin } from 'esbuild'
import type {
  ScriptOptions,
  StyleOptions,
  TemplateOptions,
} from '@vue/component-compiler'

import type {
  VueTemplateCompiler,
  VueTemplateCompilerParseOptions,
} from '@vue/component-compiler-utils/dist/types'

import transform from './transform'

const EXTRACT_CSS_NAMESPACE = 'esbuild-vue-css'
const EXTRACT_CSS_SUFFIX = `?${EXTRACT_CSS_NAMESPACE}`
const EXTRACT_CSS_REGEXP = new RegExp(`\\${(EXTRACT_CSS_SUFFIX)}$`)

export interface VuePluginOptionsData {
  css: string | (() => string)
  less: string | (() => string)
  postcss: string | (() => string)
  sass: string | (() => string)
  scss: string | (() => string)
  stylus: string | (() => string)
}

export interface VuePluginOptions {
  /**
   * Default language for blocks.
   *
   * @default `{}`
   * @example
   * ```js
   * VuePlugin({ defaultLang: { script: 'ts' } })
   * ```
   */
  defaultLang?: {
    [key: string]: string
  }

  /**
   * Prepend CSS.
   * @default `undefined`
   * @example
   * ```js
   * VuePlugin({ data: { scss: '$color: red;' } }) // to extract css
   * ```
   */
  data?: Partial<VuePluginOptionsData>

  /**
   * Inject CSS in JavaScript.
   * @default `false`
   * @example
   * ```js
   * VuePlugin({ extractCss: false }) // to extract css
   * ```
   */
  extractCss?: boolean
  compiler?: VueTemplateCompiler
  compilerParseOptions?: VueTemplateCompilerParseOptions
  sourceRoot?: string
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) script processing options.
   */
  script?: ScriptOptions
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) style processing options.
   */
  style?: StyleOptions
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) template processing options.
   */
  template?: TemplateOptions
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) module name or global function for custom runtime component normalizer.
   */
  normalizer?: string
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) module name or global function for custom style injector factory.
   */
  styleInjector?: string
  /**
   * @@vue/component-compiler [#](https://github.com/vuejs/vue-component-compiler#api) module name or global function for custom style injector factory for SSR environment.
   */
  styleInjectorSSR?: string

  styleInjectorShadow?: string

  isWebComponent?: boolean
}

export default function (opts: VuePluginOptions): Plugin {
  const shouldExtractCss = opts.extractCss === true
  const data: VuePluginOptionsData = (opts.data || {}) as any

  const isProduction = opts.template && typeof opts.template.isProduction === 'boolean'
    ? opts.template.isProduction
    : process.env.NODE_ENV === 'production'
    || process.env.BUILD === 'production'

  function prependStyle(
    id: string,
    lang: string,
    code: string,
  ): { code: string } {
    if (!(lang in data))
      return { code }
    const ms = new MagicString(code, {
      filename: id,
      indentExclusionRanges: [],
    })

    const value: string | (() => string) = (data as any)[lang]
    const fn = typeof value === 'function' ? value : () => value

    ms.prepend(fn())

    return { code: ms.toString() }
  }

  delete opts.data
  delete opts.extractCss
  delete opts.defaultLang

  opts.template = {
    transformAssetUrls: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href',
    },
    ...opts.template,
  } as TemplateOptions

  return {
    name: 'vue',
    setup(build) {
      const cssCode = new Map()

      build.onLoad({ filter: /[^/]\.vue$/ }, async ({ path }) => {
        const filename = relative(process.cwd(), path)
        const source = await fs.promises.readFile(path, 'utf8')
        const scopeId = `data-v-${isProduction
          ? hash(basename(filename) + source)
          : hash(filename + source)}`

        let { code, styles, errors, loader } = await transform({
          filename,
          source,
          extractCss: shouldExtractCss,
          compilerOptions: opts,
          scopeId,
          prependStyle,
        })

        if (shouldExtractCss && styles && styles.length) {
          const cssPath = filename + EXTRACT_CSS_SUFFIX
          cssCode.set(
            cssPath,
            styles.reduce((str, { code }) => str + code, ''),
          )
          code += `\nimport ${JSON.stringify(cssPath)};`
        }

        if (errors && errors.length)
          return { errors }

        return { contents: code, loader: loader as Loader }
      })

      if (shouldExtractCss) {
        build.onResolve({ filter: EXTRACT_CSS_REGEXP }, ({ path }) => {
          return { path, namespace: EXTRACT_CSS_NAMESPACE }
        })

        build.onLoad(
          { filter: EXTRACT_CSS_REGEXP, namespace: EXTRACT_CSS_NAMESPACE },
          ({ path }) => {
            const css = cssCode.get(path)
            if (!css)
              return null

            return { contents: css, loader: 'css', resolveDir: dirname(path) }
          },
        )
      }
    },
  }
}
