import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * CSS Variable Validation Tests
 *
 * Ensures that all CSS color variables use the oklch() function wrapper.
 * This prevents color rendering issues with OKLCH format variables.
 */

// Color CSS variables that require oklch() wrapper
const COLOR_VARS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
]

// Non-color variables that should NOT use oklch()
const NON_COLOR_VARS = [
  'radius',
  'spacing',
  'font',
  'shadow',
  'elevation',
  'transition',
  'z-',
  'container',
  'chart',
]

/**
 * Recursively find all CSS files in a directory
 */
function findCssFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      findCssFiles(filePath, fileList)
    } else if (file.endsWith('.css') || file.endsWith('.module.css')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

describe('CSS Variables', () => {
  const projectRoot = join(process.cwd())
  const cssFiles = findCssFiles(join(projectRoot, 'src'))

  it('should find CSS files to test', () => {
    expect(cssFiles.length).toBeGreaterThan(0)
  })

  cssFiles.forEach(filePath => {
    describe(filePath.replace(projectRoot, ''), () => {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      it('should wrap color variables with oklch()', () => {
        const errors: string[] = []

        lines.forEach((line, index) => {
          // Skip comments and variable definitions
          if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) {
            return
          }
          if (line.includes(':root') || line.includes('.light') || line.includes('.dark')) {
            return
          }

          // Check for color variables used without oklch()
          COLOR_VARS.forEach(colorVar => {
            // Match patterns like: color: var(--primary) or background: var(--accent)
            const pattern = new RegExp(
              `(color|background|border-color|fill|stroke)\\s*:\\s*var\\(--${colorVar}\\)(?!\\))`,
              'i'
            )

            if (pattern.test(line)) {
              // Ensure it's not already wrapped with oklch
              if (!line.includes(`oklch(var(--${colorVar}))`)) {
                errors.push(
                  `Line ${index + 1}: var(--${colorVar}) should be wrapped with oklch()\n  ${line.trim()}`
                )
              }
            }
          })

          // Check for invalid variable names (e.g., --primary-light)
          const invalidVarMatch = line.match(/var\(--([\w-]+)\)/)
          if (invalidVarMatch) {
            const varName = invalidVarMatch[1]

            // Check if it's a known color variable with a suffix (like --primary-light)
            const baseColorVar = COLOR_VARS.find(cv => varName.startsWith(cv))
            if (baseColorVar && varName !== baseColorVar && !varName.endsWith('-foreground')) {
              // Check if this might be an undefined variable
              const isDefinedNonColor = NON_COLOR_VARS.some(ncv => varName.includes(ncv))
              if (!isDefinedNonColor) {
                errors.push(
                  `Line ${index + 1}: Potentially undefined CSS variable: --${varName}\n  ${line.trim()}`
                )
              }
            }
          }
        })

        if (errors.length > 0) {
          throw new Error(`\n\nCSS variable errors found:\n${errors.join('\n\n')}`)
        }
      })

      it('should use oklch() for gradients with color variables', () => {
        const errors: string[] = []

        lines.forEach((line, index) => {
          // Check gradients
          if (line.includes('gradient') && line.includes('var(--')) {
            COLOR_VARS.forEach(colorVar => {
              const bareVarPattern = new RegExp(`var\\(--${colorVar}\\)(?![)])`, 'g')
              if (bareVarPattern.test(line) && !line.includes(`oklch(var(--${colorVar}))`)) {
                errors.push(
                  `Line ${index + 1}: Gradient should use oklch(var(--${colorVar}))\n  ${line.trim()}`
                )
              }
            })
          }
        })

        if (errors.length > 0) {
          throw new Error(`\n\nGradient CSS variable errors:\n${errors.join('\n\n')}`)
        }
      })
    })
  })
})
