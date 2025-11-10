# Tailwind CSS v4 & shadcn/ui Integration

## Overview

The Mordecai Collective uses Tailwind CSS v4 with its modern CSS-first configuration approach, integrated with shadcn/ui component library. This combination provides a powerful, type-safe design system with excellent developer experience and maintainability.

**Key Technologies:**
- Tailwind CSS v4.1.16 (CSS-first configuration)
- shadcn/ui with New York style
- tailwindcss-animate v1.0.7 for animations
- class-variance-authority (CVA) for component variants
- Next.js 16 with React 19

**Project Context:**
- Non-profit organization website
- Dual audiences: Givers (donors/stewards) and Builders (entrepreneurs)
- Brand-focused design with custom color palette and typography

---

## Tailwind v4 Configuration

### CSS-First Approach

Tailwind v4 eliminates `tailwind.config.js` in favor of CSS-first configuration using the `@theme` directive directly in your global stylesheet.

**Location:** `/Users/coreywest/Documents/website/app/globals.css`

### Core Setup

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@source "../components";
@source "../app";

@custom-variant dark (&:is(.dark *));
```

**Key Directives:**
- `@import "tailwindcss"` - Import the Tailwind framework
- `@plugin` - Load Tailwind plugins (replaces config.plugins)
- `@source` - Define content sources for class scanning
- `@custom-variant` - Define custom variants for dark mode

### @theme Directive

The `@theme` block replaces the traditional `theme` section in tailwind.config.js:

```css
@theme {
  --font-size: 16px;

  /* Font families from Next.js font loaders */
  --font-family-sans: var(--font-sans);
  --font-family-serif: var(--font-serif);
  --font-family-display: var(--font-display);

  /* Brand Colors */
  --color-navy: #0B1F3A;
  --color-gold: #D4A24C;
  --color-ivory: #F5F4F0;
  --color-taupe: #A69C91;
  --color-teal: #2A5D62;

  /* Semantic Color Tokens */
  --color-background: #F5F4F0;
  --color-foreground: #0B1F3A;
  --color-primary: #0B1F3A;
  --color-primary-foreground: #F5F4F0;
  --color-secondary: #2A5D62;
  --color-secondary-foreground: #F5F4F0;
  --color-accent: #D4A24C;
  --color-accent-foreground: #0B1F3A;

  /* Border Radius System */
  --radius: 0.625rem;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

**Usage in HTML/JSX:**
```tsx
// Direct usage via CSS variables
className="bg-navy text-ivory rounded-lg"

// Via semantic tokens
className="bg-primary text-primary-foreground"
```

### Migration from Tailwind v3

**What Changed:**
1. No more `tailwind.config.js` file needed
2. Configuration moved to CSS with `@theme` directive
3. Plugins loaded via `@plugin` directive
4. Content scanning via `@source` directive
5. Custom variants defined in CSS with `@custom-variant`

**Migration Steps:**
```css
// OLD (tailwind.config.js)
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
      }
    }
  }
}

// NEW (globals.css)
@source "../app";

@theme {
  --color-navy: #0B1F3A;
}
```

---

## The Mordecai Collective Theme

### Brand Colors

Our brand uses a carefully curated palette inspired by biblical themes and professional elegance:

```css
@theme {
  /* Primary Palette */
  --color-navy: #0B1F3A;      /* Deep Navy - Authority, wisdom, trust */
  --color-gold: #D4A24C;       /* Gold/Amber - Generosity, warmth, value */
  --color-teal: #2A5D62;       /* Teal - Growth, innovation, builder energy */
  --color-ivory: #F5F4F0;      /* Ivory - Clean, peaceful, light */
  --color-taupe: #A69C91;      /* Taupe - Understated elegance, stability */
}
```

**Semantic Mapping:**
- **Primary**: Navy (#0B1F3A) - Main brand color, headers, primary buttons
- **Secondary**: Teal (#2A5D62) - Builder-focused elements
- **Accent**: Gold (#D4A24C) - Giver-focused elements, calls-to-action
- **Background**: Ivory (#F5F4F0) - Page backgrounds
- **Foreground**: Navy (#0B1F3A) - Body text

**Audience-Specific Colors:**
```tsx
// Giver elements use Gold accent
<Button className="bg-accent text-foreground">
  Explore the Giver Path
</Button>

// Builder elements use Teal secondary
<Button className="bg-secondary text-background">
  Explore the Builder Path
</Button>
```

### Typography System

Three complementary typefaces create hierarchy and brand personality:

**Font Configuration (app/layout.tsx):**
```tsx
import { Plus_Jakarta_Sans, Merriweather, Montserrat } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});
```

**Font Roles:**
1. **Plus Jakarta Sans** (`font-sans`) - Body text, UI elements, forms
2. **Merriweather** (`font-serif`) - Articles, long-form content, quotes
3. **Montserrat** (`font-display`) - Headlines, hero text, prominent CTAs

**Usage:**
```tsx
// Body text (default)
<p className="font-sans">Regular paragraph text</p>

// Headlines
<h1 className="font-display text-4xl font-bold">Hero Headline</h1>

// Long-form content
<article className="font-serif prose">
  <p>Article content...</p>
</article>

// CTA buttons
<Button className="font-display">
  Take Action
</Button>
```

### Spacing and Sizing System

Uses Tailwind's default spacing scale (0.25rem increments):

```tsx
// Common spacing patterns
className="p-8"          // padding: 2rem (32px)
className="mb-6"         // margin-bottom: 1.5rem (24px)
className="gap-4"        // gap: 1rem (16px)
className="space-y-2.5"  // vertical spacing: 0.625rem (10px)

// Responsive spacing
className="py-16 sm:py-24"  // Mobile: 4rem, Desktop: 6rem
className="p-8 sm:p-10"     // Mobile: 2rem, Desktop: 2.5rem
```

### Border Radius System

```css
@theme {
  --radius: 0.625rem;                    /* Base: 10px */
  --radius-sm: calc(var(--radius) - 4px);  /* 6px */
  --radius-md: calc(var(--radius) - 2px);  /* 8px */
  --radius-lg: var(--radius);              /* 10px */
  --radius-xl: calc(var(--radius) + 4px);  /* 14px */
}
```

**Usage:**
```tsx
// Standard components
className="rounded-md"    // 8px - buttons, inputs
className="rounded-lg"    // 10px - cards
className="rounded-xl"    // 12px - larger cards
className="rounded-2xl"   // 16px - hero cards
className="rounded-3xl"   // 24px - feature cards (custom)
```

### Shadows

Uses Tailwind's default shadow utilities:

```tsx
// Subtle elevation
className="shadow-sm"

// Card hover states
className="shadow-sm hover:shadow-xl"

// Layered interface elements
className="shadow-lg"
```

---

## shadcn/ui Integration

### Installation

```bash
npx shadcn@latest init
```

**Configuration prompts:**
- Style: `new-york`
- Base color: `neutral`
- CSS variables: `true`
- TypeScript: `true`
- Import alias: `@/*`

### components.json Configuration

**Location:** `/Users/coreywest/Documents/website/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Key Settings:**
- `rsc: false` - Not using React Server Components in components
- `cssVariables: true` - Use CSS variable-based theming
- `prefix: ""` - No prefix for Tailwind classes
- `iconLibrary: "lucide"` - Using Lucide React icons

### Adding Components

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form

# Add multiple components
npx shadcn@latest add button card input form
```

Components are installed to `/Users/coreywest/Documents/website/components/ui/`

### Component Architecture

shadcn/ui components follow these patterns:

1. **Compound Components** - Multi-part components with semantic structure
2. **CSS Variable Theming** - All colors use CSS variables
3. **Radix UI Primitives** - Accessible, unstyled foundations
4. **Class Variance Authority (CVA)** - Type-safe variant management

---

## Animation Library

### tailwindcss-animate

**Installation:**
```bash
npm install tailwindcss-animate
```

**Configuration:**
```css
@plugin "tailwindcss-animate";
```

### Available Animations

**Preset Animations:**
```tsx
// Fade effects
className="animate-in fade-in"
className="animate-out fade-out"

// Slide effects
className="slide-in-from-top"
className="slide-in-from-bottom"
className="slide-in-from-left"
className="slide-in-from-right"

// Zoom effects
className="zoom-in"
className="zoom-out"

// Combined animations
className="animate-in fade-in slide-in-from-bottom duration-500"
```

**Common Patterns:**
```tsx
// Dialog entrance
className="animate-in fade-in-0 zoom-in-95 duration-200"

// Sheet slide-in
className="animate-in slide-in-from-right duration-300"

// Dropdown
className="animate-in fade-in-0 slide-in-from-top-2"
```

### Custom Animations

Add custom animations via CSS:

```css
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
```

---

## Component Patterns

### Button Variants

**Location:** `/Users/coreywest/Documents/website/components/ui/button.tsx`

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background text-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**Usage Examples:**
```tsx
// Primary CTA
<Button variant="default">
  Get Started
</Button>

// Giver-specific button (accent color)
<Button className="bg-accent text-foreground hover:bg-accent/90">
  Explore the Giver Path
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// Builder-specific button (secondary color)
<Button className="bg-secondary text-background hover:bg-secondary/90">
  Explore the Builder Path
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// Outlined button
<Button variant="outline" size="lg">
  Learn More
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
</Button>
```

### Card Components

**Location:** `/Users/coreywest/Documents/website/components/ui/card.tsx`

**Component Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
    <CardAction>
      {/* Action button/icon */}
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Main card content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

**Real-World Example (Audience Selection):**
```tsx
// Giver Card
<div className="group relative overflow-hidden rounded-3xl border border-accent/20 bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl sm:p-10">
  {/* Icon */}
  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent/20">
    <Gift className="h-7 w-7 text-accent" />
  </div>

  <h3 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
    Givers
  </h3>

  <p className="mb-6 text-foreground/60 leading-relaxed">
    You see resources as tools for Kingdom impact...
  </p>

  <ul className="space-y-2.5 text-foreground/60">
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"></span>
      <span>Biblical principles of generosity</span>
    </li>
  </ul>

  <Button className="font-display w-full bg-accent text-foreground hover:bg-accent/90 sm:w-auto">
    Explore the Giver Path
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
</div>
```

**Pattern Notes:**
- Uses `group` utility for coordinated hover effects
- Opacity variants for subtle color accents (`accent/10`, `accent/20`)
- Responsive padding and text sizing
- Custom border radius (`rounded-3xl`)
- Transition timing for smooth interactions

### Form Components

**Input Component:**
```tsx
<Input
  type="email"
  placeholder="Enter your email"
  className="w-full"
/>
```

**Styled Input Patterns:**
```css
.input-base {
  @apply border-input bg-input-background flex h-9 w-full rounded-md border px-3 py-1;
  @apply focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px];
  @apply aria-invalid:ring-destructive/20 aria-invalid:border-destructive;
}
```

**Features:**
- Focus ring with custom color (`ring-ring/50`)
- Error states with `aria-invalid` attribute
- Disabled state styling
- File input styling
- Placeholder text color
- Selection highlighting

### Layout Components

**Container Pattern:**
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**Section Pattern:**
```tsx
<section className="bg-background py-16 sm:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

**Grid Layouts:**
```tsx
// Two-column responsive grid
<div className="grid gap-6 md:grid-cols-2 lg:gap-8">
  {/* Grid items */}
</div>

// Three-column grid
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* Grid items */}
</div>
```

---

## Color System

### OKLCH Color Space

Tailwind v4 defaults to OKLCH color space for better perceptual uniformity:

```css
@theme {
  /* OKLCH format: oklch(lightness chroma hue) */
  --color-popover: oklch(1 0 0);         /* Pure white */
  --color-ring: oklch(0.708 0 0);        /* Neutral gray */
  --color-chart-1: oklch(0.646 0.222 41.116);  /* Vibrant color */
}
```

**Benefits:**
- Perceptually uniform lightness
- More vibrant colors at same lightness
- Better for programmatic color manipulation
- Improved accessibility for color contrast

**Mixing Hex and OKLCH:**
```css
/* You can use both formats */
--color-navy: #0B1F3A;                    /* Hex for brand colors */
--color-ring: oklch(0.708 0 0);          /* OKLCH for grays */
```

### CSS Variables for Theme Tokens

**Two-Layer System:**

1. **@theme layer** (Tailwind-specific):
```css
@theme {
  --color-primary: #0B1F3A;
  --color-accent: #D4A24C;
}
```

2. **:root layer** (Standard CSS):
```css
:root {
  --primary: #0B1F3A;
  --accent: #D4A24C;
}
```

**Why Both?**
- `@theme` variables are used by Tailwind utilities
- `:root` variables for direct CSS usage and custom components
- Duplication ensures compatibility across the system

**Usage:**
```tsx
// Tailwind utilities (uses @theme)
className="bg-primary text-primary-foreground"

// Direct CSS (uses :root)
style={{ backgroundColor: 'var(--primary)' }}
```

### Dark Mode Support

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... more dark theme colors */
}
```

**Dark Variant Usage:**
```tsx
className="bg-background dark:bg-background"
className="text-foreground dark:text-foreground"
```

**Dark Mode Toggle (Next.js):**
```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
```

### Accessibility Considerations

**WCAG AA Compliance:**

```tsx
// High contrast combinations
className="bg-navy text-ivory"           // 12.8:1 contrast
className="bg-primary text-primary-foreground"  // >= 4.5:1

// Avoid low contrast
// ❌ className="bg-ivory text-taupe"    // Too low
// ✅ className="bg-ivory text-navy"     // Good contrast
```

**Focus States:**
```tsx
// All interactive elements have visible focus rings
className="focus-visible:ring-ring/50 focus-visible:ring-[3px]"
```

**Error States:**
```tsx
// Destructive actions have clear visual feedback
className="aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
```

**Testing:**
```bash
# Install axe-core for automated accessibility testing
npm install @axe-core/playwright
```

---

## Responsive Design

### Mobile-First Approach

All styling starts with mobile and expands upward:

```tsx
// Base styles apply to mobile
className="text-base px-4 py-2"

// Tablet and up
className="text-base sm:text-lg px-4 sm:px-6"

// Desktop
className="text-base sm:text-lg lg:text-xl px-4 sm:px-6 lg:px-8"
```

### Breakpoint System

Tailwind's default breakpoints:

```css
/* Mobile first (no prefix) */
/* default: 0px and up */

sm:  /* 640px and up */
md:  /* 768px and up */
lg:  /* 1024px and up */
xl:  /* 1280px and up */
2xl: /* 1536px and up */
```

**Common Patterns:**
```tsx
// Hide on mobile, show on desktop
className="hidden lg:block"

// Stack on mobile, grid on desktop
className="flex flex-col md:grid md:grid-cols-2"

// Full width on mobile, constrained on desktop
className="w-full sm:w-auto"

// Responsive text sizing
className="text-3xl sm:text-4xl md:text-5xl"

// Responsive spacing
className="mb-12 sm:mb-16"
className="py-16 sm:py-24"
className="gap-6 lg:gap-8"
```

### Container Queries

Tailwind v4 supports container queries for component-level responsive design:

```tsx
// Enable container queries
<div className="@container">
  <div className="@lg:grid-cols-2">
    {/* Content adapts to container size, not viewport */}
  </div>
</div>
```

**Example from Card Component:**
```tsx
<div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5">
  {/* Layout adapts to card header size */}
</div>
```

**Benefits:**
- Component-level responsive behavior
- Reusable components across different contexts
- More granular control than viewport breakpoints

---

## Examples from The Mordecai Collective

### Real Button Components

**Primary Navy Button:**
```tsx
<Button variant="default">
  Get Started
</Button>
// Renders: Deep navy background, ivory text
```

**Giver-Specific Gold Button:**
```tsx
<Button className="font-display w-full bg-accent text-foreground hover:bg-accent/90 sm:w-auto">
  Explore the Giver Path
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
// Renders: Gold background, navy text, Montserrat font
// Full width on mobile, auto width on desktop
```

**Builder-Specific Teal Button:**
```tsx
<Button className="font-display w-full bg-secondary text-background hover:bg-secondary/90 sm:w-auto">
  Explore the Builder Path
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
// Renders: Teal background, ivory text
```

### Card Patterns for Articles/Studies

**Feature Card Pattern:**
```tsx
<div className="group relative overflow-hidden rounded-3xl border border-accent/20 bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl sm:p-10">
  {/* Icon with background */}
  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent/20">
    <Icon className="h-7 w-7 text-accent" />
  </div>

  {/* Title */}
  <h3 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
    Card Title
  </h3>

  {/* Description */}
  <p className="mb-6 text-foreground/60 leading-relaxed">
    Card description text...
  </p>

  {/* List with bullet points */}
  <ul className="mb-8 space-y-2.5 text-foreground/60">
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"></span>
      <span>List item text</span>
    </li>
  </ul>

  {/* CTA Button */}
  <Button className="w-full sm:w-auto">
    Call to Action
  </Button>
</div>
```

**Key Techniques:**
- `group` hover effects for coordinated animations
- Semi-transparent color layers (`accent/10`, `accent/20`)
- Custom bullet points using colored dots
- Responsive sizing and spacing
- Smooth transitions on all interactive elements

### Form Styling

**Newsletter Signup Pattern:**
```tsx
<form className="flex flex-col gap-4 sm:flex-row">
  <Input
    type="email"
    placeholder="Enter your email"
    className="flex-1"
  />
  <Button type="submit" className="bg-accent text-foreground hover:bg-accent/90">
    Subscribe
  </Button>
</form>
```

**Contact Form Pattern:**
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="John Doe" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="john@example.com" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" rows={4} placeholder="Your message..." />
  </div>

  <Button type="submit" className="w-full bg-primary text-primary-foreground">
    Send Message
  </Button>
</form>
```

### Audience-Specific Color Variants

**Giver Elements (Gold Accent):**
```tsx
// Icon background
className="bg-accent/10 hover:bg-accent/20"

// Border
className="border-accent/20 hover:border-accent/40"

// Text
className="text-accent"

// Button
className="bg-accent text-foreground hover:bg-accent/90"

// Bullet points
className="bg-accent rounded-full"
```

**Builder Elements (Teal Secondary):**
```tsx
// Icon background
className="bg-secondary/10 hover:bg-secondary/20"

// Border
className="border-secondary/20 hover:border-secondary/40"

// Text
className="text-secondary"

// Button
className="bg-secondary text-background hover:bg-secondary/90"

// Bullet points
className="bg-secondary rounded-full"
```

**Pattern:**
- Use `/10` opacity for subtle backgrounds
- Use `/20` opacity for hover states
- Use `/40` opacity for active borders
- Use `/60` opacity for muted text
- Use `/90` opacity for hover button states

---

## Best Practices

### 1. Use Semantic Color Tokens

```tsx
// ✅ Good - Semantic and themeable
className="bg-primary text-primary-foreground"

// ❌ Avoid - Hardcoded colors
className="bg-[#0B1F3A] text-[#F5F4F0]"
```

### 2. Mobile-First Responsive Design

```tsx
// ✅ Good - Mobile first
className="text-base sm:text-lg lg:text-xl"

// ❌ Avoid - Desktop first
className="text-xl lg:text-base"
```

### 3. Consistent Spacing Scale

```tsx
// ✅ Good - Standard spacing scale
className="mb-6 py-16 gap-4"

// ❌ Avoid - Arbitrary values
className="mb-[23px] py-[67px] gap-[15px]"
```

### 4. Leverage Component Variants

```tsx
// ✅ Good - Using CVA variants
<Button variant="secondary" size="lg">Click Me</Button>

// ❌ Avoid - Inline all styles
<button className="bg-teal h-10 px-6 rounded-md...">Click Me</button>
```

### 5. Group Related Hover Effects

```tsx
// ✅ Good - Coordinated group hover
<div className="group">
  <div className="bg-accent/10 group-hover:bg-accent/20">
    <Icon className="text-accent" />
  </div>
</div>

// ❌ Avoid - Independent hover states
<div className="hover:bg-accent/20">
  <Icon className="hover:text-accent" />
</div>
```

### 6. Use Opacity for Color Variations

```tsx
// ✅ Good - Opacity variants
className="bg-accent/10 border-accent/20 hover:bg-accent/30"

// ❌ Avoid - Separate color definitions
className="bg-accent-light border-accent-lighter hover:bg-accent-medium"
```

### 7. Focus Visibility

```tsx
// ✅ Good - Visible focus ring
className="focus-visible:ring-ring/50 focus-visible:ring-[3px]"

// ❌ Avoid - No focus indicator
className="outline-none"
```

### 8. Transition All Interactive States

```tsx
// ✅ Good - Smooth transitions
className="transition-all duration-300 hover:shadow-xl"

// ❌ Avoid - Abrupt state changes
className="hover:shadow-xl"
```

---

## Troubleshooting

### Common Issues

**1. CSS Variables Not Working**

Ensure both `@theme` and `:root` definitions exist:

```css
@theme {
  --color-primary: #0B1F3A;
}

:root {
  --primary: #0B1F3A;
}
```

**2. Dark Mode Not Applying**

Check custom variant definition:

```css
@custom-variant dark (&:is(.dark *));
```

**3. Fonts Not Loading**

Verify font variables are applied to `<html>`:

```tsx
<html className={`${plusJakartaSans.variable} ${merriweather.variable} ${montserrat.variable}`}>
```

**4. Components Not Found**

Check import aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**5. Tailwind Classes Not Applying**

Verify `@source` directives in globals.css:

```css
@source "../components";
@source "../app";
```

### Build Errors

**Missing Plugin Error:**
```bash
Error: Plugin "tailwindcss-animate" not found
```
**Solution:**
```bash
npm install tailwindcss-animate
```

**PostCSS Configuration Error:**
```bash
Error: PostCSS plugin tailwindcss requires PostCSS 8
```
**Solution:**
```bash
npm install -D @tailwindcss/postcss postcss
```

---

## Resources

**Official Documentation:**
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Class Variance Authority](https://cva.style/docs)

**Tools:**
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [Prettier Plugin Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - Auto-sort classes
- [OKLCH Color Picker](https://oklch.com) - Color space converter

**The Mordecai Collective Files:**
- Global Styles: `/Users/coreywest/Documents/website/app/globals.css`
- shadcn Config: `/Users/coreywest/Documents/website/components.json`
- UI Components: `/Users/coreywest/Documents/website/components/ui/`
- Marketing Components: `/Users/coreywest/Documents/website/components/marketing/`

---

## Summary

This skill covers the complete integration of Tailwind CSS v4 with shadcn/ui for The Mordecai Collective project. Key takeaways:

1. **CSS-First Configuration** - No more tailwind.config.js, use `@theme` directive
2. **Brand-Focused Design** - Dual audience colors (Giver gold, Builder teal)
3. **Typography Hierarchy** - Three fonts for different content types
4. **Component Library** - shadcn/ui with CVA for type-safe variants
5. **Modern Color System** - OKLCH color space with CSS variables
6. **Accessibility First** - WCAG AA compliance with focus/error states
7. **Mobile-First Responsive** - Progressive enhancement from mobile up
8. **Animation Support** - tailwindcss-animate for smooth interactions

All examples are drawn from actual production code in the project, ensuring patterns are battle-tested and ready for immediate use.
