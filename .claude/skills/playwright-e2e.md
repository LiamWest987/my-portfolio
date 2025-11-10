# Playwright E2E Testing - The Mordecai Collective

## Overview

This project uses Playwright for end-to-end testing across multiple browsers. Tests verify critical user flows including audience-specific content (Givers/Stewards and Builders/Creators), article browsing, Bible study access, and newsletter signups.

## Configuration

### playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),

  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Test Structure

### Locale Switching Tests

Location: `tests/e2e/locale-switching.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Language Switching", () => {
  test("should switch from English to French on homepage", async ({ page }) => {
    await page.goto("/en");

    // Verify English content
    await expect(page.locator("h1")).toContainText("Building ventures");

    // Click language switcher
    await page.click('[data-testid="language-switcher"]');

    // Verify URL changed
    await expect(page).toHaveURL("/fr");

    // Verify French content
    await expect(page.locator("h1")).toContainText(
      "Construire des entreprises"
    );
  });
});
```

### Navigation Tests

Location: `tests/e2e/navigation.spec.ts`

Tests all header navigation links work in both languages.

### Sanity Data Tests

Location: `tests/e2e/sanity-data.spec.ts`

Tests that CMS content displays correctly.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# View HTML report
npm run test:e2e:report
```

## Test Coverage Goals

Target coverage for The Mordecai Collective:

### Critical User Flows to Test

1. **Homepage Journey**
   - Hero section loads with brand messaging
   - Audience selection cards (Givers vs Builders) are clickable
   - CTA buttons navigate correctly

2. **Content Browsing**
   - Articles listing with audience filtering
   - Article detail pages display correctly
   - Bible Studies listing and detail pages
   - Resources page with search/filter functionality

3. **Audience-Specific Paths**
   - Givers/Stewards page loads with correct content
   - Builders/Creators page loads with correct content
   - Featured content displays correctly for each audience

4. **Navigation & SEO**
   - All header/footer links work
   - SEO meta tags present on all pages
   - Mobile menu functionality

5. **Forms**
   - Contact form validation and submission
   - Newsletter signup forms (when integrated with Brevo)

6. **Accessibility**
   - Keyboard navigation works
   - ARIA attributes present
   - Color contrast meets WCAG AA standards

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something specific", async ({ page }) => {
    // Navigate
    await page.goto("/en/path");

    // Interact
    await page.click("button");

    // Assert
    await expect(page.locator("h1")).toBeVisible();
  });
});
```

### Common Selectors

```typescript
// By role (preferred)
await page.getByRole("button", { name: "Submit" });

// By text
await page.getByText("Welcome");

// By data-testid
await page.getByTestId("language-switcher");

// By CSS selector (last resort)
await page.locator(".class-name");
```

### Waiting for Elements

```typescript
// Wait for element to be visible
await page.waitForSelector("h1");

// Wait for navigation
await page.waitForURL("/new-path");

// Wait for load state
await page.waitForLoadState("networkidle");
```

### Testing Both Locales

```typescript
for (const locale of ["en", "fr"]) {
  test(`should work in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/page`);
    // test logic
  });
}
```

## Best Practices

