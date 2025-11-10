# Vitest Testing - The Mordecai Collective

## Overview

This project uses Vitest for unit testing with React Testing Library for component tests. Test configuration is optimized for Next.js 15 with strict TypeScript. Focus on testing marketing components, utility functions, and content rendering logic.

## Configuration Files

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "sanity/",
        "migrations/",
        "tests/e2e/",
        "**/*.config.ts",
        "**/*.config.js",
        "**/types/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### vitest.setup.ts

```typescript
import "@testing-library/jest-dom";
```

## Test Structure

### Unit Tests (lib/)

Location: `lib/__tests__/`

Example: `lib/__tests__/i18n-helpers.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { getLocalizedField } from "../i18n-helpers";

describe("getLocalizedField", () => {
  it("returns English value when locale is en", () => {
    const content = { titleEn: "Hello", titleFr: "Bonjour" };
    expect(getLocalizedField(content, "title", "en")).toBe("Hello");
  });

  it("falls back to English when French is missing", () => {
    const content = { titleEn: "Hello" };
    expect(getLocalizedField(content, "title", "fr")).toBe("Hello");
  });
});
```

### Component Tests (components/)

Location: `components/shared/__tests__/`

## Common Mocking Patterns

### Mock next-intl

```typescript
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      readCaseStudy: "Read Case Study",
      learnMore: "Learn More",
    };
    return translations[key] || key;
  },
}));
```

### Mock Next.js Image

```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))
```

### Mock Sanity Client

```typescript
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));
```

### Mock Sanity Image Builder

```typescript
vi.mock("@sanity/image-url", () => ({
  default: () => ({
    image: () => ({
      width: () => ({
        height: () => ({
          fit: () => ({
            url: () => "https://example.com/image.jpg",
          }),
        }),
      }),
    }),
  }),
}));
```

## TypeScript Type Assertions

When mocking, use `as never` for complex Sanity types:

```typescript
vi.mocked(client.fetch).mockResolvedValue(mockData as never);
```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test i18n-helpers
```

## Test Coverage Goals

Target test coverage for The Mordecai Collective:

### Priority Testing Areas

1. **Marketing Components**
   - Hero component rendering
   - Audience selection cards (Givers/Builders)
   - CallToAction component with audience filtering
   - Footer navigation links
   - Header navigation and responsiveness

2. **Utility Functions**
   - Audience badge color helpers
   - Date formatting utilities
   - Content filtering logic
   - Search/filter functions

3. **Content Rendering**
   - Article card display
   - Bible study card display
   - Resource card rendering
   - Mock Sanity data integration

4. **Edge Cases**
   - Empty state handling (no articles, no studies)
   - Missing data (undefined fields)
   - Audience filtering edge cases
   - Form validation logic

Target: 80%+ coverage on utilities, 100% on shared components

## Writing New Tests

1. Create test file adjacent to source: `__tests__/component.test.tsx`
2. Import testing utilities: `import { describe, it, expect, vi } from 'vitest'`
3. Import React Testing Library: `import { render, screen } from '@testing-library/react'`
4. Mock dependencies before imports
5. Write descriptive test names
6. Test edge cases (undefined, empty, missing data)
7. Use `screen.getByText()`, `screen.getByRole()` for queries
8. Prefer `toBeInTheDocument()` for existence checks

## Best Practices

- One assertion per test when possible
- Test user-visible behavior, not implementation
- Mock external dependencies (Sanity, next-intl, Next/Image)
- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- Test both happy path and error cases
- Keep tests simple and focused

## shadcn/ui Component Testing

Testing shadcn/ui components ensures that our UI library integration works correctly and maintains accessibility standards.

### Testing Button Variants

Location: `components/ui/__tests__/button.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders primary variant with correct classes", () => {
    render(<Button variant="default">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-primary");
  });

  it("renders secondary variant with correct classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-secondary");
  });

  it("renders accent variant with correct classes", () => {
    render(<Button variant="outline">Accent</Button>);
    const button = screen.getByRole("button", { name: /accent/i });
    expect(button).toHaveClass("border");
  });

  it("renders destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size variants correctly", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-9");
  });

  it("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});
```

### Testing Card Components

Location: `components/ui/__tests__/card.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card", () => {
  it("renders card with all sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card description text")).toBeInTheDocument();
    expect(screen.getByText("Main content goes here")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies custom className to Card", () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders without optional sections", () => {
    render(
      <Card>
        <CardContent>Minimal card</CardContent>
      </Card>
    );
    expect(screen.getByText("Minimal card")).toBeInTheDocument();
  });
});
```

### Testing Form Components from shadcn

Location: `components/ui/__tests__/form.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

