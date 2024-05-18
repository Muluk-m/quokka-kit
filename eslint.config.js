import eslint from '@klook/standard'

export default eslint({
  ignores: [
    'dist',
    '**/dist/**',
    'node_modules',
    '**/node_modules/**',
  ],
  formatters: true,
})
