# 关于文档站点部署方案

文档站方案使用了 gitlab 的静态站点托管功能

## 配置 `gitlab-ci`

静态网站打包的产物应该输出在 root 目录下, 以 `public` 命名, 并且需要以下 ci 配置

:::tip
在使用 CLI 创建模板工程时, `Add CI config?` 选项为 Yes 时, 会自动引入以下配置
:::

```yaml
stages:
  - deploy

variables:
  PNPM_VERSION: 8

cache:
  paths:
    - ~/.pnpm-store

before_script:
  - curl -f https://get.pnpm.io/v6.js | node - add --global pnpm@$PNPM_VERSION

# 开启 gitlab 静态站点部署
pages:
  image: registry.klook.io/node/node:16
  stage: deploy
  only:
    - master
  tags:
    - docker
  script:
    - pnpm install -no-frozen-lockfile
    - rm -rf public
    - pnpm run docs:build
  allow_failure: true
  artifacts:
    paths:
      # 部署产物路径 root/public
      - public
```

## 最佳实践

在 Monorepo 工程中比较好的实践方式为, 文档目录只会有一个, 一般在 Project 的根目录下

### 目录结构

目标的目录结构

```bash
.
├─ docs/*
├─ packages
│  └─ project1
└─ package.json
```

而我们的 CLI 工具生成带 Docs 的模板项目结构是这样:

```bash
.
├─ packages
│  ├─ project1
│  │    ├─ docs/*
│  │    ├─ src/*
│  │    └─ package.json
└─ package.json
```

那么此时如果需要改造, 那么应该对目录结构做手动调整

### Docs 目录提升

1. 将 project 下的 docs 目录移到根目录

2. 调整 Docs 的构建配置的 `outDir` 指向到根目录下的 `public` 目录
   例如: `rspress.config.ts`
   ```ts
   export default defineConfig({
     outDir: 'public'
   })
   ```

## Playground 组件如何编写

### rspress

一般 rspress 项目的 Docs 目录结构如下

```bash
.
├── src
│   ├── components
│   │   ├── demo
│   │   │    ├── a.tsx
│   │   │    ├── b.tsx
│   │   ├── a.mdx
│   ├── public
│   ├── index.md
```

- 按照约定, 文档站的 demo 组件应该全部放在 `components/demo/*` 目录下
- 当我们需要在 `md` 中引入 “Demo 块” 时, 应该将 `md` 文件名改为 `mdx`
- 在 `mdx` 中, 使用 `<code src="./demo/Input.tsx" />` 语法引入 Demo 块
