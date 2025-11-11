#!/usr/bin/env node

/**
 * Best Practices Enforcement Script
 *
 * Runs all enforcement checks in sequence:
 * 1. TypeScript compilation
 * 2. ESLint (accessibility, React, TS patterns)
 * 3. Utility-first enforcement
 * 4. Architecture tests
 * 5. Unit test coverage thresholds
 *
 * Exit code: 0 if all pass, non-zero if any fail
 */

import { execSync } from 'child_process'
import chalk from 'chalk'

const checks = [
  {
    name: 'TypeScript Compilation',
    command: 'npm run type-check',
    description: 'Ensures type safety and correct TypeScript patterns',
  },
  {
    name: 'ESLint (Code Quality & Accessibility)',
    command: 'npm run lint',
    description: 'Checks code quality, React patterns, and accessibility rules',
  },
  {
    name: 'Utility-First Enforcement',
    command: 'npm run check:utility-first',
    description: 'Prevents CSS module creep and enforces Tailwind patterns',
  },
  {
    name: 'Architecture Tests',
    command: 'npm run test:architecture',
    description: 'Validates Atomic Design, Next.js conventions, and file organization',
  },
  {
    name: 'Documentation Tests',
    command: 'npm run test:documentation',
    description: 'Ensures TSDoc comments on all public APIs and components',
  },
  {
    name: 'Unit Test Coverage',
    command: 'npm run test:coverage',
    description: 'Ensures 100% test coverage',
  },
]

console.log(chalk.bold.blue('\n🔍 Running Best Practices Enforcement Checks...\n'))

let exitCode = 0
const results = []

for (const check of checks) {
  console.log(chalk.cyan(`\n▶ ${check.name}`))
  console.log(chalk.gray(`  ${check.description}\n`))

  try {
    execSync(check.command, { stdio: 'inherit' })
    console.log(chalk.green(`✅ ${check.name} passed\n`))
    results.push({ name: check.name, passed: true })
  } catch (_error) {
    console.log(chalk.red(`❌ ${check.name} failed\n`))
    results.push({ name: check.name, passed: false })
    exitCode = 1
  }
}

// Summary
console.log(chalk.bold.blue('\n📊 Summary\n'))

results.forEach(result => {
  const icon = result.passed ? chalk.green('✅') : chalk.red('❌')
  console.log(`${icon} ${result.name}`)
})

const passedCount = results.filter(r => r.passed).length
const totalCount = results.length

console.log(chalk.bold(`\n${passedCount}/${totalCount} checks passed\n`))

if (exitCode === 0) {
  console.log(chalk.green.bold('✨ All best practices checks passed!\n'))
} else {
  console.log(chalk.red.bold('⚠️  Some checks failed. Please fix the issues above.\n'))
}

process.exit(exitCode)
