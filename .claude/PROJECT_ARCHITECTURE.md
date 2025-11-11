# Project Architecture

**Last Updated:** 2025-11-11
**Project:** Liam West Portfolio Website

## Overview

Modern portfolio website built with Next.js 16 showcasing engineering and VR development projects. Uses Sanity CMS for content management with a focus on performance, accessibility, and type safety.

## Tech Stack

### Core Framework

- **Next.js:** 16.0.1 (App Router)
- **React:** 18.3.1
- **TypeScript:** 5.9.3 (strict mode enabled)
- **Node.js:** >=20.0.0

### Styling

- **Tailwind CSS:** 3.4.1
- **shadcn/ui:** Component library (atoms-based)
- **Color System:** OKLCH color space
- **Theme:** Single dark theme (Slate Dark)

### Content Management

- **Sanity CMS:** @sanity/client 7.12.1
- **Studio:** Deployed at https://liamwest.sanity.studio
- **Dataset:** `portfolio` (NOT production)
- **API Version:** 2024-01-01

### Testing

- **Unit Tests:** Vitest 4.0.8 + @testing-library/react
- **E2E Tests:** Playwright 1.56.1
- **Accessibility:** @axe-core/playwright 4.11.0

### Code Quality

- **Linting:** ESLint 9.39.1 (flat config)
- **Formatting:** Prettier 3.6.2
- **Pre-commit:** Husky 9.1.7 + lint-staged

### Deployment

- **Platform:** Vercel
- **Analytics:** @vercel/speed-insights

## Project Structure

```
my-portfolio/
├── .claude/
│   └── skills/                    # Claude Code skills
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── contact/page.tsx
│   │   └── studio/[[...tool]]/   # Studio redirect
│   ├── components/
│   │   ├── ui/
│   │   │   ├── atoms/            # Basic components (Button, Badge, Input)
│   │   │   ├── molecules/        # Combinations (SearchBar, Card)
│   │   │   └── organisms/        # Complex (Header, Footer, ProjectGrid)
│   │   ├── templates/            # Page layouts
│   │   └── __tests__/            # Component tests
│   ├── lib/
│   │   ├── sanity/
│   │   │   └── client.ts         # Sanity client + helper functions
│   │   └── utils.ts              # Utilities (cn, etc.)
│   └── types/                     # TypeScript types
├── sanity/
│   ├── schemaTypes/              # Content schemas
│   ├── sanity.config.ts          # Studio config
│   ├── sanity.cli.ts             # CLI config
│   ├── import-projects.mjs       # Data import scripts
│   └── import-resume-data.mjs
├── tests/                         # E2E tests
└── public/
    └── pdfs/                      # Static PDF files
```

## Architecture Patterns

### 1. Atomic Design

**Component Hierarchy:**

```
Atoms → Molecules → Organisms → Templates → Pages
```

**Guidelines:**

- **Atoms:** Pure UI elements (Button, Badge, Input, Label)
- **Molecules:** Simple combinations (SearchInput, ProjectCard)
- **Organisms:** Complex features (Header, Footer, ProjectGrid, ContactForm)
- **Templates:** Page layouts (not currently used)
- **Pages:** App Router pages (in `src/app/`)

**Example:**

```typescript
// Atom
<Button variant="primary">Click Me</Button>

// Molecule
<ProjectCard project={project} />

// Organism
<ProjectGrid projects={projects} filters={filters} />
```

### 2. Server-First Architecture

**Data Fetching Strategy:**

- **Server Components by default** - Fetch data server-side
- **Client Components only for interactivity** - Forms, filters, modals
- **No client-side data fetching** - All Sanity queries in Server Components
- **Type-safe queries** - TypeScript types for all data

**Pattern:**

```typescript
// Server Component (default)
export default async function ProjectsPage() {
  const projects = await fetchProjects(); // Server-side
  return <ProjectGrid projects={projects} />;
}

// Client Component (when needed)
'use client';
export function ProjectFilter({ onChange }) {
  const [filter, setFilter] = useState('all');
  return <select onChange={...} />;
}
```

