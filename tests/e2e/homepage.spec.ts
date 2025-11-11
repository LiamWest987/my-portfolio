import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Liam West/);
  });

  test('should display hero section with name', async ({ page }) => {
    await expect(page.getByText(/Hi, I'm/)).toBeVisible();
    // Use more specific heading matcher to avoid strict mode violations (there's an sr-only h1 for SEO)
    await expect(page.getByRole('heading', { name: /Hi, I'm.*Liam West/i })).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test Projects link - use banner (header) to target header navigation specifically
    await page.getByRole('banner').getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL('/projects');

    // Navigate back
    await page.goto('/');

    // Test About link - header navigation has "About & Skills"
    await page.getByRole('banner').getByRole('link', { name: 'About & Skills', exact: true }).click();
    await expect(page).toHaveURL('/about');

    // Navigate back
    await page.goto('/');

    // Test Contact link - use banner (header) to target header navigation
    await page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/contact');
  });

  test('should display featured projects section', async ({ page }) => {
    // Use getByRole for heading to avoid strict mode violations
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).toBeVisible();
  });

  test('should have call-to-action buttons', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /View My Work/i })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Download Resume/i })
    ).toBeVisible();
  });

  test('should display about cards', async ({ page }) => {
    await expect(page.getByText('About Me')).toBeVisible();
    await expect(page.getByText('Technical Excellence')).toBeVisible();
    await expect(page.getByText('Innovation Focus')).toBeVisible();
  });

  test('should have theme toggle', async ({ page }) => {
    const themeButton = page.getByLabel(/Change theme/i);
    await expect(themeButton).toBeVisible();
  });
});
