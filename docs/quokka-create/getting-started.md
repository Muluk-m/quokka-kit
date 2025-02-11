# 快速开始 {#getting-started}

## 前置准备 {#prerequisites}

- [Node.js](https://nodejs.org/) 16 及以上版本。

## 全局安装 {#setup-wizard}

::: code-group

```sh [npm]
npm i -g @nain/quokka-create
```

```sh [pnpm]
pnpm i -g @nain/quokka-create
```

```sh [yarn]
yarn add -g @nain/quokka-create
```

:::

## 使用 {#usage}

::: code-group

```sh [npm]
quokka-create
# or
npx @nain/quokka-create@latest
```

```sh [pnpm]
quokka-create
# or
pnpm dlx @nain/quokka-create@latest
```

```sh [yarn]
quokka-create
# or
yarn dlx @nain/quokka-create@latest
```

:::

<p align="center">
  <img src="/quokka-create-cli.png" width="802">
</p>

## 在 Monorepo 工程中创建一个 package

1. 进入到 packages 目录下

```bash
cd ./packages
```

2. 运行 cli

```bash
npx @nain/quokka-create@latest
```

3. 选择对应的模板

4. 一般情况下, monorepo 的子工程不需要 lint、ci 之类的配置

## 创建一个新工程

1. 进入到指定目录下

```bash
cd ~/<target_dir>
```

2. 运行 cli

```bash
npx @nain/quokka-create@latest
```

3. 选择对应的模板

4. Add linting / CI config / testing 全部选 true

5. 装包

```bash
cd <target_dir>
npm install
```

## 创建一个 Monorepo 工程

1. 进入到指定目录下

```bash
cd ~/<target_dir>
```

2. 运行 cli

```bash
npx @nain/quokka-create@latest
```

3. 选择对应的模板

4. `Create it as monorepo?` 选 true

5. 装包

```bash
cd <target_dir>
pnpm install
```
