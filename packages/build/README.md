# @eomts/build

🚀 The package offer build for eomts!

## Build

Use tsup to build and this package don't have `devDependencies`. See [ts-up#excluding-packages](https://tsup.egoist.dev/#excluding-packages)

## Usage

```typescript
// build.config.ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  dts: false,
  vue: true,
  format: ['cjs','esm'],
})
```

```bash
quokka-build src/index.ts
```
