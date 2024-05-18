import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'
import type { DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Klook Quokka',
  base: '/klook-infra-tools',
  description: 'Klook FE Infra tools',
  outDir: '../public',
  vite: {
    plugins: [SearchPlugin()],
  },
  srcDir: '.',
  head: [
    ['link', { rel: 'icon', type: 'image/ico', href: '/klook-infra-tools/favicon.ico' }],
  ],
  themeConfig: {
    logo: 'https://cdn.klook.com/s/dist_web/favicons/favicon-32x32.png',

    nav: nav(),

    sidebar: {
      'quokka-build/': { base: '/quokka-build/', items: sidebarGuide() },
      'standard': { base: '/standard/', items: sidebarStandard() },
    },

    socialLinks: [
      { icon: 'github', link: 'https://git.klook.io/web-infra/klook-infra-tools' },
    ],

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Build',
      link: '/quokka-build/what-is-quokka-build',
      activeMatch: '/quokka-build/',
    },
    {
      text: 'Standard',
      link: '/standard/what-is-standard',
      activeMatch: '/standard/',
    },
    {
      text: 'version',
      items: [
        {
          text: '更新日志',
          link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md',
        },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 Quokka-build？', link: 'what-is-quokka-build' },
        { text: '快速开始', link: 'getting-started' },
      ],
    },
    {
      text: '基础使用',
      collapsed: false,
      items: [
        { text: '命令行工具', link: 'cli' },
        { text: '构建配置', link: 'config-file' },
      ],
    },
    {
      text: '进阶拓展',
      collapsed: false,
      items: [
        { text: '拓展 tsup', link: 'custom-tsup' },
        { text: '拓展 esbuild', link: 'custom-esbuild' },
      ],
    },
    { text: '配置和 API 参考', link: 'reference' },
  ]
}

function sidebarStandard(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 Quokka-standard？', link: 'what-is-standard' },
        { text: '快速开始', link: 'getting-started' },
      ],
    },
    {
      text: 'Lint 配置',
      collapsed: false,
      items: [
        { text: 'eslint', link: 'eslint' },
        { text: 'stylelint', link: 'stylelint' },
        { text: 'commitlint', link: 'commitlint' },
      ],
    },
    {
      text: '其他',
      collapsed: false,
      items: [
        { text: 'Cli', link: 'cli' },
        { text: 'package.json 配置', link: 'package-json' },
      ],
    },
  ]
}
