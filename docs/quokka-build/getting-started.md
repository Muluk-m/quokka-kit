# 快速开始 {#getting-started}

## 前置准备 {#prerequisites}

- [Node.js](https://nodejs.org/) 16 及以上版本。

## 安装 {#setup-wizard}

::: code-group

```sh [npm]
npm i -D @nain/quokka-build
```

```sh [pnpm]
pnpm i -D @nain/quokka-build
```

```sh [yarn]
yarn add -D @nain/quokka-build
```

:::

## 基础使用

```shell
quokka-build
```

也可以指定多入口

```shell
quokka-build src/index.ts src/cli.ts
```

如果你需要打包 vue 产物

```shell
quokka-build src/index.ts --vue
```

Dev 模式

```shell
quokka-build --watch
```

如果你需要在应用工程中实时调试包, 可以尝试指定输出目录

```shell
quokka-build --watch -d <.../node_modules/@nain/your-pkg-name/dist>
```

## package.json 配置

需要在你的 package.json 中指定输出文件的 path

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts"
}
```

可以将构建命令配置到你的 scripts 中

```json
{
  "scripts": {
    "dev": "quokka-build ./src/index.ts --watch",
    "build": "quokka-build ./src/index.ts"
  }
}
```

## 输出结构 {#file-structure}

:::tip
默认默认情况下输出目录为 `dist`, format 为 `esm` + `cjs`

你也可以通过手动配置更改 `outDir` 与 `format`
:::

```md
.
├─ dist
│ ├─ index.js
│ ├─ index.mjs
│ ├─ index.d.mts
│ └─ index.d.ts
└─
```

:::tip
默认默认情况下输出目录为 `dist`, format 为 `esm` + `cjs`

你也可以通过手动配置更改 `outDir` 与 `format`
:::

## 使用自定义配置

配置文件 (`build.config.ts`) 让你能够自定义打包策略

单条配置

```ts
import { defineConfig } from '@nain/quokka-build/config'

export default defineConfig({
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
})
```

或多条配置

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

有关所有配置选项的完整详细信息，请参见[配置参考](./reference)。
