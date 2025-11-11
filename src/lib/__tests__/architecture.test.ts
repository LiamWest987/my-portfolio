import { describe, it, expect } from 'vitest'
import { globSync } from 'glob'
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Architecture Enforcement Tests
 *
 * These tests ensure the codebase follows Atomic Design principles,
 * Next.js best practices, and proper file organization.
 */

const SRC_DIR = path.join(process.cwd(), 'src')

describe('Atomic Design Enforcement', () => {
  it('should only have atoms in src/components/ui/atoms/', () => {
    const atomFiles = globSync('components/ui/atoms/**/*.{ts,tsx}', { cwd: SRC_DIR })

    // All atom files should be basic UI elements (no complex logic)
    const basicElements = [
      'button',
      'badge',
      'input',
      'label',
      'card',
      'separator',
      'skeleton',
      'textarea',
      'dialog',
      'select',
      'tabs',
      'index',
    ]

    const nonAtomFiles = atomFiles.filter(file => {
      const basename = path.basename(file, path.extname(file)).toLowerCase()
      return !basicElements.some(element => basename.includes(element))
    })

    expect(nonAtomFiles).toHaveLength(0)
  })

  it('should only have molecules in src/components/ui/molecules/', () => {
    const moleculeFiles = globSync('components/ui/molecules/**/*.{ts,tsx}', { cwd: SRC_DIR })

    // Molecules should be compositions of 2-3 atoms
    moleculeFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Should not contain complex business logic (no useState with >3 states)
      const stateCount = (content.match(/useState/g) || []).length
      expect(stateCount).toBeLessThanOrEqual(3)
    })
  })

  it('should only have organisms in src/components/ui/organisms/', () => {
    const organismFiles = globSync('components/ui/organisms/**/*.{ts,tsx}', { cwd: SRC_DIR })

    // Organisms are complex sections (Header, Footer, ContactForm, ProjectGrid, BackgroundAnimation)
    const expectedOrganisms = [
      'header',
      'footer',
      'hero',
      'contact',
      'project',
      'about',
      'background',
      'controls',
      'dropdown',
      'page',
      'timeline',
      'index',
    ]

    organismFiles.forEach(file => {
      const basename = path.basename(file, path.extname(file)).toLowerCase()
      const isExpected = expectedOrganisms.some(org => basename.includes(org))

      expect(isExpected).toBe(true)
    })
  })

  it('should have component index exports for each level', () => {
    const levels = ['atoms', 'molecules', 'organisms']

    levels.forEach(level => {
      const exists = globSync(`components/ui/${level}/index.ts`, { cwd: SRC_DIR }).length > 0

      if (globSync(`components/ui/${level}/**/*.tsx`, { cwd: SRC_DIR }).length > 0) {
        expect(exists).toBe(true)
      }
    })
  })
})

describe('Next.js App Router Enforcement', () => {
  it('should have page.tsx for all routes', () => {
    const routes = globSync('app/**/page.tsx', { cwd: SRC_DIR })

    // Must have at least root page
    expect(routes.length).toBeGreaterThan(0)
    expect(routes.some(r => r === 'app/page.tsx')).toBe(true)
  })

  it('should not have pages/ directory (App Router only)', () => {
    const pagesDir = globSync('pages/**/*', { cwd: SRC_DIR })
    expect(pagesDir).toHaveLength(0)
  })

  it('should use proper file naming (kebab-case for routes)', () => {
    const routes = globSync('app/**/*.tsx', { cwd: SRC_DIR })

    routes.forEach(route => {
      const segments = route.split('/')

      segments.forEach(segment => {
        // Skip special Next.js files
        if (
          ['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx'].includes(segment)
        ) {
          return
        }

        // Skip dynamic routes
        if (segment.startsWith('[') && segment.endsWith(']')) {
          return
        }

        // Check for camelCase (should be kebab-case)
        const hasUpperCase = /[A-Z]/.test(segment)
        if (hasUpperCase && segment !== 'app') {
          console.warn(`Route segment should use kebab-case: ${segment} in ${route}`)
        }
      })
    })
  })

  it('should have metadata in page.tsx files', () => {
    const pageFiles = globSync('app/**/page.tsx', { cwd: SRC_DIR })

    pageFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Should either export metadata or generateMetadata
      const hasMetadata =
        content.includes('export const metadata') ||
        content.includes('export async function generateMetadata')

      // Client components can't export metadata, so check if it's a client component
      const isClientComponent = content.includes('"use client"') || content.includes("'use client'")

      if (!file.includes('studio') && !isClientComponent) {
        // Skip studio route and client components
        expect(hasMetadata).toBe(true)
      }
    })
  })

  it('should use "use client" directive only when necessary', () => {
    const componentFiles = globSync('components/**/*.tsx', { cwd: SRC_DIR })

    componentFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')
      const hasUseClient = content.includes('"use client"') || content.includes("'use client'")

      if (hasUseClient) {
        // If using "use client", should have interactivity (hooks, events, context) or use Radix UI
        const hasInteractivity =
          content.includes('useState') ||
          content.includes('useEffect') ||
          content.includes('useContext') ||
          content.includes('useRef') ||
          content.includes('onClick') ||
          content.includes('onChange') ||
          content.includes('onSubmit') ||
          content.includes('onBlur') ||
          content.includes('onFocus') ||
          content.includes('onKeyDown') ||
          content.includes('onKeyUp') ||
          content.includes('onMouseEnter') ||
          content.includes('onMouseLeave')

        // Radix UI components require "use client" even without traditional interactivity
        const usesRadixUI = content.includes('@radix-ui/')

        expect(hasInteractivity || usesRadixUI).toBe(true)
      }
    })
  })
})

