import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./vitest.config.ts",
  "./packages/create/template-vue-components/vite.config.ts",
  "./packages/create/template/test/vitest.config.ts",
  "./packages/create/template-vue-components-docs/vite.config.ts"
])
