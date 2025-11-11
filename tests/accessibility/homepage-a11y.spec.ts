import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('hero section is accessible', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .include('section')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focus is on a navigation link
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });

    expect(['A', 'BUTTON']).toContain(focusedElement);
  });

  test('skip to main content link works', async ({ page }) => {
    await page.goto('/');

    // Tab to skip link (first focusable element)
    await page.keyboard.press('Tab');

    // Verify skip link is focused
    const skipLinkText = await page.evaluate(() => document.activeElement?.textContent);
    expect(skipLinkText).toBe('Skip to main content');

    // Activate skip link
    await page.keyboard.press('Enter');

    // Wait for navigation to complete
    await page.waitForTimeout(100);

    // Check that main content is focused or page scrolled to main
    const mainId = await page.evaluate(() => document.activeElement?.id);
    expect(mainId).toBe('main-content');
  });
});
