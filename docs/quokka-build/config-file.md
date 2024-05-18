# 构建配置

## entry

- Type: `string` | `string[]`
- Default: `'src/index.ts'`

打包入口

```ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
})
```

## format

- Type: `'esm','cjs','iife'` | `string[]`
- Default: `['esm','cjs']`

输出格式

```ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  format: ['esm', 'cjs'],
})
```

## minify

- Type: `boolean | 'both'`
- Default: `false`

1. 当值为 true 时, 你会得到一个压缩后的文件
2. 当值为 false 时, 你会得到两个文件

```bash
├─ dist
│ ├─ index.js
│ └─ index.min.js
```

## vue

- Type: `boolean` | [`VuePluginOptions`](./reference)
- Default: `false`

当值为 `true` 时, 等同于

```ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  vue: {
    extractCss: true,
    // 如果你有使用 @klook/ui, 默认会添加以下配置
    style: {
      preprocessOptions: {
        scss: {
          data: `@import "./node_modules/@klook/klook-ui/src/styles/token/index.scss";`,
        },
      }
    }
  }
})
```

## scss

- Type: `boolean` | `Sass.Options`
- Default: `false`

开启 scss loader, 如果你需要处理 .scss 文件

## dts

- Type: `boolean` | `tsup.DtsConfig`
- Default: `true`

开启 .d.ts 文件输出

## outDir

- Type: `string`
- Default: `'dist'`

输出目录

如果你需要在应用工程中实时调试包, 可以尝试指定输出目录

```ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'your-project/node_modules/@klook/your-pkg-name/dist'
})
```

## platform

- Type: `'web'` | `'node'`
- Default: `'node'`

1. 值为 `node` 输出产物会转译到 `node16`
2. 值为 `web` 输出产物会转译到 `es2019`

## config

- Type: `string`

配置文件的路径, 默认会从当前包的目录开始往上查找 `.build.config.ts` 文件

也支持以下文件格式

1. `.build.config.js`
2. `.build.config.json`

## define

- Type: `Object`

类似 webpack definePlugin

参考 [esbuild Documentation](https://esbuild.github.io/api/#define)

```ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  define: {
    'process.env.APP_ENV': 'prod'
  }
})
```

## alias

- Type: `Record<string, string>`

路径别名

参考 [esbuild Documentation](https://esbuild.github.io/api/#alias)

## tsup

- Type: `tsup.Config`

支持手动拓展 tsup 参数

参考 [tsup Documentation](https://tsup.egoist.dev/#interop-with-commonjs)
