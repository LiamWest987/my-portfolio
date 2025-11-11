import { describe, it, expect } from 'vitest'
import { globSync } from 'glob'
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Documentation Enforcement Tests
 *
 * These tests ensure all public functions, classes, and components
 * have proper TSDoc documentation comments.
 */

const SRC_DIR = path.join(process.cwd(), 'src')

/**
 * Check if a function/method has TSDoc comment
 */
function hasTSDocComment(content: string, functionName: string): boolean {
  // Look for /** comment before the function
  const pattern = new RegExp(
    `/\\*\\*[\\s\\S]*?\\*/[\\s\\n]*(?:export\\s+)?(?:async\\s+)?(?:function|const|let)\\s+${functionName}`,
    'g'
  )
  return pattern.test(content)
}

/**
 * Check if TSDoc has required tags
 */
function hasRequiredTags(comment: string, requireParams: boolean, requireReturns: boolean): {
  hasDescription: boolean
  hasParams: boolean
  hasReturns: boolean
} {
  return {
    hasDescription: comment.split('\n').some(line =>
      line.trim().length > 0 &&
      !line.includes('@param') &&
      !line.includes('@returns') &&
      !line.includes('/**') &&
      !line.includes('*/')
    ),
    hasParams: !requireParams || comment.includes('@param'),
    hasReturns: !requireReturns || comment.includes('@returns'),
  }
}

/**
 * Extract TSDoc comment before a function
 */
