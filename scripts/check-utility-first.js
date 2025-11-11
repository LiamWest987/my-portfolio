#!/usr/bin/env node

/**
 * Utility-First Checker Script
 *
 * This script runs as part of CI/CD to enforce Tailwind utility-first patterns.
 * It can also be run manually with: npm run check:utility-first
 */

import { globSync } from 'glob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SRC_DIR = path.join(__dirname, '../src')

// Configuration
const ALLOWED_CSS_MODULES = [
  'BackgroundAnimation.module.css',
  'not-found.module.css',
]

const ALLOWED_CSS_MODULE_IMPORTS = [
  'BackgroundAnimation.tsx',
  'not-found.tsx',
]

let exitCode = 0

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function checkCSSModules() {
  log('\n📦 Checking CSS Modules...', colors.cyan)

  const cssModules = globSync('**/*.module.css', { cwd: SRC_DIR })
  const unjustified = cssModules.filter(
    file => !ALLOWED_CSS_MODULES.some(allowed => file.includes(allowed))
  )

  if (unjustified.length > 0) {
    log('  ❌ Found unjustified CSS modules:', colors.red)
    unjustified.forEach(file => log(`     - ${file}`, colors.red))
    log('\n  💡 Convert these to Tailwind utilities or add justification\n', colors.yellow)
    exitCode = 1
  } else {
    log(`  ✅ No unjustified CSS modules (${cssModules.length} allowed)`, colors.green)
  }
}

function checkCSSModuleImports() {
  log('\n📥 Checking CSS Module Imports...', colors.cyan)

  const tsxFiles = globSync('**/*.{tsx,ts}', {
    cwd: SRC_DIR,
    ignore: ['**/__tests__/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}']
  })

  const violations = []

  tsxFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      if (line.match(/import\s+.*from\s+['"].*\.module\.css['"]/)) {
        const isAllowed = ALLOWED_CSS_MODULE_IMPORTS.some(allowed => file.includes(allowed))
        if (!isAllowed) {
          violations.push({ file, line: index + 1, import: line.trim() })
        }
      }
    })
  })

  if (violations.length > 0) {
    log('  ❌ Found CSS module imports:', colors.red)
    violations.forEach(v => {
      log(`     ${v.file}:${v.line}`, colors.red)
      log(`       ${v.import}`, colors.yellow)
    })
    log('\n  💡 Use Tailwind utilities instead\n', colors.yellow)
    exitCode = 1
  } else {
    log('  ✅ No unjustified CSS module imports', colors.green)
  }
}

function checkInlineStyles() {
  log('\n🎨 Checking Inline Styles...', colors.cyan)

  const tsxFiles = globSync('**/*.tsx', {
    cwd: SRC_DIR,
    ignore: ['**/__tests__/**']
  })

  const violations = []

  tsxFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const styleMatch = line.match(/style=\{\{([^}]+)\}\}/)
      if (styleMatch) {
        const styleContent = styleMatch[1]
        const isDynamic =
          styleContent.includes('${') ||
          styleContent.match(/:\s*[a-zA-Z_][a-zA-Z0-9_]*[,\s]/) ||
          styleContent.includes('props.') ||
          styleContent.includes('state.')

        if (!isDynamic) {
          violations.push({ file, line: index + 1, usage: line.trim() })
        }
      }
    })
  })

  if (violations.length > 0) {
    log('  ⚠️  Found static inline styles:', colors.yellow)
    violations.slice(0, 5).forEach(v => {
      log(`     ${v.file}:${v.line}`, colors.yellow)
    })
    if (violations.length > 5) {
      log(`     ... and ${violations.length - 5} more`, colors.yellow)
    }
    log('\n  💡 Use Tailwind utilities for static styles\n', colors.yellow)
  } else {
    log('  ✅ No static inline styles found', colors.green)
  }
}

function checkCVAUsage() {
  log('\n🎯 Checking CVA Pattern Usage...', colors.cyan)

  const variantComponents = ['badge', 'button']

  variantComponents.forEach(component => {
    const atomPath = path.join(SRC_DIR, `components/ui/atoms/${component}.tsx`)

    if (fs.existsSync(atomPath)) {
      const content = fs.readFileSync(atomPath, 'utf-8')

      const hasCVA = content.includes("from 'class-variance-authority'") ||
                     content.includes('from "class-variance-authority"')
      const usesCVA = content.includes('cva(')
      const hasTypes = content.includes('VariantProps')

      if (!hasCVA || !usesCVA || !hasTypes) {
        log(`  ❌ ${component}.tsx missing CVA pattern`, colors.red)
        if (!hasCVA) log('     - Missing CVA import', colors.red)
        if (!usesCVA) log('     - Missing cva() usage', colors.red)
        if (!hasTypes) log('     - Missing VariantProps types', colors.red)
        exitCode = 1
      } else {
        log(`  ✅ ${component}.tsx uses CVA correctly`, colors.green)
      }
    }
  })
}

function checkDesignTokens() {
  log('\n🎨 Checking Design Token Usage...', colors.cyan)

  const tsxFiles = globSync('**/*.tsx', {
    cwd: SRC_DIR,
    ignore: ['**/__tests__/**']
  })

  const violations = []

  tsxFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      if (line.match(/(?:bg|text|border)-\[(?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)\(/)) {
        violations.push({ file, line: index + 1, usage: line.trim() })
      }
    })
  })

  if (violations.length > 0) {
    log('  ❌ Found arbitrary color values:', colors.red)
    violations.forEach(v => {
      log(`     ${v.file}:${v.line}`, colors.red)
    })
    log('\n  💡 Use design tokens: bg-primary, text-foreground, etc.\n', colors.yellow)
    exitCode = 1
  } else {
    log('  ✅ Using design tokens correctly', colors.green)
  }
}

// Run all checks
log('\n🔍 Running Utility-First Enforcement Checks...', colors.magenta)
log('=' .repeat(60), colors.magenta)

checkCSSModules()
checkCSSModuleImports()
checkInlineStyles()
checkCVAUsage()
checkDesignTokens()

log('\n' + '='.repeat(60), colors.magenta)
if (exitCode === 0) {
  log('✅ All utility-first checks passed!\n', colors.green)
} else {
  log('❌ Some checks failed. Please fix the issues above.\n', colors.red)
}

process.exit(exitCode)
