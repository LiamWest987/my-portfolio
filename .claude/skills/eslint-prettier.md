# ESLint & Prettier - Code Quality Standards

## Overview

Code quality and formatting standards for **The Mordecai Collective** Next.js 15 + TypeScript application. This guide establishes automated code quality enforcement, consistent formatting, and developer experience optimizations through ESLint 9 and Prettier 3.

**Philosophy:**
- **ESLint for code quality** - Catch bugs, enforce best practices, ensure accessibility
- **Prettier for formatting** - Consistent code style, auto-format on save
- **Separation of concerns** - ESLint handles logic, Prettier handles aesthetics
- **Auto-fix everything** - Minimize manual intervention, maximize productivity

**Technology Stack:**
- ESLint 9 (latest, with flat config support)
- Prettier 3.6+ with Tailwind CSS plugin
- TypeScript ESLint 8.46+
- Next.js 16 ESLint config

---

## ESLint Configuration

### Current Configuration (.eslintrc.json)

The project currently uses the **legacy .eslintrc.json format** (ESLint <9 style). While ESLint 9 supports flat config (`eslint.config.mjs`), the Next.js ecosystem is transitioning gradually.

**Rationale for .eslintrc.json (for now):**
1. Better Next.js 16 compatibility with `next lint`
2. Mature plugin ecosystem support
3. Team familiarity with JSON config
4. Will migrate to flat config in 2025 Q2

### Actual Configuration

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
    "react/jsx-curly-brace-presence": [
      "error",
      { "props": "never", "children": "never" }
    ],
    "react/jsx-boolean-value": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "next/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react", "next"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/no-duplicates": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "ignorePatterns": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build",
    "public",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts"
  ]
}
```

### Future: Flat Config (eslint.config.mjs)

When migrating to ESLint 9+ flat config in 2025 Q2, use this structure:

```javascript
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // React
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // Accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",

      // Import ordering
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
    },
  },
  prettier,
  {
    ignores: ["node_modules", ".next", "out", "dist", "build", "public"],
  },
];
```

**Why Flat Config:**
- Simpler mental model (just JavaScript arrays)
- Better TypeScript support
- More flexible configuration composition
- Official ESLint 9+ format
- Future-proof

**Why NOT yet:**
- Next.js `next lint` still optimizing for flat config
- Some plugins need FlatCompat wrapper
- Migration requires testing all rules

---

## Prettier Configuration

### Actual .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Configuration Rationale:**

| Setting | Value | Why |
|---------|-------|-----|
| `semi` | `true` | TypeScript convention, prevents ASI errors |
| `singleQuote` | `false` | HTML/JSX consistency, JSON compatibility |
| `printWidth` | `80` | Readable code, fits side-by-side editors |
| `tabWidth` | `2` | React/Next.js convention |
| `trailingComma` | `es5` | Git diffs, easy object property additions |
| `arrowParens` | `always` | TypeScript type clarity `(x: number) => {}` |
| `endOfLine` | `lf` | Cross-platform (macOS/Linux), Git consistency |

### Prettier Plugin: Tailwind CSS

**Critical for The Mordecai Collective:**

```bash
npm install -D prettier-plugin-tailwindcss
```

**What it does:**
- Automatically sorts Tailwind classes in recommended order
- Example: `className="p-4 text-blue-500 hover:bg-blue-100"` → `className="p-4 text-blue-500 hover:bg-blue-100"` (already optimized)
- Follows official Tailwind CSS class ordering
- Works with `cn()` utility and `cva()` from class-variance-authority

**Example transformation:**

```tsx
// Before
<div className="text-center mt-4 p-2 bg-blue-500 rounded-lg shadow-md">

// After (auto-sorted)
<div className="mt-4 rounded-lg bg-blue-500 p-2 text-center shadow-md">
```

### .prettierignore

```
.next
node_modules
out
dist
build
public
*.config.js
*.config.mjs
*.config.ts
pnpm-lock.yaml
package-lock.json
```

**Why ignore these:**
- `.next`, `node_modules`, `dist` - Generated code
- `public` - Static assets (images, fonts)
- `*.config.*` - May have specific formatting needs
- Lock files - Never manually edit

---

## VS Code Integration

### Actual .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.rulers": [80, 120],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  },
  "files.watcherExclude": {
    "**/.next/**": true,
    "**/node_modules/**": true
  },
  "search.exclude": {
    "**/.next": true,
    "**/node_modules": true,
    "**/package-lock.json": true,
    "**/pnpm-lock.yaml": true
  },
  "css.validate": false,
  "css.customData": [".vscode/css_custom_data.json"]
}
```

**Key Settings Explained:**

1. **`editor.formatOnSave: true`**
   - Auto-formats code with Prettier on every save
   - Zero manual formatting effort

