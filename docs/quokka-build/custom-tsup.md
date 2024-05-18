# 自定义 tsup 配置

## tsup

Quokka-build 底层使用 tsup 来进行构建, 我们开放了 tsup 的配置能力, 以更好的满足你的各种应用场景

## tsup 配置

tsup 提供丰富的构建配置, Quokka-build 在 tsup 之上做了封装, 如果你想定制 tsup 配置, 可使用配置项 [`tsup`](https://tsup.egoist.dev/#interop-with-commonjs)

```ts
// build.config.ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  tsup: {
    outExtension({ format }) {
      return {
        js: `.${format}.js`,
      }
    },
  }
})
```

## Interop with CommonJS

默认情况下，esbuild会将export default x转换为module.exports.default = x在CommonJS中，但是你可以通过使用--cjsInterop标志来改变这种行为：如果只有默认导出且没有命名导出，它将被转换为module.exports = x。

```ts
// build.config.ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  tsup: {
    cjsInterop: true
  }
})
```

## onSuccess

您可以指定成功构建后要执行的命令，对于 Watch 模式特别有用

```ts
// build.config.ts
import http from 'http'
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  tsup: {
    async onSuccess() {
      const server = http.createServer((req, res) => {
        res.end('Hello World!')
      })
      server.listen(3000)
      return () => {
        server.close()
      }
    },
  }
})
```

## Custom loader

Esbuild loader list:

```ts
type Loader =
  | 'js'
  | 'jsx'
  | 'ts'
  | 'tsx'
  | 'css'
  | 'json'
  | 'text'
  | 'base64'
  | 'file'
  | 'dataurl'
  | 'binary'
  | 'copy'
  | 'default'
```

```ts
// build.config.ts
import { defineConfig } from '@klook/quokka-build/config'

export default defineConfig({
  entry: ['src/index.ts'],
  tsup: {
    loader: {
      '.jpg': 'base64',
      '.webp': 'file',
    },
  }
})
```

## CSS support

esbuild has experimental CSS support, and tsup allows you to use PostCSS plugins on top of native CSS support.

To use PostCSS, you need to install PostCSS:

```bash
npm i postcss -D
```

# Or Yarn

```bash
yarn add postcss --dev
```

..and populate a postcss.config.js in your project

```js
module.exports = {
  plugins: [require('tailwindcss')(), require('autoprefixer')()],
}
```
