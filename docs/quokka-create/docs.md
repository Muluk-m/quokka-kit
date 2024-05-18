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
      - public
```