2. **`source.fixAll.eslint: "explicit"`**
   - Auto-fixes ESLint errors on save
   - `"explicit"` = user explicitly enabled (vs default)

3. **`source.organizeImports: "explicit"`**
   - Auto-sorts imports according to `import/order` rule
   - Removes unused imports

4. **`editor.rulers: [80, 120]`**
   - Visual guides at 80 (Prettier limit) and 120 (hard max)

5. **`typescript.preferences.preferTypeOnlyAutoImports: true`**
   - Auto-adds `type` keyword: `import { type User } from '@/types'`
   - Matches ESLint `consistent-type-imports` rule

6. **Tailwind CSS class regex**
   - Enables Tailwind IntelliSense inside `cn()` and `cva()` calls
   - Critical for shadcn/ui components

### Recommended VS Code Extensions

Add to `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Extensions explained:**
- **ESLint** - Real-time linting, auto-fix on save
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Class autocomplete, hover previews
- **TypeScript Nightly** - Latest TS features

---

## Custom Rules for The Mordecai Collective

### TypeScript Rules

```json
{
  "@typescript-eslint/no-explicit-any": "error"
}
```
**Why:** `any` defeats TypeScript. Use `unknown` or proper types.

```json
{
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }
  ]
}
```
**Why:** Catches dead code. Prefix with `_` for intentionally unused (e.g., `_event` in callbacks).

```json
{
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      "prefer": "type-imports",
      "fixStyle": "inline-type-imports"
    }
  ]
}
```
**Why:** Smaller bundles (types erased at build), clearer intent.
```tsx
// Good
import { useState } from 'react';
import { type User } from '@/types';

// Bad
import { useState, User } from 'react';
```

```json
{
  "@typescript-eslint/consistent-type-definitions": ["error", "interface"]
}
```
**Why:** Interfaces have better error messages, extensibility. Use `type` only for unions/intersections.

### React Rules

```json
{
  "react/self-closing-comp": "error"
}
```
**Why:** Cleaner JSX.
```tsx
// Good: <Button />
// Bad:  <Button></Button>
```

```json
{
  "react/jsx-curly-brace-presence": [
    "error",
    { "props": "never", "children": "never" }
  ]
}
```
**Why:** Avoid unnecessary braces.
```tsx
// Good: <Button variant="primary">Click</Button>
// Bad:  <Button variant={"primary"}>{"Click"}</Button>
```

```json
{
  "react-hooks/exhaustive-deps": "error"
}
```
**Why:** Prevents stale closures, infinite loops. Fix missing dependencies, don't disable.

### Accessibility Rules

```json
{
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/label-has-associated-control": "error"
}
```
**Why:** The Mordecai Collective is inclusive. Accessible by default.

### Import Ordering

```json
{
  "import/order": [
    "error",
    {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "type"],
      "pathGroups": [
        { "pattern": "react", "group": "external", "position": "before" },
        { "pattern": "next/**", "group": "external", "position": "before" },
        { "pattern": "@/**", "group": "internal" }
      ],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }
  ]
}
```

**Resulting import structure:**
```tsx
import { useState, useEffect } from 'react';  // React first

import { useRouter } from 'next/navigation';  // Next.js second

import { Button } from '@/components/ui/button';  // Internal (@/ alias)
import { formatDate } from '@/lib/utils';

import { api } from '../utils/api';  // Parent
import { UserCard } from './UserCard';  // Sibling

import { type User, type Post } from '@/types';  // Types last
```

### Production Code Quality

```json
{
  "no-console": ["warn", { "allow": ["warn", "error"] }]
}
```
**Why:** `console.log` is for debugging. Use proper logging in production. `console.warn` and `console.error` are allowed for intentional logging.

```json
{
  "prefer-const": "error",
  "no-var": "error"
}
```
**Why:** Immutability by default. `let` only when reassignment needed. Never `var`.

---

## Pre-commit Hooks (Recommended Setup)

While not currently configured, here's the recommended setup for team consistency:

### Install Husky + lint-staged

```bash
npm install -D husky lint-staged
npx husky init
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### package.json

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**What this does:**
1. Before each commit, runs lint-staged
2. lint-staged runs ESLint + Prettier only on staged files
3. Auto-fixes issues, stages fixes
4. Commit fails if unfixable errors remain

**Benefits:**
- Team-wide consistency (no "forgot to format")
- Fast (only checks changed files)
- Catches issues before CI/CD

