import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()] as any, // Type conflict between vite versions in vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**', // Exclude E2E tests (Playwright)
      '**/.{idea,git,cache,output,temp}/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'test/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        'src/app/**/layout.tsx', // Layouts are tested via E2E
        'src/app/**/page.tsx', // Pages are tested via E2E
        'src/app/studio/**', // Sanity Studio
        'src/app/**/opengraph-image.tsx', // OG image generation
        '*.config.{ts,js,mjs}',
        'sanity/**',
        'scripts/**',
        '**/index.ts', // Barrel re-export files
        '**/*.module.css', // CSS modules
        'src/lib/utils.ts', // Re-export file
        'src/components/ui/atoms/dialog.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/select.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/tabs.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/input.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/label.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/textarea.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/separator.tsx', // shadcn/ui primitive
        'src/components/ui/atoms/card.tsx', // shadcn/ui primitive
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
