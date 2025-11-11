import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Theme Toggle Button', () => {
    test('should display theme toggle button', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);
      await expect(themeButton).toBeVisible();
    });

    test('should display sun icon in light mode', async ({ page }) => {
      // Ensure we're in light mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('color-mode', 'light');
      });
      await page.reload();

      const themeButton = page.getByLabel(/Change theme/i);
      // Sun icon has class "dark:hidden" which means it's visible in light mode
      const sunIcon = themeButton.locator('svg.dark\\:hidden');

      await expect(sunIcon).toBeVisible();
    });

    test('should display moon icon in dark mode', async ({ page }) => {
      // Set dark mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-mode', 'dark');
      });
      await page.reload();

      const themeButton = page.getByLabel(/Change theme/i);
      // Moon icon has class "hidden dark:block" which means it's visible in dark mode
      const moonIcon = themeButton.locator('svg.dark\\:block');

      await expect(moonIcon).toBeVisible();
    });

    test('should have dropdown chevron icon', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);
      const chevronIcon = themeButton.locator('svg').last();

      await expect(chevronIcon).toBeVisible();
    });
  });

  test.describe('Theme Dropdown Toggle', () => {
    test('should open dropdown when theme button is clicked', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);
      await themeButton.click();

      // Wait for dropdown to appear
      await page.waitForTimeout(200);

      // Check for dropdown header
      await expect(page.getByText('Appearance')).toBeVisible();
    });

    test('should display Light and Dark options in dropdown', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);
      await themeButton.click();

      // Scope to dropdown within header to avoid strict mode violations
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await expect(dropdown.getByRole('button', { name: 'Light', exact: true })).toBeVisible();
      await expect(dropdown.getByRole('button', { name: 'Dark', exact: true })).toBeVisible();
    });

    test('should close dropdown when theme button is clicked again', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);

      // Open dropdown
      await themeButton.click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Close dropdown
      await themeButton.click();
      await page.waitForTimeout(200);

      // Dropdown should be hidden - verify by checking options are not visible
      const dropdown = page.getByTestId('theme-dropdown');
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).not.toBeVisible();
    });

    test('should rotate chevron icon when dropdown is open', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);
      const chevronIcon = themeButton.locator('svg').last();

      // Initially should not be rotated
      await expect(chevronIcon).not.toHaveClass(/rotate-180/);

      // Click to open
      await themeButton.click();

      // Should be rotated
      await expect(chevronIcon).toHaveClass(/rotate-180/);
    });
  });

  test.describe('Switch to Light Theme', () => {
    test('should switch to light theme when Light option is clicked', async ({ page }) => {
      // Start in dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-mode', 'dark');
      });
      await page.reload();

      // Open dropdown and select Light
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Light', exact: true }).click();

      // Wait for theme to update
      await page.waitForTimeout(100);

      // Check that dark class is removed from html element
      const htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).not.toContain('dark');
    });

    test('should highlight Light option when active', async ({ page }) => {
      // Ensure we're in light mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('color-mode', 'light');
      });
      await page.reload();

      // Open dropdown
      await page.getByLabel(/Change theme/i).click();

      // Light button should have active styling
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).toHaveClass(/bg-accent|text-accent-foreground/);
    });

    test('should save light theme preference to localStorage', async ({ page }) => {
      // Open dropdown and select Light
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Light', exact: true }).click();

      // Check localStorage
      const theme = await page.evaluate(() => localStorage.getItem('color-mode'));
      expect(theme).toBe('light');
    });
  });

  test.describe('Switch to Dark Theme', () => {
    test('should switch to dark theme when Dark option is clicked', async ({ page }) => {
      // Start in light mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('color-mode', 'light');
      });
      await page.reload();

      // Open dropdown and select Dark
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Dark', exact: true }).click();

      // Wait for theme to update
      await page.waitForTimeout(100);

      // Check that dark class is added to html element
      const htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark');
    });

    test('should highlight Dark option when active', async ({ page }) => {
      // Ensure we're in dark mode
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-mode', 'dark');
      });
      await page.reload();

      // Open dropdown
      await page.getByLabel(/Change theme/i).click();

      // Dark button should have active styling
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      const darkButton = dropdown.getByRole('button', { name: 'Dark', exact: true });
      await expect(darkButton).toHaveClass(/bg-accent|text-accent-foreground/);
    });

    test('should save dark theme preference to localStorage', async ({ page }) => {
      // Open dropdown and select Dark
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Dark', exact: true }).click();

      // Check localStorage
      const theme = await page.evaluate(() => localStorage.getItem('color-mode'));
      expect(theme).toBe('dark');
    });
  });

  test.describe('Theme Persistence', () => {
    test('should persist light theme across page navigation', async ({ page }) => {
      // Set light theme
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Light', exact: true }).click();
      await page.waitForTimeout(100);

      // Navigate to different pages using header navigation
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();
      await expect(page).toHaveURL('/projects');

      let htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).not.toContain('dark');

      // Navigate to About
      await page.getByRole('banner').getByRole('link', { name: /About.*Skills/i }).click();
      await expect(page).toHaveURL('/about');

      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).not.toContain('dark');

      // Navigate to Contact
      await page.getByRole('banner').getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL('/contact');

      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).not.toContain('dark');
    });

    test('should persist dark theme across page navigation', async ({ page }) => {
      // Set dark theme
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Dark', exact: true }).click();
      await page.waitForTimeout(100);

      // Navigate to different pages using header navigation
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();
      await expect(page).toHaveURL('/projects');

      let htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark');

      // Navigate to About
      await page.getByRole('banner').getByRole('link', { name: /About.*Skills/i }).click();
      await expect(page).toHaveURL('/about');

      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark');

      // Navigate to Contact
      await page.getByRole('banner').getByRole('link', { name: 'Contact' }).click();
      await expect(page).toHaveURL('/contact');

      htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark');
    });

    test('should persist theme after page reload', async ({ page }) => {
      // Set dark theme
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Dark', exact: true }).click();
      await page.waitForTimeout(100);

      // Reload page
      await page.reload();

      // Theme should still be dark
      const htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass).toContain('dark');
    });

    test('should persist theme in new browser context', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/');

      // Set light theme
      await page.getByLabel(/Change theme/i).click();
      const dropdown = page.getByRole('banner').locator('div:has-text("Appearance")').first();
      await dropdown.getByRole('button', { name: 'Light', exact: true }).click();
      await page.waitForTimeout(100);

      // Get localStorage value
      const theme = await page.evaluate(() => localStorage.getItem('color-mode'));
      expect(theme).toBe('light');

      await context.close();
    });
  });

  test.describe('Close Dropdown on Outside Click', () => {
    test('should close dropdown when clicking outside', async ({ page }) => {
      // Open dropdown
      await page.getByLabel(/Change theme/i).click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Click outside (on body)
      await page.locator('body').click({ position: { x: 50, y: 50 } });
      await page.waitForTimeout(200);

      // Dropdown should be hidden - verify by checking options are not visible
      const dropdown = page.getByTestId('theme-dropdown');
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).not.toBeVisible();
    });

    test('should close dropdown when clicking on page content', async ({ page }) => {
      // Open dropdown
      await page.getByLabel(/Change theme/i).click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Click on page heading
      await page.getByText(/Hi, I'm/).click();
      await page.waitForTimeout(200);

      // Dropdown should be hidden - verify by checking options are not visible
      const dropdown = page.getByTestId('theme-dropdown');
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).not.toBeVisible();
    });

    test('should not close dropdown when clicking inside dropdown', async ({ page }) => {
      // Open dropdown
      await page.getByLabel(/Change theme/i).click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Click on dropdown header
      const dropdown = page.getByTestId('theme-dropdown');
      await dropdown.getByText('Appearance').click();
      await page.waitForTimeout(200);

      // Dropdown should still be visible
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).toBeVisible();
    });

    test('should close dropdown after selecting a theme option', async ({ page }) => {
      // Open dropdown
      await page.getByLabel(/Change theme/i).click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Select Dark theme
      const dropdown = page.getByTestId('theme-dropdown');
      await dropdown.getByRole('button', { name: 'Dark', exact: true }).click();
      await page.waitForTimeout(200);

      // Dropdown should be closed - verify by checking options are not visible
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).not.toBeVisible();
    });
  });

  test.describe('Keyboard Accessibility', () => {
    test('should open dropdown with Enter key', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);

      // Focus on theme button
      await themeButton.focus();

      // Press Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Dropdown should be visible
      await expect(page.getByText('Appearance')).toBeVisible();
    });

    test('should open dropdown with Space key', async ({ page }) => {
      const themeButton = page.getByLabel(/Change theme/i);

      // Focus on theme button
      await themeButton.focus();

      // Press Space
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      // Dropdown should be visible
      await expect(page.getByText('Appearance')).toBeVisible();
    });

    test('should close dropdown with Escape key', async ({ page }) => {
      // Open dropdown
      await page.getByLabel(/Change theme/i).click();
      await expect(page.getByText('Appearance')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // Dropdown should be closed - verify by checking options are not visible
      const dropdown = page.getByTestId('theme-dropdown');
      const lightButton = dropdown.getByRole('button', { name: 'Light', exact: true });
      await expect(lightButton).not.toBeVisible();
    });
  });
});
