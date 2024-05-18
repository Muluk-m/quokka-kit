# 快速开始 {#getting-started}

## 前置准备 {#prerequisites}

- [Node.js](https://nodejs.org/) 16 及以上版本。

## 安装 {#setup-wizard}

::: code-group

```sh [npm]
npm i -D @klook/standard
```

```sh [pnpm]
pnpm i -D @klook/standard
```

```sh [yarn]
yarn add -D @klook/standard
```

:::

## eslint.config

```js
// eslint.config.js
import eslint from '@klook/standard'

export default eslint({
  ignores: [
    'dist',
    '**/dist/**',
    'node_modules',
    '**/node_modules/**',
  ],
  formatters: true,
})
```

## stylelint.config

```js
// stylelint.config.mjs
/** @type {import('stylelint').Config} */
export default {
  extends: [
    '@klook/standard/stylelint.config',
  ],
  rules: {},
}
```

## commitlint.config

```json
// package.json
{
  "commitlint": {
    "extends": [
      "@klook/standard/commitlint.config"
    ]
  }
}
```
