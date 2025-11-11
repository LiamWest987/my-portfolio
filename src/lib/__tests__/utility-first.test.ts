/**
 * Utility-First Enforcement Tests
 *
 * These tests enforce Tailwind CSS utility-first principles by:
 * 1. Detecting CSS module imports (should be minimal/justified)
 * 2. Checking for inline style usage (should be avoided)
 * 3. Verifying CVA usage for variant components
 * 4. Ensuring proper Tailwind class usage patterns
 */

import { describe, it, expect } from 'vitest'
import { globSync } from 'glob'
import fs from 'fs'
import path from 'path'

const SRC_DIR = path.join(process.cwd(), 'src')

// Allowlist for justified CSS modules
const ALLOWED_CSS_MODULES = [
  'BackgroundAnimation.module.css', // Complex @keyframes animations
  'not-found.module.css', // Simple 404 page (low priority)
]

// Files that are allowed to import CSS modules (e.g., the components using them)
const ALLOWED_CSS_MODULE_IMPORTS = [
  'BackgroundAnimation.tsx',
  'not-found.tsx',
]

describe('Utility-First Enforcement', () => {
  describe('CSS Modules', () => {
    it('should only have justified CSS module files', () => {
      const cssModules = globSync('**/*.module.css', { cwd: SRC_DIR })

      const unjustifiedModules = cssModules.filter(
        file => !ALLOWED_CSS_MODULES.some(allowed => file.includes(allowed))
      )

      expect(
        unjustifiedModules,
        `Found unjustified CSS modules:\n${unjustifiedModules.join('\n')}\n\nPlease convert these to Tailwind utilities or add them to ALLOWED_CSS_MODULES if justified.`
      ).toHaveLength(0)
    })

    it('should not import CSS modules in component files (except allowlist)', () => {
      const tsxFiles = globSync('**/*.{tsx,ts}', {
        cwd: SRC_DIR,
        ignore: ['**/__tests__/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}']
      })

      const violations: Array<{ file: string; line: number; import: string }> = []

      tsxFiles.forEach(file => {
        const filePath = path.join(SRC_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for CSS module imports (e.g., import styles from './Component.module.css')
          if (line.match(/import\s+.*from\s+['"].*\.module\.css['"]/)) {
            const isAllowed = ALLOWED_CSS_MODULE_IMPORTS.some(allowed => file.includes(allowed))
            if (!isAllowed) {
              violations.push({
                file,
                line: index + 1,
                import: line.trim()
              })
            }
          }
        })
      })

      if (violations.length > 0) {
        const message = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.import}`)
          .join('\n\n')

        expect(violations,
          `Found CSS module imports that should be converted to Tailwind:\n\n${message}\n\nConvert these components to use Tailwind utilities instead.`
        ).toHaveLength(0)
      }
    })
  })

  describe('Inline Styles', () => {
    it('should not use inline style attributes (except for dynamic values)', () => {
      const tsxFiles = globSync('**/*.tsx', {
        cwd: SRC_DIR,
        ignore: [
          '**/__tests__/**',
          '**/*.test.tsx',
          '**/*.spec.tsx',
          '**/opengraph-image.tsx' // OG images require inline styles for Vercel OG
        ]
      })

      const violations: Array<{ file: string; line: number; usage: string }> = []

      tsxFiles.forEach(file => {
        const filePath = path.join(SRC_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for style={{ ... }} with static values (red flag)
          // Allow style={{ transform: `...` }} for dynamic styles
          const styleMatch = line.match(/style=\{\{([^}]+)\}\}/)
          if (styleMatch) {
            const styleContent = styleMatch[1]

            // Skip if it's clearly dynamic (has variables, template literals with expressions)
            const isDynamic =
              styleContent.includes('${') || // Template literal with expression
              styleContent.match(/:\s*[a-zA-Z_][a-zA-Z0-9_]*[,\s]/) || // Variable reference
              styleContent.includes('props.') ||
              styleContent.includes('state.')

            if (!isDynamic) {
              violations.push({
                file,
                line: index + 1,
                usage: line.trim()
              })
            }
          }
        })
      })

      if (violations.length > 0) {
        const message = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.usage}`)
          .join('\n\n')

        expect(violations,
          `Found inline styles that should be Tailwind utilities:\n\n${message}\n\nReplace inline styles with Tailwind utility classes.`
        ).toHaveLength(0)
      }
    })
  })

  describe('CVA Pattern', () => {
    it('should use CVA for components with multiple variants', () => {
      // Components that should use CVA pattern
      const variantComponents = ['Badge', 'Button']

      variantComponents.forEach(componentName => {
        const atomPath = path.join(SRC_DIR, `components/ui/atoms/${componentName.toLowerCase()}.tsx`)

        if (fs.existsSync(atomPath)) {
          const content = fs.readFileSync(atomPath, 'utf-8')

          expect(
            content.includes("from 'class-variance-authority'") ||
            content.includes('from "class-variance-authority"'),
            `${componentName} should use CVA for variant management`
          ).toBe(true)

          expect(
            content.includes('cva('),
            `${componentName} should use cva() function for defining variants`
          ).toBe(true)

          expect(
            content.includes('VariantProps'),
            `${componentName} should use VariantProps for TypeScript types`
          ).toBe(true)
        }
      })
    })
  })

  describe('Tailwind Class Patterns', () => {
    it('should use cn() utility for conditional classes instead of string interpolation', () => {
      const tsxFiles = globSync('**/*.tsx', {
        cwd: SRC_DIR,
        ignore: ['**/__tests__/**']
      })

      const violations: Array<{ file: string; line: number; usage: string }> = []

      tsxFiles.forEach(file => {
        const filePath = path.join(SRC_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for className with string interpolation instead of cn()
          // Pattern: className={`... ${condition ? 'class' : ''} ...`}
          if (
            line.includes('className=') &&
            line.includes('${') &&
            !line.includes('cn(') &&
            (line.includes('?') || line.includes('&&'))
          ) {
            violations.push({
              file,
              line: index + 1,
              usage: line.trim()
            })
          }
        })
      })

      if (violations.length > 0) {
        const message = violations
          .slice(0, 10) // Show first 10 violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.usage}`)
          .join('\n\n')

        // This is a warning, not an error, as string interpolation is sometimes acceptable
        console.warn(
          `\n⚠️  Found className with string interpolation that could use cn():\n\n${message}\n\n` +
          `Consider using cn() utility for better class merging.\n` +
          (violations.length > 10 ? `\n(Showing 10 of ${violations.length} violations)\n` : '')
        )
      }
    })

    it('should use Tailwind utilities instead of custom CSS classes', () => {
      const tsxFiles = globSync('**/*.tsx', {
        cwd: SRC_DIR,
        ignore: ['**/__tests__/**', '**/*.test.tsx']
      })

      // Custom class patterns that indicate non-Tailwind classes
      const customClassPatterns = [
        /className=["'][a-zA-Z][a-zA-Z0-9]*-[a-zA-Z][a-zA-Z0-9]*["']/, // kebab-case (not Tailwind)
        /className=["'][A-Z][a-zA-Z]*["']/, // PascalCase
      ]

      const violations: Array<{ file: string; line: number; usage: string }> = []

      tsxFiles.forEach(file => {
        const filePath = path.join(SRC_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          customClassPatterns.forEach(pattern => {
            if (pattern.test(line)) {
              // Skip if it's using cn() or clsx() (likely combining Tailwind classes)
              if (!line.includes('cn(') && !line.includes('clsx(')) {
                violations.push({
                  file,
                  line: index + 1,
                  usage: line.trim()
                })
              }
            }
          })
        })
      })

      if (violations.length > 0) {
        const message = violations
          .slice(0, 5) // Show first 5 violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.usage}`)
          .join('\n\n')

        // Warning only, as some custom classes might be intentional
        console.warn(
          `\n⚠️  Found potential custom CSS classes:\n\n${message}\n\n` +
          `Verify these are Tailwind utilities, not custom classes.\n` +
          (violations.length > 5 ? `\n(Showing 5 of ${violations.length} violations)\n` : '')
        )
      }
    })
  })

  describe('Design System Integration', () => {
    it('should use design tokens for colors instead of arbitrary values', () => {
      const tsxFiles = globSync('**/*.tsx', {
        cwd: SRC_DIR,
        ignore: ['**/__tests__/**']
      })

      const violations: Array<{ file: string; line: number; usage: string }> = []

      tsxFiles.forEach(file => {
        const filePath = path.join(SRC_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for arbitrary color values: bg-[#hex] or text-[rgb(...)]
          if (line.match(/(?:bg|text|border)-\[(?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)\(/)) {
            violations.push({
              file,
              line: index + 1,
              usage: line.trim()
            })
          }
        })
      })

      if (violations.length > 0) {
        const message = violations
          .map(v => `  ${v.file}:${v.line}\n    ${v.usage}`)
          .join('\n\n')

        expect(violations,
          `Found arbitrary color values that should use design tokens:\n\n${message}\n\n` +
          `Use design tokens like bg-primary, text-foreground, border-accent instead.`
        ).toHaveLength(0)
      }
    })
  })
})