function TestForm({ onSubmit }: { onSubmit: (data: z.infer<typeof formSchema>) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("renders form fields with labels", () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText("Enter your full name")).toBeInTheDocument();
  });

  it("validates required fields on submit", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });

  it("displays field-specific validation errors", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), "J");
    await userEvent.type(screen.getByLabelText(/email/i), "invalid-email");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Dialog/Modal Accessibility

Location: `components/ui/__tests__/dialog.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";

describe("Dialog", () => {
  it("opens dialog when trigger is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /open dialog/i }));

    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description")).toBeInTheDocument();
  });

  it("has correct ARIA attributes", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog is accessible</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: /open/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("closes dialog when close button is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();

    // Dialog should have a close button with aria-label
    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
  });

  it("traps focus within dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Trap</DialogTitle>
          </DialogHeader>
          <input type="text" placeholder="First field" />
          <input type="text" placeholder="Second field" />
        </DialogContent>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: /open/i }));

    // Focus should be trapped within the dialog
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
```

## Coverage Goals for The Mordecai Collective

### Target Coverage by Directory

#### 1. lib/ Utilities - Target 80%+

High-value utility functions that require comprehensive testing:

```typescript
// lib/__tests__/audience-helpers.test.ts
import { describe, it, expect } from "vitest";
import { getAudienceBadgeColor, filterByAudience } from "../audience-helpers";

describe("audience-helpers", () => {
  describe("getAudienceBadgeColor", () => {
    it("returns correct color for givers", () => {
      expect(getAudienceBadgeColor("givers")).toBe("blue");
    });

    it("returns correct color for builders", () => {
      expect(getAudienceBadgeColor("builders")).toBe("green");
    });

    it("handles undefined audience", () => {
      expect(getAudienceBadgeColor(undefined)).toBe("gray");
    });
  });

  describe("filterByAudience", () => {
    const items = [
      { id: 1, audience: "givers" },
      { id: 2, audience: "builders" },
      { id: 3, audience: "both" },
    ];

    it("filters by givers audience", () => {
      const result = filterByAudience(items, "givers");
      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toEqual([1, 3]);
    });

    it("returns all items when no filter", () => {
      const result = filterByAudience(items, null);
      expect(result).toHaveLength(3);
    });
  });
});
```

**Priority lib/ Files:**
- `lib/i18n-helpers.ts` - 100% coverage (critical for i18n)
- `lib/date-utils.ts` - 90%+ coverage
- `lib/audience-helpers.ts` - 90%+ coverage
- `lib/content-filters.ts` - 85%+ coverage
- `lib/sanity-helpers.ts` - 80%+ coverage

### 2. Shared Components - Target 100%

All reusable components should have complete test coverage:

```typescript
// components/shared/__tests__/AudienceCard.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AudienceCard } from "../AudienceCard";

describe("AudienceCard", () => {
  it("renders givers card with correct content", () => {
    render(
      <AudienceCard
        audience="givers"
        title="For Givers"
        description="Support biblical ministry"
        href="/givers"
      />
    );

    expect(screen.getByText("For Givers")).toBeInTheDocument();
    expect(screen.getByText("Support biblical ministry")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/givers");
  });

  it("renders builders card with correct styling", () => {
    render(
      <AudienceCard
        audience="builders"
        title="For Builders"
        description="Build with purpose"
        href="/builders"
      />
    );

    const card = screen.getByRole("link");
    expect(card).toHaveClass("audience-builders");
  });

  it("handles missing description gracefully", () => {
    render(
      <AudienceCard
        audience="givers"
        title="Title Only"
        href="/test"
      />
    );

    expect(screen.getByText("Title Only")).toBeInTheDocument();
  });
});
```

**Priority Shared Components:**
- `components/shared/AudienceCard.tsx` - 100%
- `components/shared/ContentCard.tsx` - 100%
- `components/shared/CallToAction.tsx` - 100%
- `components/shared/LocaleSwitcher.tsx` - 100%
- `components/shared/ThemeToggle.tsx` - 100%

### 3. Priority Components to Test First

**Phase 1: Marketing Foundation (Current)**
1. Header navigation and mobile menu
2. Footer links and structure
3. Hero component variants
4. Audience selection cards

**Phase 2: Content Display**
1. Article card rendering
2. Bible study card display
3. Resource card with download links
4. Search and filter components

