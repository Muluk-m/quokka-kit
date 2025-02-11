# 常用配置参考

## 完整配置

以下是完整配置的类型

```ts
export interface BuildOptions {
  // name?: string
  minify?: boolean | 'both'
  vue?: boolean | VuePluginOptions
  scss?: boolean | import('sass').Options<'sync' | 'async'>
  dts?: Options['dts']
  outDir?: string
  platform?: 'web' | 'node'
  config?: boolean | string
  /** Documentation: https://esbuild.github.io/api/#define */
  define?: EsbuildOptions['define']
  /** Documentation: https://esbuild.github.io/api/#alias */
  alias?: Record<string, string>
  entry?: Options['entry']
  format?: Options['format']
  tsup?: Omit<Options, 'dts' | 'tsconfig' | 'platform' | 'entry' | 'format' | 'outDir' | 'config'>
}
```

## 多入口配置

```ts
import { defineConfig } from '@nain/quokka-build/config'

export default defineConfig(
  [
    {
      dts: false,
      entry: ['src/cli.ts'],
      format: ['cjs'],
    },
    {
      entry: ['src/config.ts', 'src/index.ts'],
    },
  ],
)
```