### 3. Type Safety (Strict Mode)

**TypeScript Configuration:**

- `strict: true` - All strict checks enabled
- `noUncheckedIndexedAccess: true` - Array access returns T | undefined
- `noImplicitReturns: true` - All code paths must return
- **Never use `any`** - Use `unknown` with type guards

**Runtime Validation:**

- Use Zod for external data validation
- Type inference from Zod schemas
- Sanity TypeGen for CMS types

**Pattern:**

```typescript
// ✅ CORRECT
const project = projects[0]
if (project) {
  console.log(project.title)
}

// ❌ WRONG
const project: any = projects[0]
console.log(project.title) // No type safety
```

### 4. Content Management

**Sanity Integration:**

- **External Studio** - Deployed separately, accessed via /studio redirect
- **Helper Functions** - Centralized in `src/lib/sanity/client.ts`
- **PDF Transformation** - CDN URLs converted to local proxy
- **Image Optimization** - `urlFor()` helper for transformations

**Pattern:**

```typescript
// ✅ CORRECT - Use helper function
import { fetchProjects } from '@/lib/sanity/client'
const projects = await fetchProjects()

// ❌ WRONG - Raw query in component
const projects = await client.fetch('*[_type == "project"]')
```

**Schemas:**

- `project` - Portfolio projects
- `experience` - Work experience
- `education` - Education history
- `award` - Awards/achievements
- `skillCategory` - Skill categories
- `contact` - Contact form submissions

### 5. Styling System

**Semantic Colors:**

- Use CSS variables with OKLCH color space
- Never hardcode colors
- Use Tailwind semantic classes

**Pattern:**

```tsx
// ✅ CORRECT
<div className="bg-card text-card-foreground border-border">

// ❌ WRONG
<div className="bg-slate-800 text-slate-100 border-slate-700">
```

**Component Styling:**

- shadcn/ui for base components
- Tailwind for layouts and spacing
- CSS variables for colors
- Atomic design structure

## Data Flow

### Content Pipeline

```
Sanity Studio
    ↓
Sanity Content Lake (dataset: portfolio)
    ↓
Next.js Server Components (fetchProjects, fetchSkills, etc.)
    ↓
React Components (Server or Client)
    ↓
User Browser
```

### Build Process

```
TypeScript Compilation
    ↓
ESLint + Prettier Check
    ↓
Vitest Unit Tests
    ↓
Next.js Build
    ↓
Playwright E2E Tests
    ↓
Vercel Deployment
```

## Key Constraints

### Performance

- **Lighthouse Score:** > 90
- **First Contentful Paint:** < 1.5s
- **Server Components:** Default for better performance
- **Image Optimization:** Next.js Image component
- **CDN:** Sanity CDN enabled in production

### Accessibility

- **Standard:** WCAG AA compliance required
- **Keyboard Navigation:** All interactive elements accessible
- **Color Contrast:** Minimum 4.5:1 for normal text
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Focus Indicators:** Visible on all interactive elements

### Type Safety

- **TypeScript Strict Mode:** All strict checks enabled
- **No `any` Types:** Use `unknown` and type guards
- **Zod Validation:** Runtime validation for external data
- **Sanity Types:** Generated from schemas

### Code Quality

- **ESLint:** Enforced on pre-commit
- **Prettier:** Auto-format on save
- **Tests:** Unit tests for components, E2E for flows
- **Pre-commit Hooks:** Type check, lint, format, test

## Decision History

### Major Architectural Decisions

1. **Next.js App Router** - Chosen for React Server Components support
2. **External Sanity Studio** - Deployed separately for better separation
3. **Atomic Design** - Structured component hierarchy
4. **TypeScript Strict Mode** - Maximum type safety
5. **No Client-Side Data Fetching** - Server Components only
6. **OKLCH Color Space** - Better perceptual uniformity
7. **Single Dark Theme** - Simplified design system