**Why not enabled yet:**
- Single developer workflow (you're already using auto-format on save)
- Can add when team grows or for CI/CD enforcement

---

## Package.json Scripts

Current scripts (from actual package.json):

```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\""
  }
}
```

### Usage Guide

**During development:**
```bash
# Check for linting errors (read-only)
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Format all files
npm run format

# Check formatting without modifying (for CI)
npm run format:check
```

**Recommended CI/CD check:**
```bash
npm run lint && npm run format:check && npm run type-check
```

**Pre-deployment:**
```bash
npm run lint:fix && npm run format
```

### Type-checking

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

**Why separate from linting:**
- Faster feedback (ESLint doesn't do full type-checking)
- Catches type errors that ESLint misses
- Run in CI: `npm run lint && npm run type-check`

---

## Common Issues & Solutions

### Issue 1: ESLint and Prettier Fighting

**Symptoms:**
- Code formatted by Prettier, ESLint shows error
- Save → Format → Error → Format → Error loop

**Cause:**
- ESLint formatting rules conflict with Prettier

**Solution:**
- Ensure `eslint-config-prettier` is installed and LAST in extends:
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"  // MUST BE LAST
  ]
}
```
- `eslint-config-prettier` disables all formatting rules

**Verify:**
```bash
npm list eslint-config-prettier
# Should show: eslint-config-prettier@10.1.8
```

### Issue 2: VS Code Not Auto-Formatting

**Symptoms:**
- Save doesn't format code
- No errors shown

**Diagnosis:**
1. Check Output panel (View → Output → Prettier)
2. Check ESLint Server status (View → Output → ESLint)

**Solutions:**

**A) Prettier not set as formatter:**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**B) Format on save disabled:**
```json
{
  "editor.formatOnSave": true
}
```

**C) File not in Prettier scope:**
- Check `.prettierignore`
- Verify file extension in format script: `"**/*.{ts,tsx,md,json}"`

**D) Extension not installed:**
```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

**E) Workspace settings override:**
- Check `.vscode/settings.json` takes precedence over user settings

### Issue 3: Import Order Not Auto-Fixing

**Symptoms:**
- ESLint shows `import/order` error
- Auto-fix (Cmd+S or Cmd+.) doesn't work

**Cause:**
- `source.organizeImports` uses TypeScript's organizer, not ESLint's
- TypeScript only removes unused, doesn't reorder

**Solution:**
1. Manual fix: `eslint --fix path/to/file.ts`
2. Or use ESLint extension "Quick Fix" (lightbulb icon)
3. Or install `eslint-plugin-simple-import-sort` (auto-fixable alternative)

**Future improvement:**
```bash
npm install -D eslint-plugin-simple-import-sort
```

Then in `.eslintrc.json`:
```json
{
  "plugins": ["simple-import-sort"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
}
```

### Issue 4: CI/CD Failing Locally Passing

**Symptoms:**
- `npm run lint` passes locally
- GitHub Actions fails with linting errors

**Causes:**
- Different Node versions
- `.eslintcache` corruption
- Different npm/pnpm versions

**Solutions:**

**A) Match Node versions:**
```json
// package.json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**B) Clear cache:**
```bash
rm -rf .next node_modules .eslintcache
npm install
npm run lint
```

**C) Ensure fresh lint in CI:**
```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint -- --max-warnings 0
```
The `--max-warnings 0` treats warnings as errors in CI.

### Issue 5: Dealing with Third-Party Code

**Scenario:** Integrating Sanity Studio or legacy code with different style.

**Solution A: Ignore specific files**
```json
// .eslintrc.json
{
  "ignorePatterns": [
    "node_modules",
    ".next",
    "sanity/**",  // Ignore entire directory
    "legacy/*.js"
  ]
}
```

**Solution B: Per-file overrides**
```json
{
  "overrides": [
    {
      "files": ["scripts/**/*.js"],
      "rules": {
        "no-console": "off",  // Allow console in scripts
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
}
```

**Solution C: Inline comments (last resort)**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData: any = externalLib.getData();
```

### Issue 6: Slow ESLint Performance

**Symptoms:**
- VS Code lags on save
- `npm run lint` takes >30 seconds

**Solutions:**

**A) Enable ESLint caching:**
```json
{
  "scripts": {
    "lint": "next lint --cache"
  }
}
```

**B) Reduce parserOptions.project scope:**
```json
{
  "parserOptions": {
    "project": ["./tsconfig.json"]  // Don't use globs like ./*/tsconfig.json
  }
}
```

**C) Exclude unnecessary files:**
```json
{
  "ignorePatterns": ["**/*.config.js", "public/**"]
}
```

**D) Use workspace trust:**
```json
// .vscode/settings.json
{
  "eslint.workingDirectories": [{ "mode": "auto" }]
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

Recommended `.github/workflows/lint.yml`:

```yaml
name: Lint & Format Check

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint -- --max-warnings 0

      - name: Format check
        run: npm run format:check
