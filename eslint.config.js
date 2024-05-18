import eslint from '@klook/quokka-standard'

export default eslint({
  ignores: [
    'dist',
    '**/dist/**',
    'node_modules',
    '**/node_modules/**',
  ],
  formatters: true,
})