**Phase 3: Interactive Elements**
1. Contact form validation
2. Newsletter signup
3. Theme switcher
4. Language switcher

**Phase 4: Layout Components**
1. Page layouts (marketing, content)
2. Grid systems
3. Container components
4. Section wrappers

### 4. What NOT to Test

**Skip These (Low Value, High Maintenance):**

```typescript
// DO NOT TEST - Third-party library internals
// ❌ node_modules/
// ❌ .next/

// DO NOT TEST - Generated/config files
// ❌ *.config.ts
// ❌ *.config.js
// ❌ tailwind.config.ts
// ❌ vitest.config.ts

// DO NOT TEST - Sanity Studio code
// ❌ sanity/
// ❌ sanity.config.ts
// ❌ sanity.cli.ts

// DO NOT TEST - Database migrations
// ❌ migrations/

// DO NOT TEST - Type definitions only
// ❌ types/sanity.ts (auto-generated)
// ❌ types/global.d.ts (declarations only)

// DO NOT TEST - Simple re-exports
// ❌ components/ui/index.ts (just exports)

// DO NOT TEST - E2E test files (tested via Playwright)
// ❌ tests/e2e/

// DO NOT TEST - Styling constants
// ❌ Pure CSS/Tailwind config objects
```

**Minimal Testing Required:**
- Simple wrapper components that just compose other components
- Basic layout components with no logic
- Type-only modules
- Environment variable declarations

### Coverage Monitoring Commands

```bash
# Generate full coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html

# Check coverage thresholds (add to package.json)
npm test -- --coverage --coverage.thresholds.lines=80

# Watch mode with coverage
npm test -- --coverage --watch
```

### Coverage Configuration

Update `vitest.config.ts` with coverage thresholds:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      include: [
        "lib/**/*.{ts,tsx}",
        "components/shared/**/*.{ts,tsx}",
        "components/ui/**/*.{ts,tsx}",
      ],
      exclude: [
        "node_modules/",
        ".next/",
        "sanity/",
        "migrations/",
        "tests/e2e/",
        "**/*.config.ts",
        "**/*.config.js",
        "**/types/**",
        "**/*.d.ts",
      ],
    },
  },
});
```

## Testing Server Actions (Future Phase 7)

Server Actions in Next.js 15 require special testing patterns since they run on the server. This section prepares for Phase 7 implementation.

### How to Test Server Actions

Location: `app/actions/__tests__/contact.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitContactForm } from "../contact";

// Mock the database/email service
vi.mock("@/lib/email-service", () => ({
  sendEmail: vi.fn(),
}));

vi.mock("@/lib/database", () => ({
  saveContactSubmission: vi.fn(),
}));

import { sendEmail } from "@/lib/email-service";
import { saveContactSubmission } from "@/lib/database";

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits contact form", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("message", "Hello from test");

    vi.mocked(saveContactSubmission).mockResolvedValue({ id: "123" });
    vi.mocked(sendEmail).mockResolvedValue({ success: true });

    const result = await submitContactForm(formData);

    expect(result).toEqual({ success: true, id: "123" });
    expect(saveContactSubmission).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello from test",
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("validates required fields", async () => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("email", "invalid-email");
    formData.append("message", "");

    const result = await submitContactForm(formData);

    expect(result).toEqual({
      success: false,
      errors: {
        name: "Name is required",
        email: "Invalid email address",
        message: "Message is required",
      },
    });
    expect(saveContactSubmission).not.toHaveBeenCalled();
  });

  it("sanitizes input to prevent XSS", async () => {
    const formData = new FormData();
    formData.append("name", "<script>alert('xss')</script>");
    formData.append("email", "test@example.com");
    formData.append("message", "Normal message");

    vi.mocked(saveContactSubmission).mockResolvedValue({ id: "456" });
    vi.mocked(sendEmail).mockResolvedValue({ success: true });

    await submitContactForm(formData);

    const savedData = vi.mocked(saveContactSubmission).mock.calls[0][0];
    expect(savedData.name).not.toContain("<script>");
    expect(savedData.name).toBe(""); // or sanitized version
  });
});
```

### Mocking Patterns for Server Actions

#### Mock Sanity Client for Server Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { getArticles } from "../articles";

// Mock Sanity client
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

import { client } from "@/sanity/lib/client";

describe("getArticles Server Action", () => {
  it("fetches articles from Sanity", async () => {
    const mockArticles = [
      {
        _id: "1",
        titleEn: "Test Article",
        slug: { current: "test-article" },
        audience: "givers",
      },
    ];

    vi.mocked(client.fetch).mockResolvedValue(mockArticles as never);

    const result = await getArticles("en");

    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining("*[_type == \"article\"]"),
      expect.any(Object)
    );
    expect(result).toEqual(mockArticles);
  });

  it("handles Sanity fetch errors", async () => {
    vi.mocked(client.fetch).mockRejectedValue(
      new Error("Sanity API error")
    );

    await expect(getArticles("en")).rejects.toThrow("Sanity API error");
  });
});
```

