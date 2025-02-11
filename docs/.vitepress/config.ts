import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'
import type { DefaultTheme } from 'vitepress'
import type { PluginOption } from 'vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Quokka kit',
  description: 'FE tools',
  outDir: '../public',
  vite: {
    plugins: [SearchPlugin() as PluginOption],
  },
  srcDir: '.',
  head: [
    ['link', { rel: 'icon', type: 'image/ico', href: '/quokka-kit/favicon.ico' }],
  ],
  themeConfig: {
    logo: 'https://avatars.githubusercontent.com/u/69963532?v=4',

    nav: nav(),

    sidebar: {
      'quokka-build/': { base: '/quokka-build/', items: sidebarGuide() },
      'quokka-standard': { base: '/quokka-standard/', items: sidebarStandard() },
      'quokka-create': { base: '/quokka-create/', items: sidebarCreate() },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Muluk-M/quokka-kit' },
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
      link: '/quokka-standard/what-is-standard',
      activeMatch: '/quokka-standard/',
    },
    {
      text: 'Create',
      link: '/quokka-create/what-is-quokka-create',
      activeMatch: '/quokka-create/',
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

function sidebarCreate(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 Quokka-create？', link: 'what-is-quokka-create' },
        { text: '快速开始', link: 'getting-started' },
      ],
    },
    {
      text: '其他',
      collapsed: false,
      items: [
        { text: '关于 CI', link: 'ci' },
        { text: '关于 Docs', link: 'docs' },
      ],
    },
  ]
}
