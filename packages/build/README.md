# @nain/quokka-build

🚀 Fast package builder, powered by esbuild

## 👀 What can it bundle?

> 对于 vue 文件的打包支持是实验性的

Node.js原生支持的任何内容，即 .js、.json、.mjs。和 TypeScript .ts、.tsx

## ⚙️ Install

```bash
npm i @nain/quokka-build -D
# Or Yarn
yarn add @nain/quokka-build --dev
# Or pnpm
pnpm add @nain/quokka-build -D
```

## 📖 Usage

### Build

```bash
quokka-build [...files]
```

files 为文件入口, 可以指定多个,
不指定默认为 `src/index.ts`

```bash
quokka-build src/index.ts src/cli.ts
```

使用默认配置 Build 完成后你将会得到

```bash
dist
  ├── index.js
  ├── index.mjs
  ├── index.d.mts
  └── index.d.ts
```

如果你需要打包 Vue 组件, 可指定 --vue 参数(实验性)

```bash
quokka-build src/index.ts --vue
```