### Technology Choices

**Chosen:**

- shadcn/ui over Material-UI (better customization)
- Vitest over Jest (faster, better ESM support)
- Playwright over Cypress (better TypeScript support)
- Sanity over other CMS (better DX, GROQ queries)

**Rejected:**

- Redux/Zustand (Server Components handle state)
- CSS-in-JS (Tailwind sufficient)
- Multiple themes (unnecessary complexity)

## Common Patterns

### Server Component Data Fetching

```typescript
export default async function Page() {
  const data = await fetchData(); // Server-side only
  return <Component data={data} />;
}
```

### Client Component with Interactivity

```typescript
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState(initial);
  return <button onClick={() => setState(...)}>...</button>;
}
```

### Type-Safe Form Handling

```typescript
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})
type FormData = z.infer<typeof schema>
```

### Image Optimization

```typescript
import { urlFor } from '@/lib/sanity/client';
<Image src={urlFor(image).width(800).url()} alt={alt} />
```

### Error Handling

```typescript
export async function fetchData() {
  try {
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching data:', error)
    return [] // Safe fallback
  }
}
```

## Development Workflow

### Starting Development

```bash
npm run dev              # Start Next.js dev server
open http://localhost:3001
```

### Content Management

```bash
# Open deployed studio
open https://liamwest.sanity.studio

# Or access via app
open http://localhost:3001/studio
```

### Testing

```bash
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Coverage report
```

### Code Quality

```bash
npm run lint             # Check ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
```

### Deployment

```bash
# Automatic on push to main
git push origin main
# Vercel auto-deploys
```

## File Naming Conventions

- **Components:** PascalCase - `Button.tsx`, `ProjectCard.tsx`
- **Pages:** lowercase - `page.tsx`, `layout.tsx`
- **Utilities:** camelCase - `client.ts`, `utils.ts`
- **Types:** PascalCase - `Project`, `SkillCategory`
- **Tests:** `ComponentName.test.tsx`

## Environment Variables

**Not used** - All configuration is hardcoded for this project:

- Project ID: `40f0qafr`
- Dataset: `portfolio`
- API Version: `2024-01-01`

If environment variables were needed:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=40f0qafr
NEXT_PUBLIC_SANITY_DATASET=portfolio
```

## Important Notes

### Sanity Configuration

- **Always use `portfolio` dataset** - NOT production
- **Studio is external** - Don't embed in Next.js app
- **PDF URLs are transformed** - Sanity CDN → local proxy
- **API version is locked** - 2024-01-01

### Component Guidelines

- **Server Components default** - Add 'use client' only when needed
- **Props interfaces required** - No inline types
- **JSDoc for complex props** - Improve developer experience
- **Atomic design structure** - atoms → molecules → organisms

### Code Quality Rules

- **No `any` types** - Use `unknown` with guards
- **Strict TypeScript** - All checks enabled
- **Test before push** - Pre-commit hooks enforce
- **Format on save** - Prettier integration

## Resources

### Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Sanity Documentation](https://www.sanity.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project Files

- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions
- [README.md](../README.md) - Project overview
- [package.json](../package.json) - Dependencies

### Skills

- `.claude/skills/typescript-patterns.skill` - Type safety patterns
- `.claude/skills/theme-and-brand.skill` - Design system
- `.claude/skills/sanity-studio.skill` - CMS management
- `.claude/skills/sanity-query.skill` - GROQ queries
- `.claude/skills/playwright-testing.skill` - E2E testing
- `.claude/skills/wcag-accessibility.skill` - Accessibility standards

## Questions or Changes?

When making architectural decisions:

1. Review this document
2. Check relevant skills
3. Discuss with Claude or use general-purpose agent
4. Update this document if patterns change
5. Consider creating ADR if decision is significant

**Last reviewed:** 2025-11-11
