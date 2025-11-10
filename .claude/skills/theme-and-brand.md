# Theme and Brand Skill

## Description

Apply Liam West Portfolio's design system, brand colors, typography, and visual identity consistently across all components and pages. Ensures modern, professional aesthetic with a flexible theme system supporting light/dark modes and multiple color themes.

## When to Use

- Creating new UI components
- Designing page layouts
- Styling forms and interactive elements
- Making design decisions
- Building professional, modern user experiences
- Implementing theme switching functionality

## Brand Identity

### Mission & Voice

**Mission**: Showcase engineering and data engineering projects with a clean, modern, professional aesthetic that emphasizes technical excellence and attention to detail.

**Brand Voice**:

- **Professional and confident**: Technical expertise without being pretentious
- **Clean and modern**: Contemporary design patterns
- **Detail-oriented**: Precision in both code and design
- **Accessible**: Easy to navigate and understand

**Tone Guidelines**:

- Direct and clear communication
- Focus on results and impact
- Technical depth without jargon overload
- Professional but approachable

---

## Color Palette

### Philosophy

Colors should reflect **professionalism, technical precision, and modern design**. The system supports **four distinct themes** with both light and dark modes, each with carefully chosen color harmonies.

### Theme System Architecture

The portfolio uses **CSS custom properties** with \`data-theme\` attributes for dynamic theme switching:

\`\`\`html
<!-- Theme attributes -->
<html data-theme="slate" class="dark">
<html data-theme="lime">
<html data-theme="peach">
<html data-theme="ocean" class="dark">
\`\`\`

### Semantic Color Variables

All themes use the same semantic variable names for consistency:

\`\`\`css
--primary         /* Main brand color */
--primary-light   /* Lighter variant */
--primary-dark    /* Darker variant */
--primary-foreground  /* Text on primary */

--accent          /* Accent/highlight color */
--accent-light
--accent-dark
--accent-foreground

--background      /* Page background */
--foreground      /* Primary text */
--card            /* Card backgrounds */
--card-foreground /* Text on cards */
--secondary       /* Secondary UI elements */
--secondary-foreground
--muted           /* Muted backgrounds */
--muted-foreground /* Muted text */
--border          /* Border color */
--input           /* Input borders */
--input-background
--ring            /* Focus rings */
--destructive     /* Error/danger states */
--destructive-foreground
\`\`\`

---

## Available Themes

### 1. Slate (Default)

**Light Mode**:
- Primary: \`#334155\` (slate-700)
- Accent: \`#0ea5e9\` (sky blue)
- Background: \`#ffffff\` (white)
- Professional, neutral, versatile

**Dark Mode** (Default):
- Primary: \`#64748b\` (slate-500)
- Accent: \`#38bdf8\` (light sky blue)
- Background: \`#0f172a\` (slate-950)
- Modern, easy on eyes, tech-industry standard

### 2. Lime

**Light Mode**:
- Primary: \`#4d7c0f\` (lime-700)
- Accent: \`#65a30d\` (lime-600)
- Background: \`#fefff5\` (warm white)
- Fresh, energetic, growth-oriented

**Dark Mode**:
- Primary: \`#a3e635\` (lime-400)
- Accent: \`#d9f99d\` (lime-200)
- Background: \`#18181b\` (zinc-900)
- Vibrant, energetic, stands out

### 3. Peach

**Light Mode**:
- Primary: \`#ec4899\` (pink-500)
- Accent: \`#be185d\` (pink-700)
- Background: \`#fff5f7\` (warm pink-tinted white)
- Warm, creative, approachable

**Dark Mode**:
- Primary: \`#f9a8d4\` (pink-300)
- Accent: \`#ec4899\` (pink-500)
- Background: \`#18181b\` (zinc-900)
- Bold, creative, memorable

### 4. Ocean

**Light Mode**:
- Primary: \`#1e40af\` (blue-800)
- Accent: \`#0284c7\` (sky-600)
- Background: \`#f0f9ff\` (light blue-tinted)
- Trust, reliability, professional

**Dark Mode**:
- Primary: \`#60a5fa\` (blue-400)
- Accent: \`#7dd3fc\` (sky-300)
- Background: \`#0f172a\` (slate-950)
- Calm, professional, tech-focused

---

## Typography

### Font Stack

\`\`\`css
--font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
\`\`\`

**Why Inter:**
- Modern, highly readable sans-serif
- Professional without being corporate
- Excellent for technical content
- Great web performance
- Designed for screens

### Type Scale

\`\`\`css
--font-size-xs: 0.75rem;    /* 12px - Fine print */
--font-size-sm: 0.875rem;   /* 14px - Supporting text */
--font-size-base: 1rem;     /* 16px - Body text */
--font-size-lg: 1.125rem;   /* 18px - Emphasis */
--font-size-xl: 1.25rem;    /* 20px - Subheadings */
--font-size-2xl: 1.5rem;    /* 24px - Card titles */
--font-size-3xl: 1.875rem;  /* 30px - Section headings */
--font-size-4xl: 2.25rem;   /* 36px - Page titles */
--font-size-5xl: 3rem;      /* 48px - Hero text */
--font-size-6xl: 3.75rem;   /* 60px - Large hero */
--font-size-7xl: 4.5rem;    /* 72px - Extra large */
\`\`\`

### Font Weights

\`\`\`css
--font-weight-normal: 400;     /* Body text */
--font-weight-medium: 500;     /* Emphasis */
--font-weight-semibold: 600;   /* Subheadings */
--font-weight-bold: 700;       /* Headings */
--font-weight-extrabold: 800;  /* Hero headings */
\`\`\`

---

## Spacing & Layout

### Container

\`\`\`css
--container-max-width: 75rem; /* 1200px */
\`\`\`

### Spacing Scale

\`\`\`css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-xxl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
\`\`\`

### Border Radius

\`\`\`css
--radius-sm: 0.25rem;    /* 4px - Subtle */
--radius-md: 0.5rem;     /* 8px - Default */
--radius-lg: 0.75rem;    /* 12px - Cards, buttons */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-full: 9999px;   /* Pills, avatars */
\`\`\`

### Shadows

\`\`\`css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
\`\`\`

---

## Best Practices

### 1. Always Use CSS Variables

\`\`\`css
/* ✅ Good */
color: var(--foreground);
background-color: var(--card);

/* ❌ Bad */
color: #f8fafc;
background-color: #1e293b;
\`\`\`

### 2. Theme-Agnostic Components

Build components that work with any theme by using semantic variables:

\`\`\`css
/* ✅ Good - works with all themes */
.card {
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}

/* ❌ Bad - hardcoded to slate theme */
.card {
  background-color: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
}
\`\`\`

### 3. Consistent Spacing

Use spacing variables for consistent rhythm:

\`\`\`css
.container {
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}
\`\`\`

### 4. Responsive Design

Use mobile-first responsive patterns.

---

## Accessibility

### Color Contrast

All theme combinations meet **WCAG AA** standards (4.5:1 minimum for normal text).

### Focus States

Always provide visible focus indicators:

\`\`\`css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
\`\`\`

---

## Notes

- **Theme system is CSS-variable based** - all components automatically adapt to theme changes
- **Four distinct themes** - Slate (default), Lime, Peach, Ocean
- **Light and dark modes** - each theme supports both
- **Fully accessible** - WCAG AA compliant color contrasts
- **Modern and professional** - clean, contemporary aesthetic
