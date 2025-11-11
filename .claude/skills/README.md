# Skills Index for Liam West Portfolio

**Purpose**: This directory contains Claude Code skills that codify development patterns, workflows, and technical standards for the Liam West portfolio website project.

---

## Table of Contents

- [Quick Reference](#quick-reference)
- [Getting Started](#getting-started)
- [Skills by Category](#skills-by-category)
- [Skill Usage Guide](#skill-usage-guide)

---

## Quick Reference

### What Are Skills?

Skills are packaged knowledge files (.skill) that teach Claude Code domain-specific patterns for this project. Each skill contains:

- **Description**: What the skill does and its value
- **When to Use**: Specific scenarios for invocation
- **Example Usage**: Real code examples from the project
- **Best Practices**: Standards enforced by the skill

### Project Context

**Liam West Portfolio** is a modern portfolio website showcasing aerospace engineering projects, work experience, education, and achievements.

**Technology Stack**:

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **CMS**: Sanity v3 (headless content management)
- **Testing**: Vitest + React Testing Library
- **Hosting**: Vercel
- **Studio**: Sanity Studio at `/studio` route

**Content Types**:

- Projects (featured portfolio projects with images, PDFs, tags)
- Experience (work experience and internships)
- Education (degrees and certifications)
- Skills (technical skills with proficiency levels)
- Resume (PDF and metadata)

---

## Skills by Category

### 🏗️ Architecture & Component Organization

#### [atomic-design.skill](./atomic-design.skill)

Component hierarchy and organization using Atomic Design methodology.

**When to use**: Creating new components, refactoring component structure, organizing UI elements

**Key features**:

- Atoms (Button, Badge, Input, Label, etc.)
- Molecules (SearchBar, FormField, ProjectCard)
- Organisms (Header, Footer, ContactForm, ProjectGrid)
- Templates (page layouts)
- Proper component composition

---

### 🎨 Design & Styling

#### [tailwind-elegant-sites.skill](./tailwind-elegant-sites.skill)

Utility-first Tailwind patterns with automated enforcement rules.

**When to use**: Styling components, implementing responsive designs, creating layouts

**Key features**:

- Utility-first approach (no CSS modules)
- Automated enforcement tests
- Design token usage (bg-primary, text-foreground)
- CVA pattern for variants
- Concentric class ordering
- Mobile-first responsive design

#### [shadcn-ui.skill](./shadcn-ui.skill)

Component library built on Radix UI + Tailwind utilities.

**When to use**: Adding UI components, forms, dialogs, navigation

**Key features**:

- Copy-paste components (not npm package)
- Accessible by default (Radix UI primitives)
- Customizable with Tailwind
- Card, Button, Badge, Input, Dialog, Select, Tabs, etc.

#### [theme-and-brand.skill](./theme-and-brand.skill)

Design system with color themes and brand guidelines.

**When to use**: Making design decisions, implementing theme switching, maintaining visual consistency

**Key features**:

- CSS custom properties
- Light/dark mode support
- Color system (primary, secondary, accent, muted)
- Typography scale
- Spacing and layout system
- WCAG AA accessibility

---

### 📝 Content Management (Project-Specific)

#### [sanity-studio.skill](./sanity-studio.skill)

Content modeling, schema creation, and Studio configuration for portfolio content.

**When to use**: Creating/modifying document types, defining schemas, managing content fields, validations

**Content types**: project, experience, education, skill, resume

**Key features**:

- Schema-driven content models
- Image and file uploads
- Custom field validation
- Preview configuration
- Document ordering

#### [sanity-query.skill](./sanity-query.skill)

GROQ queries to fetch portfolio content with proper field selection and filtering.

**When to use**: Fetching projects, filtering featured content, querying by tags, single document retrieval

**Key features**:

- Type-safe GROQ queries
- Field projection patterns
- Image/file asset URLs
- Filtering and sorting
- Pagination

---

### 🧪 Testing (Project-Specific Patterns)

#### [vitest-testing.skill](./vitest-testing.skill)

Unit testing patterns specific to this project's component structure and mocking needs.

**When to use**: Writing component tests, testing utility functions, mocking Sanity/Next.js dependencies

**Key features**:

- Component testing patterns
- User interaction testing (userEvent)
- Mocking (Next.js Image, Link, Sanity client)
- Async testing
- Query priorities (getByRole, getByLabelText)
- Coverage reporting

---

## Skill Usage Guide

### How to Use Skills Effectively

#### 1. **Start with Context**

When working on a feature, identify which skills are relevant:

- Adding a new component? → Atomic Design, Tailwind, shadcn/ui
- Testing components? → Vitest
- Fetching data? → Sanity Query
- Adding content types? → Sanity Studio

#### 2. **Reference Skills Explicitly**

You can ask Claude Code to use specific skills:

```
"Use the sanity-query skill to fetch all featured projects"
"Follow the tailwind-elegant-sites skill when styling this card"
"Apply the atomic-design skill to refactor this component"
```

#### 3. **Combine Multiple Skills**

Complex features often require multiple skills:

```
"Create a new project showcase page following:
- Sanity Query (fetch projects)
- Atomic Design (component structure)
- Tailwind + shadcn (styling)
- Vitest (unit tests)"
```

---

## Current Project Patterns

### Utility-First Enforcement

The project uses **automated utility-first enforcement** to prevent CSS module creep:

**Test**: `src/lib/__tests__/utility-first.test.ts`
**Script**: `scripts/check-utility-first.js`
**Command**: `npm run check:utility-first`

Related skill: [tailwind-elegant-sites.skill](./tailwind-elegant-sites.skill)

### Component Architecture

Components follow **Atomic Design** hierarchy:

```
src/components/
├── ui/
│   ├── atoms/        # Button, Badge, Input, Label
│   ├── molecules/    # SearchBar, FormField
│   └── organisms/    # Header, Footer, ProjectGrid
└── templates/        # Page layouts
```

Related skill: [atomic-design.skill](./atomic-design.skill)

### Content Architecture

All portfolio content is managed in Sanity with document types:

1. **project** - Portfolio projects (featured flag, images, PDFs, tags)
2. **experience** - Work experience (role, company, period, achievements)
3. **education** - Educational background (degree, school, year)
4. **skill** - Technical skills with proficiency levels
5. **resume** - Resume PDF and metadata

Related skills: [sanity-studio.skill](./sanity-studio.skill), [sanity-query.skill](./sanity-query.skill)

---

## Quick Reference Table

| Skill                                                          | Category     | Primary Use Case      | Why Not Context 7?             |
| -------------------------------------------------------------- | ------------ | --------------------- | ------------------------------ |
| [atomic-design.skill](./atomic-design.skill)                   | Architecture | Component hierarchy   | Your specific folder structure |
| [tailwind-elegant-sites.skill](./tailwind-elegant-sites.skill) | Design       | Utility-first styling | Your enforcement rules         |
| [shadcn-ui.skill](./shadcn-ui.skill)                           | Design       | UI components         | Your customizations            |
| [theme-and-brand.skill](./theme-and-brand.skill)               | Design       | Design system         | Your color tokens              |
| [sanity-studio.skill](./sanity-studio.skill)                   | Content      | Schema management     | Your content model             |
| [sanity-query.skill](./sanity-query.skill)                     | Content      | GROQ queries          | Your query patterns            |
| [vitest-testing.skill](./vitest-testing.skill)                 | Testing      | Unit tests            | Your mocking patterns          |

**Total Active Skills**: 7

**Archived Skills** (covered by Context 7): nextjs-16, typescript-patterns, eslint-prettier-standards, tsdoc-typedoc, playwright-testing, wcag-accessibility

**Backups available in**: `../../.archived-skills/`

---

## Project Structure

```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx      # About page
│   │   ├── projects/page.tsx   # Projects page
│   │   ├── contact/page.tsx    # Contact page
│   │   └── studio/             # Sanity Studio route
│   ├── components/
│   │   ├── ui/
│   │   │   ├── atoms/          # Basic UI elements
│   │   │   ├── molecules/      # Composed components
│   │   │   └── organisms/      # Complex sections
│   │   └── templates/          # Page layouts
│   ├── lib/
│   │   ├── sanity/             # Sanity client & queries
│   │   ├── utils.ts            # Utility functions (cn)
│   │   └── __tests__/          # Unit tests
│   ├── types/                  # TypeScript types
│   └── config/                 # Configuration
├── sanity/                     # Sanity Studio config
│   └── schemaTypes/
│       ├── project.ts
│       ├── experience.ts
│       ├── education.ts
│       ├── skill.ts
│       └── resume.ts
├── tests/                      # E2E tests
│   ├── e2e/                    # Functional tests
│   └── accessibility/          # A11y tests
├── docs/                       # Generated documentation
├── scripts/                    # Build/utility scripts
├── tailwind.config.ts          # Tailwind configuration
├── vitest.config.ts            # Vitest configuration
├── playwright.config.ts        # Playwright configuration
├── typedoc.json                # TypeDoc configuration
├── eslint.config.mjs           # ESLint configuration
└── package.json
```

---

## Testing Strategy

### Unit Tests (Vitest + RTL)

- **Location**: `src/components/__tests__/`, `src/lib/__tests__/`
- **Command**: `npm test`
- **Coverage**: 121 passing tests
- **Patterns**: Component behavior, user interactions, edge cases

### Enforcement Tests

- **Location**: `src/lib/__tests__/utility-first.test.ts`
- **Command**: `npm run check:utility-first`
- **Coverage**: CSS module detection, design token usage, CVA patterns
- **Purpose**: Prevent utility-first violations

Related skills: [vitest-testing.skill](./vitest-testing.skill), [tailwind-elegant-sites.skill](./tailwind-elegant-sites.skill)

---

## Resources

### Project Documentation

- `docs/TESTING-SUMMARY.md` - Testing overview and best practices
- `docs/UTILITY-FIRST-ENFORCEMENT.md` - Enforcement rules and examples
- `docs/` - Generated TypeDoc documentation

### External Resources

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Sanity CMS Docs](https://www.sanity.io/docs)
- [Vitest Docs](https://vitest.dev)
- [Vercel Docs](https://vercel.com/docs)

---

## Contributing

When adding new skills or updating existing ones:

1. **Use the .skill format** - Package skills properly with SKILL.md and references
2. **Use real code examples** from this project (not placeholders)
3. **Update this README** to include the new skill in the appropriate category
4. **Test the skill** by using it in a real scenario

---

**Last Updated**: November 2025
**Project**: Liam West Portfolio
**Skills Version**: 3.1 (Optimized for Context 7)
**Total Active Skills**: 7 (project-specific only)
