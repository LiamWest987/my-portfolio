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

Skills are structured markdown files that teach Claude Code domain-specific patterns for this project. Each skill contains:

- **Description**: What the skill does and its value
- **When to Use**: Specific scenarios for invocation
- **Example Usage**: Real code examples from the project
- **Best Practices**: Standards enforced by the skill

### Project Context

**Liam West Portfolio** is a modern portfolio website showcasing engineering and data engineering projects, work experience, education, and achievements.

**Technology Stack**:
- **Frontend**: Vite (build tool), Vanilla JavaScript (ES6 modules)
- **CMS**: Sanity v3 (headless content management)
- **Styling**: Custom CSS with theme system (light/dark modes + 4 color themes)
- **Hosting**: Vercel
- **Studio**: Sanity Studio (hosted at https://40f0qafr.sanity.studio)

**Content Types**:
- Projects (featured portfolio projects with images, PDFs, tags)
- Experience (work experience and internships)
- Education (degrees and certifications)
- Awards (achievements and recognitions)
- Skill Categories (technical skills organized by category)

---

## Skills by Category

### Content Management

#### [Sanity Studio](./sanity-studio.md)
Content modeling, schema creation, and Studio configuration for portfolio content.

**When to use**: Creating/modifying document types, defining schemas, managing content fields, validations

**Content types**: project, experience, education, award, skillCategory

**Key features**:
- Schema-driven content models
- Image and file uploads
- Custom field validation
- Preview configuration
- Ordering and filtering

#### [Sanity Query Builder](./sanity-query.md)
GROQ queries to fetch portfolio content with proper field selection and filtering.

**When to use**: Fetching projects, filtering featured content, querying by tags, single document retrieval

**Key features**:
- Type-safe GROQ queries
- Field projection patterns
- Image/file asset URLs
- Filtering and sorting
- Pagination

---

### Design & Styling

#### [Theme & Brand](./theme-and-brand.md)
Complete design system, color themes, typography, and brand guidelines.

**When to use**: Styling components, making design decisions, implementing theme switching

**Key features**:
- 4 color themes (Slate, Lime, Peach, Ocean)
- Light/dark mode support
- CSS custom properties
- Typography scale (Inter font)
- Spacing and layout system
- Component patterns
- WCAG AA accessibility

---

### Deployment & Infrastructure

#### [Deployment](./deployment.md)
Vercel deployment, environment management, and production workflows.

**When to use**: Deploying to production, managing environment variables, troubleshooting builds

**Tech stack**: Vercel, Vite, Sanity Studio (hosted)

**Key features**:
- Git-based deployment
- Environment variables
- Build configuration
- Performance optimization
- Monitoring and troubleshooting

---

### Code Quality (Future)

The following skills are kept for future use when adding these technologies:

#### [Accessibility Testing](./accessibility-testing.md)
WCAG 2.1 AA compliance testing patterns (for future implementation).

#### [ESLint & Prettier](./eslint-prettier.md)
Code quality and formatting standards (for future implementation).

#### [TypeScript Patterns](./typescript-patterns.md)
Type safety patterns (for future TypeScript migration).

#### [Tailwind & shadcn](./tailwind-shadcn.md)
Utility-first CSS framework (for future Tailwind adoption).

#### [Next.js App Router](./nextjs-app-router.md)
Framework patterns (for future Next.js migration).

---

## Skill Usage Guide

### How to Use Skills Effectively

#### 1. **Start with Context**

When working on a feature, identify which skills are relevant:
- Adding a new project? → Sanity Studio, Sanity Query
- Styling a component? → Theme & Brand
- Deploying? → Deployment

#### 2. **Reference Skills Explicitly**

You can ask Claude Code to use specific skills:
```
"Use the sanity-query skill to fetch all featured projects"
"Follow the theme-and-brand skill when styling this card"
"Apply the deployment skill for Vercel setup"
```

#### 3. **Combine Multiple Skills**

Complex features often require multiple skills:
```
"Create a new project showcase page following:
- Sanity Query (fetch projects)
- Theme & Brand (styling)
- Deployment (environment config)"
```

---

## Current Project Patterns

### Theme System

The portfolio uses CSS custom properties with `data-theme` attributes:

```html
<html data-theme="slate" class="dark">
```

**Themes**: Slate (default), Lime, Peach, Ocean
**Modes**: Light and Dark for each theme

Related skill: [Theme & Brand](./theme-and-brand.md)

### Content Architecture

All portfolio content is managed in Sanity with 5 document types:

1. **project** - Portfolio projects (featured flag, images, PDFs, tags)
2. **experience** - Work experience (role, company, period, achievements)
3. **education** - Educational background (degree, school, year)
4. **award** - Awards and achievements (title, issuer, category)
5. **skillCategory** - Skill categories with lists of skills

Related skills: [Sanity Studio](./sanity-studio.md), [Sanity Query](./sanity-query.md)

### Shared Components

Header and footer are shared components loaded dynamically:

```javascript
// src/js/layout.js
import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';

export function initLayout(currentPage) {
  loadHeader(currentPage);
  loadFooter();
}
```

Related skill: [Theme & Brand](./theme-and-brand.md)

---

## Quick Reference Table

| Skill | Category | Primary Use Case | Status |
|-------|----------|------------------|--------|
| [Sanity Studio](./sanity-studio.md) | Content | Schema & content management | ✅ Active |
| [Sanity Query](./sanity-query.md) | Content | GROQ queries & data fetching | ✅ Active |
| [Theme & Brand](./theme-and-brand.md) | Design | Design system & styling | ✅ Active |
| [Deployment](./deployment.md) | Infrastructure | Vercel deployment | ✅ Active |
| [Accessibility Testing](./accessibility-testing.md) | Quality | WCAG compliance | 📋 Future |
| [ESLint & Prettier](./eslint-prettier.md) | Quality | Code formatting | 📋 Future |
| [TypeScript Patterns](./typescript-patterns.md) | Development | Type safety | 📋 Future |
| [Tailwind & shadcn](./tailwind-shadcn.md) | Design | Utility CSS | 📋 Future |
| [Next.js App Router](./nextjs-app-router.md) | Development | Framework | 📋 Future |

---

## Project Structure

```
my-portfolio/
├── src/
│   ├── js/
│   │   ├── components/
│   │   │   ├── header.js      # Shared header
│   │   │   └── footer.js      # Shared footer
│   │   ├── layout.js          # Layout manager
│   │   ├── sanity.js          # Sanity client & queries
│   │   ├── dark-mode.js       # Theme system
│   │   ├── home.js            # Home page logic
│   │   ├── projects.js        # Projects page
│   │   ├── about.js           # About page
│   │   └── contact.js         # Contact page
│   └── styles/
│       ├── improved-themes.css # Theme system
│       ├── base.css           # Base styles
│       ├── components.css     # Component styles
│       └── ...
├── portfolio-website/         # Sanity Studio
│   └── schemaTypes/
│       ├── project.js
│       ├── experience.js
│       ├── education.js
│       ├── award.js
│       └── skillCategory.js
├── home.html
├── projects.html
├── about.html
├── contact.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Resources

### Project Documentation
- `.env.example` - Environment variables template
- `vercel.json` - Vercel configuration
- `vite.config.js` - Vite build configuration

### External Resources
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Vite Docs](https://vitejs.dev/guide/)
- [Sanity CMS Docs](https://www.sanity.io/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## Contributing

When adding new skills or updating existing ones:

1. **Follow the skill creation pattern** in [Skill Creation](./skill-creation.md)
2. **Use real code examples** from this project (not placeholders)
3. **Update this README** to include the new skill in the appropriate category
4. **Test the skill** by using it in a real scenario

---

**Last Updated**: January 2025
**Project**: Liam West Portfolio
**Skills Version**: 2.0
**Total Active Skills**: 4 (+ 5 future skills)
