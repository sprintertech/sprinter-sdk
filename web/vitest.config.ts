import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})
