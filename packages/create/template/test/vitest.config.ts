import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: true,
    __FEATURE_PROD_DEVTOOLS__: true,
  },
  test: {
    globals: true,
  },
})
