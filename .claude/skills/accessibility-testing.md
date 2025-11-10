# Accessibility Testing - The Mordecai Collective

## Overview

This project follows WCAG 2.1 AA standards for accessibility. We use a combination of automated testing (axe-core, Playwright) and manual testing to ensure our content is accessible to all users, including those using screen readers, keyboard navigation, and assistive technologies.

## Why Accessibility Matters

The Mordecai Collective serves givers, stewards, builders, and creators from diverse backgrounds. Accessibility ensures:

* Content is available to users with visual, auditory, motor, or cognitive disabilities
* Better SEO and discoverability
* Improved user experience for everyone
* Legal compliance with accessibility standards
* Alignment with our values of community and inclusion

## Testing Tools

### 1. axe-core with Playwright

Automatically checks for \~1/3 of accessibility issues during E2E tests.

**Installation:**

```bash
npm install --save-dev @axe-core/playwright
```

**Usage in Playwright tests:**

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 2. jest-axe with Vitest/React Testing Library

Tests accessibility in component unit tests.

**Installation:**

```bash
npm install --save-dev jest-axe
```

**Usage in component tests:**

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from '@/components/marketing/Hero';

expect.extend(toHaveNoViolations);

test('Hero component should be accessible', async () => {
  const { container } = render(<Hero />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 3. eslint-plugin-jsx-a11y

Catches accessibility issues during development.

**Configuration in .eslintrc.js:**

```javascript
{
  extends: [
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['jsx-a11y']
}
```

## Accessibility Checklist

### Color Contrast (WCAG AA)

All text must meet minimum contrast ratios:

* Normal text: 4.5:1
* Large text (18pt+): 3:1
* UI components: 3:1

**The Mordecai Collective color compliance:**

* ✅ Deep Navy (#0B1F3A) on Soft Ivory (#F5F4F0): 13.5:1
* ✅ Gold/Amber (#D4A24C) on Deep Navy (#0B1F3A): 4.9:1
* ✅ Rich Teal (#2A5D62) on Soft Ivory (#F5F4F0): 8.4:1

**Testing:**

```typescript
test('text has sufficient contrast', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:

* Tab to navigate forward
* Shift+Tab to navigate backward
* Enter/Space to activate
* Arrow keys for menus/radios
* Escape to close modals/menus

**Testing:**

```typescript
test('can navigate with keyboard', async ({ page }) => {
  await page.goto('/');

  // Tab through all focusable elements
  await page.keyboard.press('Tab');
  const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
  expect(firstFocused).toBeTruthy();

  // Activate with Enter
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/about/);
});
```

### ARIA Attributes

Use semantic HTML first, then ARIA when needed:

* Use `<button>` not `<div role="button">`
* Use `<nav>` not `<div role="navigation">`
* Add `aria-label` for icon-only buttons
* Add `aria-live` for dynamic content
* Add `aria-expanded` for expandable sections

**Good Example:**

```tsx
<button
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
  onClick={toggleMenu}
>
  <MenuIcon />
</button>
```

**Testing:**

```typescript
test('buttons have accessible labels', async ({ page }) => {
  await page.goto('/');

  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const hasText = await button.textContent();
    const hasAriaLabel = await button.getAttribute('aria-label');
    expect(hasText || hasAriaLabel).toBeTruthy();
  }
});
```

### Focus Management

* Visible focus indicators (outline/ring)
* Logical tab order
* Focus trapping in modals
* Skip links for navigation

**CSS for focus indicators:**

```css
/* Use theme colors for focus rings */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

**Testing:**

```typescript
test('focus indicators are visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const focusedElement = page.locator(':focus');
  const outline = await focusedElement.evaluate(
    el => window.getComputedStyle(el).outline
  );
  expect(outline).not.toBe('none');
});
```

### Image Alt Text

All images must have meaningful alt text or be marked decorative:

```tsx
// Meaningful image
<Image
  src="/images/hero.jpg"
  alt="Hands releasing seeds into the air, symbolizing generosity and Kingdom multiplication"
  width={800}
  height={600}
/>

// Decorative image (empty alt)
<Image
  src="/images/pattern.svg"
  alt=""
  width={100}
  height={100}
  aria-hidden="true"
/>
```

### Headings Hierarchy

Use proper heading levels (h1 → h2 → h3):

```tsx
// Correct
<h1>About The Mordecai Collective</h1>
  <h2>Our Mission</h2>
    <h3>For Givers & Stewards</h3>
    <h3>For Builders & Creators</h3>
  <h2>Our Values</h2>

// Incorrect - skips h2
<h1>About</h1>
  <h3>Mission</h3> ❌
```

**Testing:**

```typescript
test('headings have proper hierarchy', async ({ page }) => {
  await page.goto('/about');

  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  const levels = await Promise.all(
    headings.map(h => h.evaluate(el => parseInt(el.tagName[1])))
  );

  // Check no levels are skipped
  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i-1]).toBeLessThanOrEqual(1);
  }
});
```

### Form Accessibility

Forms must be fully accessible:

```tsx
<form>
  <label htmlFor="email" className="sr-only">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-error"
    aria-invalid={!!errors.email}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-destructive">
      {errors.email}
    </p>
  )}
</form>
```

**Testing:**

```typescript
test('form inputs have labels', async ({ page }) => {
  await page.goto('/contact');

  const inputs = await page.locator('input, textarea, select').all();
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    const label = await page.locator(`label[for="${id}"]`).count();
    const ariaLabel = await input.getAttribute('aria-label');

    expect(label > 0 || ariaLabel).toBeTruthy();
  }
});
```

## Screen Reader Testing

### Testing with VoiceOver (macOS)


1. Enable VoiceOver: Cmd+F5
2. Navigate: Ctrl+Option+Arrow keys
3. Interact: Ctrl+Option+Space
4. Web rotor: Ctrl+Option+U

### Testing with NVDA (Windows)


1. Download NVDA (free)
2. Navigate: Arrow keys
3. Read next: Down arrow
4. Elements list: Insert+F7

### Common Screen Reader Tests

* Does page title announce correctly?
* Do headings make sense out of context?
* Are form labels announced?
* Do buttons have clear purposes?
* Is dynamic content announced (aria-live)?

## Automated Testing Workflow

### 1. Component Level (Vitest + jest-axe)

```typescript
// components/marketing/__tests__/Hero.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from '../Hero';

expect.extend(toHaveNoViolations);

describe('Hero Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(<Hero />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Page Level (Playwright + axe-core)

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('articles page should be accessible', async ({ page }) => {
    await page.goto('/articles');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

### 3. CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Run accessibility tests
  run: npm run test:a11y

- name: Upload axe results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: axe-results
    path: axe-results/
```

## Manual Testing Checklist

- [ ] Can you complete all tasks using only keyboard?
- [ ] Do all interactive elements have visible focus?
- [ ] Do images have appropriate alt text?
- [ ] Are headings in proper hierarchy (h1→h2→h3)?
- [ ] Do forms have associated labels?
- [ ] Does color contrast meet WCAG AA?
- [ ] Does content make sense with screen reader?
- [ ] Are error messages announced to screen readers?
- [ ] Can modals be closed with Escape key?
- [ ] Is dynamic content announced (loading states, etc.)?

## Common Accessibility Patterns

### Skip Link

```tsx
// components/shared/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  );
}

// app/layout.tsx
<body>
  <SkipLink />
  <Header />
  <main id="main-content">
    {children}
  </main>
</body>
```

### Announcement for Screen Readers

```tsx
// For loading states
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading ? 'Loading articles...' : 'Articles loaded'}
</div>

// For errors
<div role="alert" aria-live="assertive">
  {error && `Error: ${error.message}`}
</div>
```

### Accessible Modal

```tsx
export function Modal({ isOpen, onClose, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="modal-description">
        <DialogTitle>Modal Title</DialogTitle>
        <div id="modal-description">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Resources

* [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
* [axe-core rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
* [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
* [A11y Project Checklist](https://www.a11yproject.com/checklist/)
* [React Testing Library Accessibility](https://testing-library.com/docs/dom-testing-library/api-accessibility/)

## Best Practices


1. **Use semantic HTML** - `<button>`, `<nav>`, `<article>`, etc.
2. **Test early and often** - Don't wait until the end
3. **Use automated tools** but don't rely on them 100%
4. **Test with real users** when possible
5. **Document patterns** for team consistency
6. **Consider mobile** - touch targets, zoom, orientation
7. **Respect user preferences** - prefers-reduced-motion, prefers-color-scheme
8. **Keep it simple** - Complex interactions are harder to make accessible


