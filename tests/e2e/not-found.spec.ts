import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test.describe('404 Page Display', () => {
    test('should display 404 page for non-existent route', async ({ page }) => {
      await page.goto('/this-page-does-not-exist');

      await expect(page.getByText('404')).toBeVisible();
    });

    test('should display "Page Not Found" heading', async ({ page }) => {
      await page.goto('/non-existent-page');

      await expect(page.getByText('Page Not Found')).toBeVisible();
    });

    test('should display error message', async ({ page }) => {
      await page.goto('/invalid-route');

      await expect(page.getByText(/Sorry, the page you.*looking for.*exist/i)).toBeVisible();
    });

    test('should display 404 for deeply nested non-existent route', async ({ page }) => {
      await page.goto('/some/deeply/nested/route/that/does/not/exist');

      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
    });

    test('should display 404 for route with query parameters', async ({ page }) => {
      await page.goto('/non-existent?query=test');

      await expect(page.getByText('404')).toBeVisible();
    });

    test('should display 404 for route with special characters', async ({ page }) => {
      await page.goto('/test@#$%');

      await expect(page.getByText('404')).toBeVisible();
    });
  });

  test.describe('Return Home Button', () => {
    test('should display "Return Home" button', async ({ page }) => {
      await page.goto('/page-does-not-exist');

      const returnHomeButton = page.getByRole('link', { name: /Return Home/i });
      await expect(returnHomeButton).toBeVisible();
    });

    test('should navigate to homepage when "Return Home" is clicked', async ({ page }) => {
      await page.goto('/invalid-page');

      const returnHomeButton = page.getByRole('link', { name: /Return Home/i });
      await returnHomeButton.click();

      await expect(page).toHaveURL('/');
      await expect(page.getByText(/Hi, I'm/)).toBeVisible();
    });

    test('should have correct href attribute on Return Home button', async ({ page }) => {
      await page.goto('/not-found-route');

      const returnHomeButton = page.getByRole('link', { name: /Return Home/i });
      await expect(returnHomeButton).toHaveAttribute('href', '/');
    });

    test('should be keyboard accessible', async ({ page }) => {
      await page.goto('/missing-page');

      const returnHomeButton = page.getByRole('link', { name: /Return Home/i });

      // Focus on button
      await returnHomeButton.focus();
      await expect(returnHomeButton).toBeFocused();

      // Press Enter to navigate
      await page.keyboard.press('Enter');

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('404 Page Styling', () => {
    test('should have proper layout and centering', async ({ page }) => {
      await page.goto('/nonexistent');

      const container = page.locator('[class*="container"]').first();
      await expect(container).toBeVisible();
    });

    test('should display large 404 text', async ({ page }) => {
      await page.goto('/missing');

      const heading404 = page.getByText('404');

      // Check if it has title styling class
      await expect(heading404).toHaveClass(/title/);
    });

    test('should style Return Home button as primary', async ({ page }) => {
      await page.goto('/not-here');

      const returnHomeButton = page.getByRole('link', { name: /Return Home/i });

      // Check for primary variant styling
      await expect(returnHomeButton).toHaveClass(/primary/);
    });

    test('should have appropriate text sizing', async ({ page }) => {
      await page.goto('/nowhere');

      const subtitle = page.getByText('Page Not Found');
      await expect(subtitle).toBeVisible();

      const message = page.getByText(/Sorry, the page you.*looking for.*exist/i);
      await expect(message).toBeVisible();
    });
  });

  test.describe('Header and Footer on 404 Page', () => {
    test('should display header on 404 page', async ({ page }) => {
      await page.goto('/missing-page');

      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Logo should be visible
      const logo = page.getByRole('link', { name: /Liam West/i }).first();
      await expect(logo).toBeVisible();
    });

    test('should allow navigation from 404 page header', async ({ page }) => {
      await page.goto('/not-found');

      // Click logo to navigate home
      const logo = page.getByRole('link', { name: /Liam West/i }).first();
      await logo.click();

      await expect(page).toHaveURL('/');
    });

    test('should allow navigation to other pages from 404 header', async ({ page }) => {
      await page.goto('/invalid');

      // Navigate to Projects via header (use banner to target header specifically)
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();

      await expect(page).toHaveURL('/projects');
    });
  });

  test.describe('Error Message Content', () => {
    test('should display apologetic message', async ({ page }) => {
      await page.goto('/oops');

      await expect(page.getByText(/Sorry/i)).toBeVisible();
    });

    test('should indicate page does not exist', async ({ page }) => {
      await page.goto('/missing');

      await expect(page.getByText(/doesn.*exist/i)).toBeVisible();
    });

    test('should not display page-specific content', async ({ page }) => {
      await page.goto('/invalid');

      // Should not display homepage content
      await expect(page.getByText(/Hi, I'm.*Liam West/)).not.toBeVisible();

      // Should not display projects page content
      await expect(page.getByText('All Projects')).not.toBeVisible();
    });
  });

  test.describe('Multiple 404 Routes', () => {
    test('should handle multiple 404 navigations', async ({ page }) => {
      // First 404
      await page.goto('/first-invalid', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('404')).toBeVisible();

      // Second 404 - use domcontentloaded to avoid waiting for all resources
      await page.goto('/second-invalid', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('404')).toBeVisible();

      // Return home
      await page.getByRole('link', { name: /Return Home/i }).click();
      await expect(page).toHaveURL('/');
    });

    test('should handle navigation from valid page to 404', async ({ page }) => {
      // Start on valid page
      await page.goto('/');
      await expect(page.getByText(/Hi, I'm/)).toBeVisible();

      // Navigate to 404 - use domcontentloaded to avoid waiting for all resources
      await page.goto('/invalid-page', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('404')).toBeVisible();
    });
  });

  test.describe('Responsive 404 Page', () => {
    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/not-found');

      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
      await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/not-found');

      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
      await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
    });

    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/not-found');

      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
      await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
    });
  });
});
