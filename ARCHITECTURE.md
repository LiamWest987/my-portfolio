# Project Architecture

This project follows the **Bulletproof React** architecture pattern with Next.js App Router conventions.

## Folder Structure

```
my-portfolio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home page
│   │   ├── about/                # About page route
│   │   ├── projects/             # Projects page route
│   │   ├── contact/              # Contact page route
│   │   └── home/                 # Home route
│   │
│   ├── components/               # Shared components
│   │   ├── ui/                   # Base UI components (Button, Badge, etc.)
│   │   ├── layout/               # Layout components (Header, Footer)
│   │   ├── common/               # Common components (ThemeProvider)
│   │   └── __tests__/            # Component tests
│   │
│   ├── features/                 # Feature modules (future organization)
│   │   ├── projects/
│   │   │   ├── api/              # Project-specific API calls
│   │   │   ├── components/       # Project-specific components
│   │   │   ├── hooks/            # Project-specific hooks
│   │   │   ├── types/            # Project types
│   │   │   └── index.ts          # Feature exports
│   │   ├── contact/
│   │   └── about/
│   │
│   ├── lib/                      # Reusable libraries
│   │   ├── sanity/               # Sanity CMS client & queries
│   │   │   ├── client.ts         # Sanity client configuration
│   │   │   └── index.ts          # Re-exports
│   │   └── __tests__/            # Library tests
│   │
│   ├── utils/                    # Shared utility functions
│   │   └── index.ts              # Date, string, cn utilities
│   │
│   ├── types/                    # Global TypeScript types
│   │   ├── index.ts              # Shared types
│   │   └── vitest.d.ts           # Vitest global types
│   │
│   └── config/                   # App configuration
│       └── site.ts               # Site metadata & config
│
├── test/                         # Test utilities
│   └── setup.ts                  # Vitest setup
│
├── public/                       # Static assets
│   └── pdfs/                     # PDF files
│
└── sanity/                       # Sanity CMS (separate project)
    ├── schemas/
    └── sanity.config.ts
```

## Key Principles

### 1. Feature-Based Organization
- Features are self-contained modules in `src/features/`
- Each feature has its own components, hooks, types, and API calls
- Prevents cross-feature dependencies
- Export through `index.ts` for clean imports

### 2. Shared Components
- `src/components/ui/` - Reusable UI components (Button, Input, etc.)
- `src/components/layout/` - Layout components (Header, Footer)
- `src/components/common/` - App-wide components (ThemeProvider)

### 3. Import Rules
```typescript
// ✅ Good - Import from feature index
import { ProjectCard, useProjects } from '@/features/projects'

// ❌ Bad - Direct imports from feature internals
import { ProjectCard } from '@/features/projects/components/project-card'
```

### 4. Path Aliases
- `@/*` maps to `src/*`
- Clean imports: `@/components/ui/Button` instead of `../../../components/ui/Button`

## TypeScript Configuration

- **Strict mode enabled** with additional checks
- `noUncheckedIndexedAccess` for safer array/object access
- `noImplicitReturns` for function completeness
- Path aliases configured in `tsconfig.json`

## Testing

- **Vitest** for unit tests
- **React Testing Library** for component tests
- Tests colocated with code in `__tests__` folders
- Test setup in `test/setup.ts`

## Pre-commit Hooks

Automated checks before each commit:
1. TypeScript type-check (`npm run type-check`)
2. ESLint (`npx lint-staged`)
3. Prettier formatting
4. Full test suite (`npm test`)

## Future Improvements

1. **Move project-specific components** from `components/ui/` to `features/projects/components/`
2. **Add API layer** in `features/*/api/` for data fetching
3. **Create custom hooks** in `features/*/hooks/` for business logic
4. **Add ESLint rules** to enforce architecture boundaries

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Migration Notes

This structure was migrated from a flat component structure to follow Bulletproof React patterns. All import paths have been updated to use the new `src/` based structure.
