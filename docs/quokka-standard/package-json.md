# package.json 配置

## 关于 lint 相关的 `package.json` 配置

```json
{
  "name": "your-package-name",
  "packageManager": "pnpm@8.15.5",
  "engines": {
    "node": ">=16"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@klook/quokka-standard": "^0.0.11"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
    "commit-msg": "pnpm quokka-standard commitlint"
  },
  "lint-staged": {
    "*": "eslint --fix"
  },
  "commitlint": {
    "extends": [
      "@klook/quokka-standard/commitlint.config"
    ]
  }
}
```
