import * as path from 'path'
import { defineConfig } from 'rspress/config'
import { pluginPlayground } from '@rspress/plugin-playground'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Rspress',
  description: 'Rspack-based Static Site Generator',
  icon: '/rspress-icon.png',
  outDir: '../../public', // relative to root
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  builderConfig: {
    source: {
      alias: {
        '@src': './src',
      },
    },
    output: {
      cleanDistPath: true,
    }
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/web-infra-dev/rspress' },
    ],
  },
  plugins: [
    pluginPlayground({
      defaultDirection: 'vertical',
    }),
  ],
})
