# stylelint

## Install

安装 `@klook/quokka-standard`

```bash
pnpm i -D @klook/quokka-standard
```

安装 stylelint 依赖

```json
{
  "stylelint": "^16.2.1",
  "stylelint-config-css-modules": "^4.4.0",
  "stylelint-config-standard": "^36.0.0",
  "stylelint-declaration-block-no-ignored-properties": "^2.8.0",
  "stylelint-prettier": "^5.0.0",
  "stylelint-scss": "^6.2.1"
}
```

## Usage

创建配置文件 `stylelint.config.mjs` 在你的根目录下

```ts
/** @type {import('stylelint').Config} */
export default {
  extends: [
    '@klook/standard/stylelint.config',
  ],
  rules: {},
}
```
