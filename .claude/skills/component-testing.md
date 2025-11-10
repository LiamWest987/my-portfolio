# Component Testing - The Mordecai Collective

## Overview

Component testing strategy for The Mordecai Collective using Vitest + React Testing Library. Focus on testing user-facing behavior, accessibility, and edge cases for marketing components, forms, and content rendering.

## Philosophy

* **Test behavior, not implementation** - Focus on what users see and do
* **Accessibility first** - Use semantic queries (getByRole, getByLabelText)
* **Mock external dependencies** - Sanity, Next.js modules, third-party libraries
* **Test edge cases** - Empty states, missing data, error conditions
* **Keep tests simple** - One concept per test when possible

## Testing Stack

* **Vitest** - Fast unit test runner
* **React Testing Library** - User-centric component testing
* **jest-axe** - Automated accessibility testing
* **@testing-library/user-event** - Realistic user interactions

## Component Testing Patterns

### 1. Marketing Components

#### Hero Component

```typescript
// components/marketing/__tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from '../Hero';

expect.extend(toHaveNoViolations);

describe('Hero', () => {
  it('renders main heading', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: /walk alongside/i })
    ).toBeInTheDocument();
  });

  it('displays CTA buttons', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /givers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /builders/i })).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Hero />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Audience Cards

```typescript
// components/marketing/__tests__/AudienceCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AudienceCard } from '../AudienceCard';

describe('AudienceCard', () => {
  const mockProps = {
    title: 'Givers & Stewards',
    description: 'Release what God has entrusted to you',
    href: '/givers',
    icon: 'gift',
  };

  it('renders title and description', () => {
    render(<AudienceCard {...mockProps} />);

    expect(screen.getByText('Givers & Stewards')).toBeInTheDocument();
    expect(screen.getByText(/release what god/i)).toBeInTheDocument();
  });

  it('links to correct audience page', () => {
    render(<AudienceCard {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/givers');
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<AudienceCard {...mockProps} />);

    const link = screen.getByRole('link');
    await user.tab();
    expect(link).toHaveFocus();
  });
});
```

### 2. Content Rendering Components

#### Article Card

```typescript
// components/marketing/__tests__/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () => {
  const mockArticle = {
    title: 'Recognizing Your Divine Moment',
    excerpt: 'Like Esther, you were made for such a time as this.',
    slug: 'divine-moment',
    audience: 'both',
    publishedAt: '2025-11-01',
    readTime: '5 min read',
  };

  it('renders article information', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Recognizing Your Divine Moment')).toBeInTheDocument();
    expect(screen.getByText(/like esther/i)).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('displays correct audience badge', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('links to article detail page', () => {
    render(<ArticleCard article={mockArticle} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/divine-moment');
  });

  it('handles missing excerpt gracefully', () => {
    const articleWithoutExcerpt = { ...mockArticle, excerpt: undefined };
    render(<ArticleCard article={articleWithoutExcerpt} />);

    expect(screen.queryByText(/like esther/i)).not.toBeInTheDocument();
  });
});
```

#### Empty State

```typescript
// components/shared/__tests__/EmptyState.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders message and icon', () => {
    render(<EmptyState message="No articles found" />);

    expect(screen.getByText('No articles found')).toBeInTheDocument();
  });

  it('renders optional CTA button', () => {
    render(
      <EmptyState
        message="No articles found"
        actionLabel="View all articles"
        actionHref="/articles"
      />
    );

    const link = screen.getByRole('link', { name: /view all articles/i });
    expect(link).toHaveAttribute('href', '/articles');
  });

  it('works without optional CTA', () => {
    render(<EmptyState message="No results" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
```

### 3. Form Components

#### Contact Form

```typescript
// components/forms/__tests__/ContactForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactForm } from '../ContactForm';

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Question');
    await user.type(screen.getByLabelText(/message/i), 'Hello!');

    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question',
        message: 'Hello!',
      });
    });
  });
});
```

### 4. Utility Functions

#### Audience Badge Helpers

```typescript
// lib/__tests__/audience-helpers.test.ts
import { describe, it, expect } from 'vitest';
import { getAudienceBadgeColor, getAudienceLabel } from '../audience-helpers';

describe('getAudienceBadgeColor', () => {
  it('returns correct color for giver', () => {
    expect(getAudienceBadgeColor('giver')).toBe('bg-secondary/20 text-secondary');
  });

  it('returns correct color for builder', () => {
    expect(getAudienceBadgeColor('builder')).toBe('bg-accent/20 text-accent');
  });

  it('returns correct color for both', () => {
    expect(getAudienceBadgeColor('both')).toBe('bg-primary/10 text-primary');
  });

  it('handles unknown audience', () => {
    expect(getAudienceBadgeColor('unknown')).toBe('bg-muted text-muted-foreground');
  });
});

describe('getAudienceLabel', () => {
  it('returns full label for giver', () => {
    expect(getAudienceLabel('giver')).toBe('Givers & Stewards');
  });

  it('returns full label for builder', () => {
    expect(getAudienceLabel('builder')).toBe('Builders & Creators');
  });

  it('returns All for both', () => {
    expect(getAudienceLabel('both')).toBe('All');
  });
});
```

## Mocking Patterns

### Mock Next.js Image

```typescript
// vitest.setup.ts or test file
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));
```

### Mock Next.js Link

```typescript
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));
```

### Mock Sanity Client

```typescript
// lib/__tests__/sanity-client.mock.ts
import { vi } from 'vitest';

