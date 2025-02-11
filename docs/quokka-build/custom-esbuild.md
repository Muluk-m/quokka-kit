# 拓展 esbuild 插件与参数

使用 `tsup.esbuildPlugins` 和 `tsup.esbuildOptions` 在 `build.config.ts`:

```ts
// build.config.ts
import { defineConfig } from '@nain/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  tsup: {
    esbuildPlugins: [YourPlugin],
    esbuildOptions(options, context) {
      options.define.foo = '"bar"'
    },
  }
})
```

The `context` argument for `esbuildOptions`:

- `context.format`: `cjs`, `esm`, `iife`

See all options [here](https://esbuild.github.io/api/#build-api), and [how to write an esbuild plugin](https://esbuild.github.io/plugins/#using-plugins).