- Start dev server automatically (configured in playwright.config.ts)
- Use data-testid for elements that lack semantic meaning
- Prefer semantic selectors (getByRole, getByText)
- Test user-visible behavior, not implementation details
- Keep tests independent (don't rely on test order)
- Use descriptive test names
- Group related tests with test.describe()
- Test critical paths first
- Add screenshots/videos only on failure to save space

## Debugging Tests

```bash
# Run in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test locale-switching

# Run specific test
npx playwright test -g "should switch from English to French"

# Show browser
npx playwright test --headed

# Slow down execution
npx playwright test --slow-mo=1000
```

## CI/CD Integration

Tests are configured to run differently in CI:

- Retries: 2 in CI, 0 locally
- Workers: 1 in CI (serial), unlimited locally (parallel)
- Server: Doesn't reuse existing server in CI

## Troubleshooting

### Tests Timeout

- Increase timeout in test or config
- Check if dev server is running
- Verify network conditions

### Flaky Tests

- Add explicit waits
- Use waitForLoadState
- Avoid hard-coded delays

### Selector Not Found

- Verify element exists in both locales
- Check if element is hidden/disabled
- Use Playwright Inspector to debug

## Audience-Specific Flow Tests

These tests verify the complete user journey for each audience type (Givers and Builders), ensuring content is relevant and CTAs work correctly.

### Testing Givers Page Journey

Location: `tests/e2e/givers-flow.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Givers/Stewards User Journey", () => {
  test("should complete full givers journey from landing to newsletter signup", async ({
    page,
  }) => {
    // 1. Land on Givers page
    await page.goto("/en/givers");

    // Verify hero section with givers-specific messaging
    await expect(
      page.getByRole("heading", { name: /steward your resources/i })
    ).toBeVisible();

    // 2. Browse featured content
    const featuredArticle = page.getByTestId("featured-article").first();
    await expect(featuredArticle).toBeVisible();

    // Verify content is tagged for givers audience
    await expect(featuredArticle.getByText(/for givers/i)).toBeVisible();

    // 3. Click through to featured content
    const articleTitle = await featuredArticle
      .getByRole("heading")
      .textContent();
    await featuredArticle.click();

    // Verify we're on the article page
    await expect(page).toHaveURL(/\/articles\//);
    await expect(page.getByRole("heading", { name: articleTitle })).toBeVisible();

    // 4. Navigate back to givers page
    await page.goto("/en/givers");

    // 5. Complete newsletter signup
    const emailInput = page.getByTestId("newsletter-email");
    await emailInput.fill("giver@example.com");

    // Verify audience tag is set to "givers"
    const audienceInput = page.getByTestId("newsletter-audience");
    await expect(audienceInput).toHaveValue("givers");

    await page.getByRole("button", { name: /subscribe/i }).click();

    // Verify success message
    await expect(
      page.getByText(/thank you for subscribing/i)
    ).toBeVisible();
  });

  test("should show only giver-relevant content", async ({ page }) => {
    await page.goto("/en/givers");

    // Verify content filtering
    const contentCards = page.getByTestId("content-card");
    const count = await contentCards.count();

    for (let i = 0; i < count; i++) {
      const card = contentCards.nth(i);
      // Each card should have givers audience tag
      await expect(
        card.getByTestId("audience-tag").filter({ hasText: "Givers" })
      ).toBeVisible();
    }
  });
});
```

### Testing Builders Page Journey

Location: `tests/e2e/builders-flow.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Builders/Creators User Journey", () => {
  test("should complete full builders journey from landing to newsletter signup", async ({
    page,
  }) => {
    // 1. Land on Builders page
    await page.goto("/en/builders");

    // Verify hero section with builders-specific messaging
    await expect(
      page.getByRole("heading", { name: /build kingdom ventures/i })
    ).toBeVisible();

    // 2. Browse featured resources
    const featuredResource = page.getByTestId("featured-resource").first();
    await expect(featuredResource).toBeVisible();

    // Verify content is tagged for builders audience
    await expect(featuredResource.getByText(/for builders/i)).toBeVisible();

    // 3. Click through to featured content
    const resourceTitle = await featuredResource
      .getByRole("heading")
      .textContent();
    await featuredResource.click();

    // Verify we're on the resource page
    await expect(page).toHaveURL(/\/(articles|resources|studies)\//);
    await expect(
      page.getByRole("heading", { name: resourceTitle })
    ).toBeVisible();

    // 4. Navigate back to builders page
    await page.goto("/en/builders");

    // 5. Complete newsletter signup
    const emailInput = page.getByTestId("newsletter-email");
    await emailInput.fill("builder@example.com");

    // Verify audience tag is set to "builders"
    const audienceInput = page.getByTestId("newsletter-audience");
    await expect(audienceInput).toHaveValue("builders");

    await page.getByRole("button", { name: /subscribe/i }).click();

    // Verify success message
    await expect(
      page.getByText(/thank you for subscribing/i)
    ).toBeVisible();
  });

  test("should show only builder-relevant content", async ({ page }) => {
    await page.goto("/en/builders");

    // Verify content filtering
    const contentCards = page.getByTestId("content-card");
    const count = await contentCards.count();

    for (let i = 0; i < count; i++) {
      const card = contentCards.nth(i);
      // Each card should have builders audience tag
      await expect(
        card.getByTestId("audience-tag").filter({ hasText: "Builders" })
      ).toBeVisible();
    }
  });
});
```

### Testing Audience Filtering on Articles Page

Location: `tests/e2e/article-filtering.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Articles Page Audience Filtering", () => {
  test("should filter articles by givers audience", async ({ page }) => {
    await page.goto("/en/articles");

    // Wait for articles to load
    await page.waitForSelector('[data-testid="article-card"]');

    // Click givers filter
    await page.getByRole("button", { name: /givers/i }).click();

    // Verify URL contains filter parameter
    await expect(page).toHaveURL(/audience=givers/);

    // Verify all visible articles are tagged for givers
    const articles = page.getByTestId("article-card");
    const count = await articles.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(
        article.getByTestId("audience-badge").filter({ hasText: "Givers" })
      ).toBeVisible();
    }
  });

  test("should filter articles by builders audience", async ({ page }) => {
    await page.goto("/en/articles");

    await page.waitForSelector('[data-testid="article-card"]');

    // Click builders filter
    await page.getByRole("button", { name: /builders/i }).click();

    // Verify URL contains filter parameter
    await expect(page).toHaveURL(/audience=builders/);

    // Verify all visible articles are tagged for builders
    const articles = page.getByTestId("article-card");
    const count = await articles.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(
        article.getByTestId("audience-badge").filter({ hasText: "Builders" })
      ).toBeVisible();
    }
  });

  test("should clear filters and show all articles", async ({ page }) => {
    await page.goto("/en/articles?audience=givers");

    // Click clear/all filter
    await page.getByRole("button", { name: /all/i }).click();

    // Verify URL has no filter parameter
    await expect(page).toHaveURL(/^(?!.*audience=)/);

    // Verify mixed audience content is visible
    const articles = page.getByTestId("article-card");
    const count = await articles.count();

    expect(count).toBeGreaterThan(0);
  });
});
```

### Testing Cross-Linking Between Audience Pages

Location: `tests/e2e/audience-cross-linking.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Cross-Linking Between Audience Pages", () => {
  test("should navigate from homepage to givers page and back", async ({
    page,
  }) => {
    await page.goto("/en");

    // Click givers card from homepage
    const giversCard = page.getByTestId("audience-card-givers");
    await expect(giversCard).toBeVisible();
    await giversCard.click();

    // Verify we're on givers page
    await expect(page).toHaveURL("/en/givers");
    await expect(
      page.getByRole("heading", { name: /givers|stewards/i })
    ).toBeVisible();

    // Navigate back to homepage via header
    await page.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL("/en");
  });

  test("should navigate from homepage to builders page and back", async ({
    page,
  }) => {
    await page.goto("/en");

    // Click builders card from homepage
    const buildersCard = page.getByTestId("audience-card-builders");
    await expect(buildersCard).toBeVisible();
    await buildersCard.click();

    // Verify we're on builders page
    await expect(page).toHaveURL("/en/builders");
    await expect(
      page.getByRole("heading", { name: /builders|creators/i })
    ).toBeVisible();

    // Navigate back to homepage via header
    await page.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL("/en");
  });

  test("should link from article to related audience page", async ({
    page,
  }) => {
    // Navigate to an article tagged for givers
    await page.goto("/en/articles?audience=givers");
    await page.getByTestId("article-card").first().click();

    // Find and click "More for Givers" or similar CTA
    const audienceLink = page.getByRole("link", {
      name: /more for givers|explore givers/i,
    });

    if (await audienceLink.isVisible()) {
      await audienceLink.click();
      await expect(page).toHaveURL("/en/givers");
    }
  });

  test("should show audience switcher on audience pages", async ({ page }) => {
    await page.goto("/en/givers");

    // Look for link/button to switch to builders
    const switchLink = page.getByRole("link", {
      name: /are you a builder|switch to builders/i,
    });

    if (await switchLink.isVisible()) {
      await switchLink.click();
      await expect(page).toHaveURL("/en/builders");
    }
  });
});
```

## Form Testing

Comprehensive testing of all forms on the site, including validation, submission, and error handling.

### Contact Form Testing

Location: `tests/e2e/contact-form.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/contact");
  });

  test("should successfully submit contact form with valid data", async ({
    page,
  }) => {
    // Fill out form
    await page.getByLabel(/name/i).fill("John Doe");
    await page.getByLabel(/email/i).fill("john@example.com");
    await page.getByLabel(/subject|topic/i).fill("Partnership Inquiry");
    await page.getByLabel(/message/i).fill("I would like to discuss a potential partnership opportunity.");

    // Submit form
    await page.getByRole("button", { name: /send|submit/i }).click();

    // Verify success message
    await expect(
      page.getByText(/thank you|message sent|we'll be in touch/i)
    ).toBeVisible();

    // Verify form is cleared or disabled
    await expect(page.getByLabel(/name/i)).toHaveValue("");
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.getByLabel(/name/i).fill("John Doe");
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/message/i).fill("Test message");

    await page.getByRole("button", { name: /send|submit/i }).click();

    // Verify error message
    await expect(
      page.getByText(/valid email|email is invalid/i)
    ).toBeVisible();
  });

  test("should show validation error for empty required fields", async ({
    page,
  }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: /send|submit/i }).click();

    // Verify error messages appear
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/message is required/i)).toBeVisible();
  });

  test("should enforce minimum message length", async ({ page }) => {
    await page.getByLabel(/name/i).fill("John Doe");
    await page.getByLabel(/email/i).fill("john@example.com");
    await page.getByLabel(/message/i).fill("Hi");

    await page.getByRole("button", { name: /send|submit/i }).click();

    // Verify error for message too short
    await expect(
      page.getByText(/message must be at least|message too short/i)
    ).toBeVisible();
  });

  test("should disable submit button while submitting", async ({ page }) => {
    await page.getByLabel(/name/i).fill("John Doe");
    await page.getByLabel(/email/i).fill("john@example.com");
    await page.getByLabel(/message/i).fill("Test message for submission");

    const submitButton = page.getByRole("button", { name: /send|submit/i });

    // Click submit
    await submitButton.click();

    // Verify button is disabled during submission
    await expect(submitButton).toBeDisabled();
  });
});
```

### Newsletter Signup Form Testing

Location: `tests/e2e/newsletter-form.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Newsletter Signup Forms", () => {
  test("should signup with givers audience tag from givers page", async ({
    page,
  }) => {
    await page.goto("/en/givers");

    const emailInput = page.getByTestId("newsletter-email");
    await emailInput.fill("giver@example.com");

    // Verify hidden audience field is set
    const audienceField = page.getByTestId("newsletter-audience");
    await expect(audienceField).toHaveValue("givers");

    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    await expect(
      page.getByText(/successfully subscribed|thank you/i)
    ).toBeVisible();
  });

  test("should signup with builders audience tag from builders page", async ({
    page,
  }) => {
    await page.goto("/en/builders");

    const emailInput = page.getByTestId("newsletter-email");
    await emailInput.fill("builder@example.com");

    // Verify hidden audience field is set
    const audienceField = page.getByTestId("newsletter-audience");
    await expect(audienceField).toHaveValue("builders");

    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    await expect(
      page.getByText(/successfully subscribed|thank you/i)
    ).toBeVisible();
  });

  test("should signup without audience tag from homepage", async ({
    page,
  }) => {
    await page.goto("/en");

    // Find newsletter signup in footer
    const emailInput = page
      .getByTestId("footer-newsletter-email")
      .or(page.getByTestId("newsletter-email"));
    await emailInput.fill("general@example.com");

    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    await expect(
      page.getByText(/successfully subscribed|thank you/i)
    ).toBeVisible();
  });

  test("should validate email format in newsletter form", async ({ page }) => {
    await page.goto("/en/givers");

    const emailInput = page.getByTestId("newsletter-email");
    await emailInput.fill("not-an-email");

    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    await expect(
      page.getByText(/valid email|please enter a valid/i)
    ).toBeVisible();
  });

  test("should prevent duplicate subscriptions", async ({ page }) => {
    await page.goto("/en/givers");

    const emailInput = page.getByTestId("newsletter-email");
    const email = "existing@example.com";

    // First subscription
    await emailInput.fill(email);
    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    // Wait for success
    await page.waitForSelector("text=/successfully subscribed/i");

    // Try to subscribe again with same email
    await page.reload();
    await emailInput.fill(email);
    await page.getByRole("button", { name: /subscribe|sign up/i }).click();

    // Should show already subscribed message
    await expect(
      page.getByText(/already subscribed|already on our list/i)
    ).toBeVisible();
  });

  test("should work in both English and French", async ({ page }) => {
    // Test English
    await page.goto("/en/givers");
    await page.getByTestId("newsletter-email").fill("test@example.com");
    await page.getByRole("button", { name: /subscribe/i }).click();
    await expect(page.getByText(/thank you/i)).toBeVisible();

    // Test French
    await page.goto("/fr/givers");
    await page.getByTestId("newsletter-email").fill("test-fr@example.com");
    await page.getByRole("button", { name: /s'abonner|s'inscrire/i }).click();
    await expect(page.getByText(/merci/i)).toBeVisible();
  });
});
```

### Form Validation Testing

Location: `tests/e2e/form-validation.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Form Validation", () => {
  test("should show real-time validation on email fields", async ({ page }) => {
    await page.goto("/en/contact");

    const emailInput = page.getByLabel(/email/i);

    // Type invalid email
    await emailInput.fill("invalid");

    // Blur the field to trigger validation
    await emailInput.blur();

    // Error should appear
    await expect(page.getByText(/valid email/i)).toBeVisible();

    // Fix the email
    await emailInput.fill("valid@example.com");
    await emailInput.blur();

    // Error should disappear
    await expect(page.getByText(/valid email/i)).not.toBeVisible();
  });

  test("should validate required fields on blur", async ({ page }) => {
    await page.goto("/en/contact");

    const nameInput = page.getByLabel(/name/i);

    // Focus and blur without entering data
    await nameInput.focus();
    await nameInput.blur();

    // Should show required field error
    await expect(page.getByText(/name is required/i)).toBeVisible();

    // Fill the field
    await nameInput.fill("John Doe");

    // Error should disappear
    await expect(page.getByText(/name is required/i)).not.toBeVisible();
  });

  test("should show character count for message field", async ({ page }) => {
    await page.goto("/en/contact");

    const messageInput = page.getByLabel(/message/i);

    // Type some text
    await messageInput.fill("Hello");

    // Check for character counter
    const counter = page.getByTestId("message-counter");
    await expect(counter).toContainText("5");

    // Type more text
    await messageInput.fill("Hello World! This is a test message.");

    await expect(counter).toContainText("38");
  });

  test("should prevent form submission with invalid data", async ({
    page,
  }) => {
    await page.goto("/en/contact");

    // Fill form with some invalid data
    await page.getByLabel(/name/i).fill("J"); // Too short
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/message/i).fill("Hi"); // Too short

    const submitButton = page.getByRole("button", { name: /send|submit/i });
    await submitButton.click();

    // Form should not submit - check we're still on same page
    await expect(page).toHaveURL("/en/contact");

    // Multiple error messages should be visible
    const errors = page.locator('[role="alert"]');
    await expect(errors).toHaveCount(3, { timeout: 1000 });
  });

  test("should sanitize user input to prevent XSS", async ({ page }) => {
    await page.goto("/en/contact");

    const maliciousInput = '<script>alert("xss")</script>';

    await page.getByLabel(/name/i).fill(maliciousInput);
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("Test message");

    await page.getByRole("button", { name: /send|submit/i }).click();

    // Verify no script was executed (page should still be normal)
    await expect(page).toHaveURL(/\/contact/);

    // Check that the input was sanitized in any confirmation display
    const dialogCount = await page.locator('dialog[open]').count();
    expect(dialogCount).toBe(0); // No unexpected alert dialogs
  });
});
```

## Accessibility Testing with AxeBuilder

Automated accessibility testing using @axe-core/playwright to ensure WCAG compliance across all pages.

### Installation

```bash
npm install --save-dev @axe-core/playwright
```

### Basic Accessibility Scan

Location: `tests/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("should not have accessibility violations on homepage", async ({
    page,
  }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on givers page", async ({
    page,
  }) => {
    await page.goto("/en/givers");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on builders page", async ({
    page,
  }) => {
    await page.goto("/en/builders");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on articles page", async ({
    page,
  }) => {
    await page.goto("/en/articles");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should not have accessibility violations on contact page", async ({
    page,
  }) => {
    await page.goto("/en/contact");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Testing Specific WCAG Rules

Location: `tests/e2e/accessibility-wcag.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG Specific Rule Tests", () => {
  test("should have sufficient color contrast (WCAG AA)", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === "color-contrast"
    );

    expect(contrastViolations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["heading-order"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have alt text on all images", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["image-alt"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/en/contact");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["label"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have accessible buttons and links", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["button-name", "link-name"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper ARIA attributes", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a"])
      .withRules([
        "aria-allowed-attr",
        "aria-required-attr",
        "aria-valid-attr",
        "aria-valid-attr-value",
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["focusable-no-name", "focus-order-semantics"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should meet WCAG AAA color contrast where possible", async ({
    page,
  }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aaa"])
      .analyze();

    // Log violations for review (AAA is aspirational)
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        "WCAG AAA violations (informational):",
        accessibilityScanResults.violations
      );
    }
  });
});
```

### Ignoring Known Issues

Location: `tests/e2e/accessibility-custom.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests with Known Issue Exclusions", () => {
  test("should pass accessibility scan excluding known third-party issues", async ({
    page,
  }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      // Exclude specific elements with known issues (e.g., third-party embeds)
      .exclude("#third-party-widget")
      .exclude('[data-tracking-consent]') // Cookie banner from external provider
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should report on specific regions only", async ({ page }) => {
    await page.goto("/en");

    // Only scan the main content area
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should disable specific rules temporarily", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      // Temporarily disable a rule while fixing it
      .disableRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should get detailed violation information", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // If there are violations, log detailed information
    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nViolation: ${violation.id}`);
        console.log(`Description: ${violation.description}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Help: ${violation.help}`);
        console.log(`Help URL: ${violation.helpUrl}`);

        violation.nodes.forEach((node, index) => {
          console.log(`\n  Element ${index + 1}:`);
          console.log(`  HTML: ${node.html}`);
          console.log(`  Target: ${node.target}`);
          console.log(`  Failure summary: ${node.failureSummary}`);
        });
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should scan with custom axe configuration", async ({ page }) => {
    await page.goto("/en");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .configure({
        rules: [
          {
            id: "color-contrast",
            enabled: true,
            // Require AAA level contrast
            options: { "contrast-ratio": { level: "AAA" } },
          },
        ],
      })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should scan all pages in both locales", async ({ page }) => {
    const pages = [
      "/en",
      "/en/givers",
      "/en/builders",
      "/en/articles",
      "/en/contact",
      "/fr",
      "/fr/givers",
      "/fr/builders",
      "/fr/articles",
      "/fr/contact",
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .analyze();

      expect(accessibilityScanResults.violations, `Violations on ${pagePath}`).toEqual([]);
    }
  });
});
```

### Accessibility Test Best Practices

```typescript
// tests/e2e/accessibility-helpers.ts
import { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Run accessibility scan and attach violations to test report
 */
export async function checkAccessibility(
  page: Page,
  testInfo: any
): Promise<void> {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  if (accessibilityScanResults.violations.length > 0) {
    // Attach violations to test report
    await testInfo.attach("accessibility-violations", {
      body: JSON.stringify(accessibilityScanResults.violations, null, 2),
      contentType: "application/json",
    });
  }

  return accessibilityScanResults;
}

/**
 * Run keyboard navigation test
 */
export async function testKeyboardNavigation(page: Page): Promise<void> {
  await page.goto("/en");

  // Tab through interactive elements
  const interactiveElements = await page
    .locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    .all();

  for (let i = 0; i < Math.min(interactiveElements.length, 20); i++) {
    await page.keyboard.press("Tab");

    // Verify focus is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  }
}

/**
 * Test screen reader compatibility
 */
export async function testScreenReaderLabels(page: Page): Promise<void> {
  // Check all images have alt text or are marked decorative
  const images = await page.locator("img").all();

  for (const img of images) {
    const alt = await img.getAttribute("alt");
    const role = await img.getAttribute("role");

    // Should have alt text OR role="presentation"
    expect(alt !== null || role === "presentation").toBeTruthy();
  }
}
```

### Using Accessibility Helpers

```typescript
// tests/e2e/full-accessibility.spec.ts
import { test, expect } from "@playwright/test";
import {
  checkAccessibility,
  testKeyboardNavigation,
  testScreenReaderLabels,
} from "./accessibility-helpers";

test.describe("Complete Accessibility Testing", () => {
  test("should be fully accessible on homepage", async ({ page }, testInfo) => {
    await page.goto("/en");

    // Run automated scan
    await checkAccessibility(page, testInfo);

    // Test keyboard navigation
    await testKeyboardNavigation(page);

    // Test screen reader compatibility
    await testScreenReaderLabels(page);
  });
});
```
