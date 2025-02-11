import eslint from './src'

export default eslint(
  {
    vue: true,
    react: true,
    typescript: true,
    ignorePatterns: [
      'fixtures',
      '_fixtures',
    ],
    formatters: true,
  },
)
