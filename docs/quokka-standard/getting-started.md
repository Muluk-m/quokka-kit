# 快速开始 {#getting-started}

## 前置准备 {#prerequisites}

- [Node.js](https://nodejs.org/) 16 及以上版本。

## 安装 {#setup-wizard}

::: code-group

```sh [npm]
npm i -D @nain/quokka-standard
```

```sh [pnpm]
pnpm i -D @nain/quokka-standard
```

```sh [yarn]
yarn add -D @nain/quokka-standard
```

:::

## eslint.config

```js
// eslint.config.js
import eslint from '@nain/quokka-standard'

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
    '@nain/quokka-standard/stylelint.config',
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
      "@nain/quokka-standard/commitlint.config"
    ]
  }
}
```