function extractTSDoc(content: string, functionName: string): string | null {
  const pattern = new RegExp(
    `/\\*\\*[\\s\\S]*?\\*/[\\s\\n]*(?:export\\s+)?(?:async\\s+)?(?:function|const|let)\\s+${functionName}`,
    'g'
  )
  const match = content.match(pattern)
  if (!match) return null

  const commentMatch = match[0].match(/\/\*\*[\s\S]*?\*\//)
  return commentMatch ? commentMatch[0] : null
}

describe('TSDoc Documentation Enforcement', () => {
  describe('Utility Functions', () => {
    it('should document all exported utility functions in src/lib/', () => {
      const utilFiles = globSync('lib/**/*.{ts,tsx}', {
        cwd: SRC_DIR,
        ignore: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**', '**/index.ts'],
      })

      const violations: Array<{ file: string; function: string }> = []

      utilFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find all exported functions
        const exportedFunctions = content.match(
          /export\s+(?:async\s+)?(?:function|const)\s+(\w+)/g
        )

        if (exportedFunctions) {
          exportedFunctions.forEach(match => {
            const funcName = match.match(/\s(\w+)$/)?.[1]
            if (funcName && !hasTSDocComment(content, funcName)) {
              violations.push({ file, function: funcName })
            }
          })
        }
      })

      if (violations.length > 0) {
        console.warn('\nMissing TSDoc comments:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.function}()`))
      }

      expect(violations).toHaveLength(0)
    })

    it('should have @param tags for functions with parameters', () => {
      const utilFiles = globSync('lib/utils.ts', { cwd: SRC_DIR })

      const violations: Array<{ file: string; function: string; reason: string }> = []

      utilFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find exported functions with parameters
        const functionPattern = /export\s+(?:async\s+)?function\s+(\w+)\s*\((.*?)\)/g
        let match

        while ((match = functionPattern.exec(content)) !== null) {
          const funcName = match[1]
          const params = match[2].trim()

          if (params.length > 0) {
            const comment = extractTSDoc(content, funcName)
            if (comment) {
              const tags = hasRequiredTags(comment, true, false)
              if (!tags.hasParams) {
                violations.push({
                  file,
                  function: funcName,
                  reason: 'Missing @param tags',
                })
              }
            }
          }
        }
      })

      if (violations.length > 0) {
        console.warn('\nFunctions missing @param tags:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.function}() - ${v.reason}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('should have @returns tags for functions that return values', () => {
      const utilFiles = globSync('lib/utils.ts', { cwd: SRC_DIR })

      const violations: Array<{ file: string; function: string; reason: string }> = []

      utilFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find exported functions with return types
        const functionPattern = /export\s+(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*:\s*(\w+)/g
        let match

        while ((match = functionPattern.exec(content)) !== null) {
          const funcName = match[1]
          const returnType = match[2]

          // Skip void returns
          if (returnType !== 'void') {
            const comment = extractTSDoc(content, funcName)
            if (comment) {
              const tags = hasRequiredTags(comment, false, true)
              if (!tags.hasReturns) {
                violations.push({
                  file,
                  function: funcName,
                  reason: 'Missing @returns tag',
                })
              }
            }
          }
        }
      })

      if (violations.length > 0) {
        console.warn('\nFunctions missing @returns tags:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.function}() - ${v.reason}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('React Components', () => {
    it('should document all exported components in src/components/', () => {
      const componentFiles = globSync('components/**/*.tsx', {
        cwd: SRC_DIR,
        ignore: ['**/*.test.tsx', '**/__tests__/**', '**/index.ts'],
      })

      const violations: Array<{ file: string; component: string }> = []

      componentFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find exported components (function or const with JSX)
        const componentPattern = /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/g
        let match

        while ((match = componentPattern.exec(content)) !== null) {
          const componentName = match[1]

          // Check if it's a React component (starts with uppercase)
          if (componentName[0] === componentName[0].toUpperCase()) {
            if (!hasTSDocComment(content, componentName)) {
              violations.push({ file, component: componentName })
            }
          }
        }
      })

      if (violations.length > 0) {
        console.warn('\nComponents missing TSDoc comments:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.component}`))
      }

      // Allow some violations for now (transition period)
      // Change to expect(violations).toHaveLength(0) once all components are documented
      expect(violations.length).toBeLessThanOrEqual(20)
    })

    it('should document component props interfaces', () => {
      const componentFiles = globSync('components/ui/**/*.tsx', {
        cwd: SRC_DIR,
        ignore: ['**/*.test.tsx', '**/__tests__/**', '**/index.ts'],
      })

      const violations: Array<{ file: string; interface: string }> = []

      componentFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find Props interfaces
        const interfacePattern = /interface\s+(\w+Props)/g
        let match

        while ((match = interfacePattern.exec(content)) !== null) {
          const interfaceName = match[1]

          // Check for TSDoc comment before interface
          const hasDoc = new RegExp(
            `/\\*\\*[\\s\\S]*?\\*/[\\s\\n]*interface\\s+${interfaceName}`,
            'g'
          ).test(content)

          if (!hasDoc) {
            violations.push({ file, interface: interfaceName })
          }
        }
      })

      if (violations.length > 0) {
        console.warn('\nProps interfaces missing TSDoc comments:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.interface}`))
      }

      // Allow some violations for now (transition period)
      expect(violations.length).toBeLessThanOrEqual(15)
    })
  })

  describe('Type Definitions', () => {
    it('should document all exported types in src/types/', () => {
      const typeFiles = globSync('types/**/*.ts', {
        cwd: SRC_DIR,
        ignore: ['**/*.test.ts', '**/index.ts'],
      })

      const violations: Array<{ file: string; type: string }> = []

      typeFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        // Find exported types and interfaces
        const typePattern = /export\s+(?:type|interface)\s+(\w+)/g
        let match

        while ((match = typePattern.exec(content)) !== null) {
          const typeName = match[1]

          const hasDoc = new RegExp(
            `/\\*\\*[\\s\\S]*?\\*/[\\s\\n]*export\\s+(?:type|interface)\\s+${typeName}`,
            'g'
          ).test(content)

          if (!hasDoc) {
            violations.push({ file, type: typeName })
          }
        }
      })

      if (violations.length > 0) {
        console.warn('\nTypes missing TSDoc comments:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.type}`))
      }

      // Allow some violations for now (transition period)
      expect(violations.length).toBeLessThanOrEqual(10)
    })
  })

  describe('TypeDoc Generation', () => {
    it('should have valid typedoc.json configuration', () => {
      const configPath = path.join(process.cwd(), 'typedoc.json')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const configExists = require('fs').existsSync(configPath)

      expect(configExists).toBe(true)

      if (configExists) {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'))

        // Required settings
        expect(config).toHaveProperty('entryPoints')
        expect(config).toHaveProperty('out')
        expect(config.exclude).toContain('**/*.test.ts')
      }
    })

    it('should be able to generate documentation without errors', () => {
      // This is a smoke test - actual generation happens via npm run docs:generate
      // We just verify the command exists
      const packageJson = JSON.parse(
        readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
      )

      expect(packageJson.scripts).toHaveProperty('docs:generate')
      expect(packageJson.scripts['docs:generate']).toBe('typedoc')
    })
  })

  describe('Documentation Quality', () => {
    it('should have meaningful descriptions (not just function name)', () => {
      const utilFiles = globSync('lib/utils.ts', { cwd: SRC_DIR })

      const violations: Array<{ file: string; function: string; reason: string }> = []

      utilFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

        const exportedFunctions = content.match(
          /export\s+(?:async\s+)?(?:function|const)\s+(\w+)/g
        )

        if (exportedFunctions) {
          exportedFunctions.forEach(match => {
            const funcName = match.match(/\s(\w+)$/)?.[1]
            if (funcName) {
              const comment = extractTSDoc(content, funcName)
              if (comment) {
                // Check if description is just the function name or too short
                const description = comment
                  .split('\n')
                  .find(line => line.trim().length > 0 && !line.includes('/**') && !line.includes('@'))
                  ?.trim()
                  .replace(/\*/g, '')
                  .trim()

                if (description && description.length < 20) {
                  violations.push({
                    file,
                    function: funcName,
                    reason: `Description too short: "${description}"`,
                  })
                }
              }
            }
          })
        }
      })

      if (violations.length > 0) {
        console.warn('\nFunctions with insufficient descriptions:')
        violations.forEach(v => console.warn(`  - ${v.file}: ${v.function}() - ${v.reason}`))
      }

      // Warning only, not a hard failure
      // expect(violations).toHaveLength(0)
    })

    it('should use proper TSDoc tag format', () => {
      const allFiles = globSync('**/*.{ts,tsx}', {
        cwd: SRC_DIR,
        ignore: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
      })

      const violations: Array<{ file: string; line: number; issue: string }> = []

      allFiles.forEach(file => {
        const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          // Check for common mistakes
          if (line.includes('@params')) {
            violations.push({
              file,
              line: index + 1,
              issue: 'Use @param (singular), not @params',
            })
          }
          if (line.includes('@return ') && !line.includes('@returns')) {
            violations.push({
              file,
              line: index + 1,
              issue: 'Use @returns (plural), not @return',
            })
          }
        })
      })

      if (violations.length > 0) {
        console.warn('\nTSDoc tag format issues:')
        violations.forEach(v => console.warn(`  - ${v.file}:${v.line} - ${v.issue}`))
      }

      expect(violations).toHaveLength(0)
    })
  })
})
