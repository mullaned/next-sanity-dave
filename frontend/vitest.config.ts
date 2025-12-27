import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/*.stories.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/node_modules/**',
        '**/.next/**',
        '**/app/api/**',
        '**/app/[slug]/**',
        '**/app/posts/**',
        '**/app/layout.tsx',
        '**/app/page.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
    },
  },
})