describe('TypeScript Best Practices Enforcement', () => {
  it('should not use "any" type except in config files', () => {
    const tsFiles = globSync('**/*.{ts,tsx}', {
      cwd: SRC_DIR,
      ignore: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
    })

    const violations: string[] = []

    tsFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Allow "as any" for necessary type casts, but not "any" declarations
      const anyMatches = content.match(/:\s*any(?!\s*\/\/\s*necessary)/g)

      if (anyMatches && anyMatches.length > 0) {
        violations.push(file)
      }
    })

    expect(violations).toHaveLength(0)
  })

  it('should use interface over type for object shapes', () => {
    const tsFiles = globSync('**/*.{ts,tsx}', { cwd: SRC_DIR })

    tsFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Check for "type Foo = {" pattern (should use interface)
      const typeObjectMatches = content.match(/type\s+\w+\s*=\s*\{/g)

      if (typeObjectMatches) {
        console.warn(`Consider using interface instead of type for object shapes in ${file}`)
      }
    })
  })

  it('should properly type React component props', () => {
    const componentFiles = globSync('components/**/*.tsx', { cwd: SRC_DIR })

    componentFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Components should have typed props
      const hasDefaultExport = content.includes('export default')
      const hasNamedExport = content.includes('export function') || content.includes('export const')

      if (hasDefaultExport || hasNamedExport) {
        // Should define props interface or type
        const hasPropsType =
          (content.includes('interface') && content.includes('Props')) ||
          (content.includes('type') && content.includes('Props')) ||
          content.includes(': React.') ||
          content.includes(': JSX.') ||
          content.includes('<React.') ||
          content.includes('React.FC<') ||
          content.includes('React.Component<')

        // Check if component has parameters (props)
        const functionMatch =
          content.match(/function\s+\w+\s*\(([^)]*)\)/) ||
          content.match(/const\s+\w+\s*=\s*\(([^)]*)\)\s*(?::|=>)/)

        if (functionMatch && functionMatch[1]) {
          const params = functionMatch[1].trim()
          // If has params and they're not just empty or just children
          if (params && params !== '' && !params.includes('children')) {
            // Should have explicit props typing (interface, type, inline type, or React.FC)
            const hasInlineType = params.includes(':')
            expect(hasPropsType || hasInlineType || content.includes('{}')).toBe(true)
          }
        }
      }
    })
  })
})