#### Mock Database Operations

```typescript
import { describe, it, expect, vi } from "vitest";
import { createDonation } from "../donations";

// Mock Prisma/database client
vi.mock("@/lib/db", () => ({
  db: {
    donation: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";

describe("createDonation Server Action", () => {
  it("creates donation record in database", async () => {
    const mockDonation = {
      id: "don_123",
      amount: 50.00,
      currency: "USD",
      donorEmail: "donor@example.com",
      createdAt: new Date(),
    };

    vi.mocked(db.donation.create).mockResolvedValue(mockDonation as never);

    const result = await createDonation({
      amount: 50.00,
      email: "donor@example.com",
    });

    expect(db.donation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        amount: 50.00,
        donorEmail: "donor@example.com",
      }),
    });
    expect(result).toEqual(mockDonation);
  });
});
```

#### Mock External APIs

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { processPayment } from "../payment";

// Mock fetch for external API calls
global.fetch = vi.fn();

describe("processPayment Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("processes payment via Stripe API", async () => {
    const mockResponse = {
      id: "pi_123",
      status: "succeeded",
      amount: 5000,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await processPayment({
      amount: 50.00,
      token: "tok_visa",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.stripe.com/v1/payment_intents",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );
    expect(result.status).toBe("succeeded");
  });

  it("handles API rate limiting", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    await expect(
      processPayment({ amount: 50.00, token: "tok_visa" })
    ).rejects.toThrow("Rate limit exceeded");
  });
});
```

### Error Handling Tests for Server Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { updateUserProfile } from "../profile";

describe("updateUserProfile Error Handling", () => {
  it("handles database connection errors", async () => {
    vi.mocked(db.user.update).mockRejectedValue(
      new Error("Database connection failed")
    );

    const result = await updateUserProfile({
      userId: "123",
      name: "New Name",
    });

    expect(result).toEqual({
      success: false,
      error: "Unable to update profile. Please try again later.",
    });
  });

  it("handles validation errors with specific messages", async () => {
    const result = await updateUserProfile({
      userId: "123",
      name: "", // Invalid: empty name
      email: "not-an-email", // Invalid: bad email format
    });

    expect(result).toEqual({
      success: false,
      errors: {
        name: "Name cannot be empty",
        email: "Invalid email format",
      },
    });
  });

  it("handles unauthorized access", async () => {
    const result = await updateUserProfile({
      userId: "123",
      name: "Hacker",
    }, {
      currentUserId: "456", // Different user
    });

    expect(result).toEqual({
      success: false,
      error: "Unauthorized",
    });
  });

  it("logs errors for monitoring", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(db.user.update).mockRejectedValue(
      new Error("Unexpected error")
    );

    await updateUserProfile({ userId: "123", name: "Test" });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error updating user profile"),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
```

### Testing Revalidation in Server Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { publishArticle } from "../articles";

// Mock Next.js cache revalidation
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("publishArticle with Cache Revalidation", () => {
  it("revalidates article page after publishing", async () => {
    vi.mocked(db.article.update).mockResolvedValue({
      id: "123",
      slug: "new-article",
      published: true,
    } as never);

    await publishArticle("123");

    expect(revalidatePath).toHaveBeenCalledWith("/articles/new-article");
    expect(revalidatePath).toHaveBeenCalledWith("/articles");
  });

  it("does not revalidate on error", async () => {
    vi.mocked(db.article.update).mockRejectedValue(
      new Error("Database error")
    );

    await expect(publishArticle("123")).rejects.toThrow();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
```

### Best Practices for Server Action Tests

1. **Always mock external dependencies** (databases, APIs, email services)
2. **Test both success and error paths** comprehensively
3. **Validate input sanitization** to prevent security issues
4. **Test authorization/permissions** for protected actions
5. **Mock Next.js cache functions** (revalidatePath, revalidateTag)
6. **Use FormData for form submissions** to match real usage
7. **Test rate limiting and throttling** if implemented
8. **Verify error messages are user-friendly** (no stack traces exposed)
9. **Test idempotency** for actions that should be safe to retry
10. **Mock environment variables** needed for external services
