# Quokka-build 是什么？

- 一个 0 配置的 JS Module 打包器, 专注 npm 包开发场景中配置复杂的问题
- 在 [tsup](https://tsup.egoist.dev/#what-can-it-bundle) 之上进行拓展, 底层使用 esbuild
- 支持 cjs、mjs、iife 与类型定义文件 .d.ts 输出

## 使用场景

- **打包 ts、tsx、js**

  Quokka-build 底层使用 [esbuild](https://esbuild.github.io/) 处理 ts、tsx 的转译, 使用 [swc](https://swc.rs/) 做语法降级 (类似 babel), 所以打包速度比较快

- **打包 vue**

  > 目前暂不支持 vue-decorator 的语法

  由于我们业务工程中, 使用的 vue 版本比较旧 (小于 2.7), 并且 `esbuild` 生态中对于低版本 `.vue` 文件的处理工具支持不够完善, 所以我们自己实现了 `esbuild-vue-plugin`, 但是对 `.vue` 文件打包的支持是实验性的, 需要充分验证

- **处理 scss**

  我们的业务场景中, 对 `scss` 的应用的使用比较普遍, 所以内置了处理 `.scss` 文件的 loader, 只需启用 `quokka-build --scss` 参数即可

## 工作流程

Quokka-build 基于 [tsup](https://tsup.egoist.dev/#what-can-it-bundle) 进行封装, `tsup` 工作流程分几个阶段

1. 使用 esbuild 进行文件初期处理, esbuild 很快, 但是他一些其他能力比较弱, 比如 es 降级
2. 我们有些场景需要将代码编译为 `es5`, 在此过程中, 首先使由 esbuild 转译为 `es2020`, 然后由 SWC 转译为 `es5`
3. 同时 esbuild 不会做类型检查, 如果需要类型定义文件的输出, 可以开启 `--dts` 参数, 这将会运行一个 TypeScript compiler, 进行类型检查和类型定义文件的输出