describe('File Organization Enforcement', () => {
  it('should co-locate tests with source files in __tests__/', () => {
    const testFiles = globSync('**/*.test.{ts,tsx}', { cwd: SRC_DIR })

    testFiles.forEach(file => {
      const dir = path.dirname(file)
      const isInTestsDir = dir.includes('__tests__')

      expect(isInTestsDir).toBe(true)
    })
  })

  it('should have proper barrel exports (index.ts)', () => {
    const directories = [
      'components/ui/atoms',
      'components/ui/molecules',
      'components/ui/organisms',
      'lib',
      'types',
    ]

    directories.forEach(dir => {
      const files = globSync(`${dir}/*.{ts,tsx}`, { cwd: SRC_DIR })

      if (files.length > 1) {
        const hasIndex = files.some(f => f.endsWith('index.ts'))

        if (!hasIndex) {
          console.warn(`Consider adding index.ts barrel export in ${dir}`)
        }
      }
    })
  })

  it('should not have unused files', () => {
    const allFiles = globSync('**/*.{ts,tsx}', {
      cwd: SRC_DIR,
      ignore: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**', '**/index.ts'],
    })

    const potentiallyUnused: string[] = []

    allFiles.forEach(file => {
      const basename = path.basename(file, path.extname(file))

      // Check if file is imported anywhere
      const allContent = allFiles.map(f => readFileSync(path.join(SRC_DIR, f), 'utf-8')).join('\n')

      const isImported =
        allContent.includes(`from './${basename}'`) ||
        allContent.includes(`from '@/${file.replace(/\.tsx?$/, '')}`) ||
        file.includes('page.tsx') ||
        file.includes('layout.tsx')

      if (!isImported) {
        potentiallyUnused.push(file)
      }
    })

    // This is a warning, not a hard failure
    if (potentiallyUnused.length > 0) {
      console.warn('Potentially unused files:', potentiallyUnused)
    }
  })
})

describe('Accessibility Enforcement', () => {
  it('should have alt text for all images', () => {
    const componentFiles = globSync('components/**/*.tsx', { cwd: SRC_DIR })

    componentFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Check for <img> or <Image> tags without alt
      const imgMatches = content.match(/<(?:img|Image)[^>]*>/g) || []

      imgMatches.forEach(tag => {
        const hasAlt = tag.includes('alt=')
        expect(hasAlt).toBe(true)
      })
    })
  })

  it('should use semantic HTML elements', () => {
    const pageFiles = globSync('app/**/page.tsx', { cwd: SRC_DIR })

    pageFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Should use semantic elements (header, main, footer, nav, section, article)
      // Can be lowercase HTML tags or capitalized components that render semantic elements
      const hasSemanticHTML =
        content.includes('<main') ||
        content.includes('<header') ||
        content.includes('<footer') ||
        content.includes('<nav') ||
        content.includes('<section') ||
        content.includes('<article') ||
        content.includes('<Section') || // Section component renders <section>
        content.includes('<Container') // Container component used for semantic structure

      if (!file.includes('studio')) {
        expect(hasSemanticHTML).toBe(true)
      }
    })
  })

  it('should have proper heading hierarchy', () => {
    const pageFiles = globSync('app/**/page.tsx', { cwd: SRC_DIR })

    pageFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Should have h1 (as element, via heading prop, as prop, or via PageHeader component)
      const hasH1 =
        content.includes('<h1') ||
        content.includes('heading: "h1"') ||
        content.includes('as="h1"') ||
        content.includes('PageHeader')

      if (!file.includes('studio')) {
        expect(hasH1).toBe(true)
      }
    })
  })
})

describe('Performance Best Practices', () => {
  it('should use Next.js Image component instead of img', () => {
    const componentFiles = globSync('components/**/*.tsx', { cwd: SRC_DIR })

    componentFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Check for <img> tags (should use Next/Image)
      const hasImg = content.match(/<img\s/g)

      if (hasImg && hasImg.length > 0) {
        console.warn(`Consider using Next.js Image component in ${file}`)
      }
    })
  })

  it('should use Next.js Link component for internal navigation', () => {
    const componentFiles = globSync('components/**/*.tsx', { cwd: SRC_DIR })

    componentFiles.forEach(file => {
      const content = readFileSync(path.join(SRC_DIR, file), 'utf-8')

      // Check for <a href="/"> (should use Link)
      const internalLinks = content.match(/<a\s+href=["']\//g)

      if (internalLinks && internalLinks.length > 0) {
        const usesLink = content.includes('import Link from') || content.includes('import { Link }')

        if (!usesLink) {
          console.warn(`Consider using Next.js Link component for internal links in ${file}`)
        }
      }
    })
  })
})
