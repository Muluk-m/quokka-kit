---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Klook Quokka"
  text: "FE Infra tools"
  tagline: 专注前端工程解决方案
  image:
    src: /logo.png
    alt: Quokka
  actions:
    - theme: brand
      text: Quick start
      link: /quokka-build/getting-started
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - icon: 🧱
    title: Build
    details: 基于 esbuild 的 0 配置打包器, 专注打包 js 模块, 支持 esm、iife、cjs 格式输出
  - icon: ⚙️
    title: Standard
    details: 研发规范配置集, 包含 eslint.config、stylelint.config、commitlint.config
  - icon: ⚒️
    title: Create
    details: 现代化的前端工程创建 cli 工具
---