```

**Key points:**
- `npm ci` (not `npm install`) for reproducible installs
- `--max-warnings 0` fails on any warnings
- `format:check` doesn't modify files (safe for CI)
- Run type-check separately for clearer errors

### Vercel Deployment

Vercel automatically runs `npm run build`, which includes Next.js linting:

```json
// next.config.ts
export default {
  eslint: {
    // Fail build on ESLint errors
    ignoreDuringBuilds: false
  },
  typescript: {
    // Fail build on type errors
    ignoreBuildErrors: false
  }
}
```

**Disable (not recommended):**
```typescript
export default {
  eslint: {
    ignoreDuringBuilds: true  // Skip linting in build (bad practice)
  }
}
```

---

## Migration Path: .eslintrc.json → eslint.config.mjs

**When to migrate:** Q2 2025 or when Next.js 17 releases with full flat config support.

### Step 1: Install dependencies

```bash
npm install -D @eslint/js @eslint/eslintrc
```

### Step 2: Create eslint.config.mjs

Use the flat config example from "ESLint Configuration" section above.

### Step 3: Test in parallel

```bash
# Old config
npx eslint --config .eslintrc.json .

# New config
npx eslint --config eslint.config.mjs .

# Compare outputs - should be identical
```

### Step 4: Update package.json

```json
{
  "scripts": {
    "lint": "eslint .",  // Automatically uses eslint.config.mjs
    "lint:fix": "eslint . --fix"
  }
}
```

### Step 5: Remove old config

```bash
rm .eslintrc.json
```

### Step 6: Verify CI/CD

Ensure GitHub Actions, Vercel, and local dev all pass.

---

## Real Configuration Files Summary

### File: `.eslintrc.json` (Current)
- Location: `/Users/coreywest/Documents/website/.eslintrc.json`
- Status: Active, legacy format
- Next.js 16 compatible

### File: `.prettierrc` (Current)
- Location: `/Users/coreywest/Documents/website/.prettierrc`
- Includes Tailwind CSS plugin
- 80 character line length

### File: `.prettierignore` (Current)
- Location: `/Users/coreywest/Documents/website/.prettierignore`
- Excludes build artifacts, lock files

### File: `.vscode/settings.json` (Current)
- Location: `/Users/coreywest/Documents/website/.vscode/settings.json`
- Auto-format on save enabled
- ESLint auto-fix enabled
- Tailwind IntelliSense for `cn()` and `cva()`

### File: `package.json` Scripts (Current)
- `lint` - Check for errors
- `lint:fix` - Auto-fix errors
- `format` - Format all files
- `format:check` - CI-safe format check
- `type-check` - TypeScript validation

---

## Best Practices

1. **Always run `npm run lint:fix` before committing**
   - Even with auto-save, catches import ordering and other issues

2. **Don't disable rules lightly**
   - If a rule is annoying, discuss with team before disabling
   - Understand WHY the rule exists

3. **Use TypeScript strict mode**
   - Your `tsconfig.json` has excellent strict settings
   - ESLint complements TypeScript, doesn't replace it

4. **Accessibility is non-negotiable**
   - Never disable `jsx-a11y` rules
   - If compliance is hard, the component design is wrong

5. **Import organization matters**
   - React/Next first, internal code middle, types last
   - Makes dependencies clear at a glance

6. **Prettier owns formatting, ESLint owns logic**
   - Don't add formatting rules to ESLint
   - Let each tool do its job

7. **Auto-fix everything possible**
   - Developer time > perfect rules
   - If it can be auto-fixed, enforce it strictly

---

## Quick Reference

### Commands
```bash
# Lint all files
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format all files
npm run format

# Check formatting (CI)
npm run format:check

# Type check
npm run type-check

# Pre-commit check (recommended)
npm run lint:fix && npm run format && npm run type-check
```

### VS Code Shortcuts
- **Format Document:** `Shift + Option + F` (macOS) / `Shift + Alt + F` (Windows)
- **Fix ESLint Issues:** `Cmd + .` then select "Fix all auto-fixable issues"
- **Organize Imports:** `Shift + Option + O`

### Useful ESLint Disables (Rare)
```typescript
// Disable next line
// eslint-disable-next-line rule-name
const x = problematicCode();

// Disable entire file (very rare)
/* eslint-disable rule-name */

// Disable block
/* eslint-disable rule-name */
const block = code();
/* eslint-enable rule-name */
```

### Useful Prettier Ignore (Rare)
```typescript
// prettier-ignore
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

---

## Resources

- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Next.js ESLint Configuration](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Import Plugin Rules](https://github.com/import-js/eslint-plugin-import)

---

## Changelog

- **2025-01-08** - Initial skill file created
  - Documented current .eslintrc.json configuration
  - Added Prettier setup with Tailwind plugin
  - VS Code integration with auto-format on save
  - Custom rules for The Mordecai Collective standards
  - Future migration path to ESLint 9 flat config
  - Common issues and troubleshooting guide
