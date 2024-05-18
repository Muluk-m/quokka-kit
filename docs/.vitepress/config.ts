import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'
import type { DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Klook Quokka',
  description: 'Klook FE Infra tools',
  outDir: '../public',
  vite: {
    plugins: [SearchPlugin()],
  },
  srcDir: '.',
  head: [
    ['link', { rel: 'icon', type: 'image/ico', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: 'https://cdn.klook.com/s/dist_web/favicons/favicon-32x32.png',

    nav: nav(),

    sidebar: {
      build: { base: '/quokka-build/', items: sidebarGuide() },
      standard: { base: '/standard/', items: sidebarStandard() },
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
      link: '/build/what-is-quokka-build',
      activeMatch: '/build/',
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
        {
          text: '参与贡献',
          link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md',
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
        { text: '拓展 esbuild', link: 'use-esbuild-plugin' },
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
        { text: '什么是 VitePress？', link: 'what-is-vitepress' },
        { text: '快速开始', link: 'getting-started' },
        { text: '路由', link: 'routing' },
        { text: '部署', link: 'deploy' },
      ],
    },
    {
      text: '写作',
      collapsed: false,
      items: [
        { text: 'Markdown 扩展', link: 'markdown' },
        { text: '资源处理', link: 'asset-handling' },
        { text: 'frontmatter', link: 'frontmatter' },
        { text: '在 Markdown 使用 Vue', link: 'using-vue' },
        { text: '国际化', link: 'i18n' },
      ],
    },
    {
      text: '自定义',
      collapsed: false,
      items: [
        { text: '自定义主题', link: 'custom-theme' },
        { text: '扩展默认主题', link: 'extending-default-theme' },
        { text: '构建时数据加载', link: 'data-loading' },
        { text: 'SSR 兼容性', link: 'ssr-compat' },
        { text: '连接 CMS', link: 'cms' },
      ],
    },
    {
      text: '实验性功能',
      collapsed: false,
      items: [
        { text: 'MPA 模式', link: 'mpa-mode' },
        { text: 'sitemap 生成', link: 'sitemap-generation' },
      ],
    },
    { text: '配置和 API 参考', base: '/zh/reference/', link: 'site-config' },
  ]
}
