import eslint from '@nain/quokka-standard'

export default eslint({
  ignores: [
    'dist',
    '**/dist/**',
    'node_modules',
    '**/node_modules/**',
    'packages/create/template-*/**/*',
    'packages/create/template/**/*',
  ],
  formatters: true,
})
