以下是完整配置

````ts
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
````