export const mockArticles = [
  {
    _id: '1',
    title: 'Test Article',
    slug: { current: 'test-article' },
    audience: 'both',
    publishedAt: '2025-11-01',
  },
];

export const mockSanityClient = {
  fetch: vi.fn().mockResolvedValue(mockArticles),
};

// In test file
vi.mock('@/sanity/lib/client', () => ({
  client: mockSanityClient,
}));
```

### Mock Brevo Forms (Future)

```typescript
vi.mock('@/lib/brevo', () => ({
  subscribeToNewsletter: vi.fn().mockResolvedValue({ success: true }),
}));
```

## Common Testing Queries

### Semantic Queries (Preferred)

```typescript
// By role - best for interactive elements
screen.getByRole('button', { name: /submit/i });
screen.getByRole('link', { name: /read more/i });
screen.getByRole('heading', { level: 1 });

// By label - best for form inputs
screen.getByLabelText(/email address/i);

// By text - good for non-interactive content
screen.getByText(/welcome to the mordecai collective/i);
```

### When Semantic Queries Don't Work

```typescript
// By test ID - last resort
<button data-testid="newsletter-submit">Subscribe</button>
screen.getByTestId('newsletter-submit');

// By CSS selector - avoid if possible
screen.getByRole('article').querySelector('.badge');
```

## Edge Cases to Test

### 1. Missing/Undefined Data

```typescript
it('handles missing image gracefully', () => {
  const articleWithoutImage = { ...mockArticle, image: undefined };
  render(<ArticleCard article={articleWithoutImage} />);

  // Should not crash
  expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
});
```

### 2. Empty Arrays

```typescript
it('shows empty state when no articles', () => {
  render(<ArticlesList articles={[]} />);

  expect(screen.getByText(/no articles found/i)).toBeInTheDocument();
});
```

### 3. Loading States

```typescript
it('shows loading spinner while fetching', () => {
  render(<ArticlesList isLoading={true} />);

  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### 4. Error States

```typescript
it('displays error message on fetch failure', () => {
  render(<ArticlesList error="Failed to load articles" />);

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
});
```

## Accessibility Testing in Components

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## User Interaction Testing

```typescript
import userEvent from '@testing-library/user-event';

it('filters articles by audience', async () => {
  const user = userEvent.setup();
  render(<ArticlesPage />);

  // Click filter button
  const giversFilter = screen.getByRole('link', { name: /for givers/i });
  await user.click(giversFilter);

  // Verify URL updated
  expect(window.location.search).toContain('audience=giver');

  // Verify only giver articles shown
  const articles = screen.getAllByRole('article');
  articles.forEach(article => {
    expect(article).toHaveTextContent(/givers/i);
  });
});
```

## Test Organization

```
components/
├── marketing/
│   ├── Hero.tsx
│   ├── AudienceCard.tsx
│   └── __tests__/
│       ├── Hero.test.tsx
│       └── AudienceCard.test.tsx
├── shared/
│   ├── EmptyState.tsx
│   └── __tests__/
│       └── EmptyState.test.tsx
└── forms/
    ├── ContactForm.tsx
    └── __tests__/
        └── ContactForm.test.tsx

lib/
├── audience-helpers.ts
└── __tests__/
    └── audience-helpers.test.ts
```

## Running Tests

```bash
# Run all component tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific file
npm test Hero

# Run tests matching pattern
npm test -- -t "audience"

# Run with UI
npm run test:ui
```

## Best Practices


1. **Test user behavior, not implementation**
   * ❌ `expect(component.state.isOpen).toBe(true)`
   * ✅ `expect(screen.getByRole('dialog')).toBeVisible()`
2. **Use semantic queries**
   * ❌ `container.querySelector('.button')`
   * ✅ `screen.getByRole('button', { name: /submit/i })`
3. **Test accessibility**
   * Always include axe tests for new components
   * Use getByRole to ensure elements are accessible
4. **Mock external dependencies**
   * Mock Sanity, Next.js modules, APIs
   * Keep tests fast and reliable
5. **Test edge cases**
   * Empty states, missing data, errors
   * Loading states, validation failures
6. **Write descriptive test names**
   * ❌ `it('works')`
   * ✅ `it('displays giver badge for giver audience')`
7. **One assertion per test (when sensible)**
   * Makes failures easier to debug
   * More granular test coverage
8. **Cleanup after tests**
   * RTL cleans up automatically
   * Clear mocks if needed: `vi.clearAllMocks()`

## Common Pitfalls

❌ **Testing implementation details**

```typescript
expect(component.props.onClick).toHaveBeenCalled();
```

✅ **Test user-visible behavior**

```typescript
await user.click(screen.getByRole('button'));
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

❌ **Using arbitrary waits**

```typescript
await new Promise(resolve => setTimeout(resolve, 1000));
```

✅ **Use waitFor with specific conditions**

```typescript
await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});
```

❌ **Not cleaning up mocks**

```typescript
// Mocks persist between tests
```

✅ **Clear mocks in beforeEach**

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Resources

* [React Testing Library Docs](https://testing-library.com/react)
* [Vitest Docs](https://vitest.dev/)
* [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
* [Testing Library Queries Cheatsheet](https://testing-library.com/docs/queries/about/#priority)


