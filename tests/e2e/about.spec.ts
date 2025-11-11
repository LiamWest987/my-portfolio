import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test.describe('Tab Navigation', () => {
    test('should display all four tabs', async ({ page }) => {
      await expect(page.getByRole('tab', { name: 'Skills' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Education' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Experience' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Awards' })).toBeVisible();
    });

    test('should default to Skills tab', async ({ page }) => {
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toHaveAttribute('data-state', 'active');
    });

    test('should switch to Education tab on click', async ({ page }) => {
      await page.getByRole('tab', { name: 'Education' }).click();

      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toHaveAttribute('data-state', 'active');

      // Verify Skills tab is no longer active
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toHaveAttribute('data-state', 'inactive');
    });

    test('should switch to Experience tab on click', async ({ page }) => {
      await page.getByRole('tab', { name: 'Experience' }).click();

      const experienceTab = page.getByRole('tab', { name: 'Experience' });
      await expect(experienceTab).toHaveAttribute('data-state', 'active');
    });

    test('should switch to Awards tab on click', async ({ page }) => {
      await page.getByRole('tab', { name: 'Awards' }).click();

      const awardsTab = page.getByRole('tab', { name: 'Awards' });
      await expect(awardsTab).toHaveAttribute('data-state', 'active');
    });

    test('should maintain tab state when navigating between tabs', async ({ page }) => {
      // Navigate through all tabs
      await page.getByRole('tab', { name: 'Education' }).click();
      await page.getByRole('tab', { name: 'Experience' }).click();
      await page.getByRole('tab', { name: 'Awards' }).click();
      await page.getByRole('tab', { name: 'Skills' }).click();

      // Verify Skills tab is active again
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toHaveAttribute('data-state', 'active');
    });
  });

  test.describe('Tab Content Display', () => {
    test('should display Skills content by default', async ({ page }) => {
      const skillsContent = page.getByRole('tabpanel', { name: /skills/i });
      await expect(skillsContent).toBeVisible();
    });

    test('should display Education content when tab is clicked', async ({ page }) => {
      await page.getByRole('tab', { name: 'Education' }).click();

      const educationContent = page.getByRole('tabpanel', { name: /education/i });
      await expect(educationContent).toBeVisible();
    });

    test('should display Experience content when tab is clicked', async ({ page }) => {
      await page.getByRole('tab', { name: 'Experience' }).click();

      const experienceContent = page.getByRole('tabpanel', { name: /experience/i });
      await expect(experienceContent).toBeVisible();
    });

    test('should display Awards content when tab is clicked', async ({ page }) => {
      await page.getByRole('tab', { name: 'Awards' }).click();

      // Wait for content to load
      await page.waitForTimeout(500);
      const awardsContent = page.locator('[role="tabpanel"][data-state="active"]');
      await expect(awardsContent).toBeVisible();
    });

    test('should hide inactive tab content', async ({ page }) => {
      await page.getByRole('tab', { name: 'Education' }).click();

      // Skills content should not be visible
      const skillsContent = page.getByRole('tabpanel', { name: /skills/i });
      await expect(skillsContent).toBeHidden();
    });
  });

  test.describe('Keyboard Arrow Navigation', () => {
    test('should navigate to next tab with ArrowRight', async ({ page }) => {
      // Focus on Skills tab
      await page.getByRole('tab', { name: 'Skills' }).focus();

      // Press ArrowRight to move to Education
      await page.keyboard.press('ArrowRight');

      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toBeFocused();
    });

    test('should navigate to previous tab with ArrowLeft', async ({ page }) => {
      // Focus on Education tab
      await page.getByRole('tab', { name: 'Education' }).click();
      await page.getByRole('tab', { name: 'Education' }).focus();

      // Press ArrowLeft to move to Skills
      await page.keyboard.press('ArrowLeft');

      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toBeFocused();
    });

    test('should wrap around to first tab when pressing ArrowRight on last tab', async ({ page }) => {
      // Focus on Awards tab (last tab)
      await page.getByRole('tab', { name: 'Awards' }).click();
      await page.getByRole('tab', { name: 'Awards' }).focus();

      // Press ArrowRight should wrap to first tab
      await page.keyboard.press('ArrowRight');

      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toBeFocused();
    });

    test('should wrap around to last tab when pressing ArrowLeft on first tab', async ({ page }) => {
      // Focus on Skills tab (first tab)
      await page.getByRole('tab', { name: 'Skills' }).focus();

      // Press ArrowLeft should wrap to last tab
      await page.keyboard.press('ArrowLeft');

      const awardsTab = page.getByRole('tab', { name: 'Awards' });
      await expect(awardsTab).toBeFocused();
    });

    test('should activate tab when pressing Enter on focused tab', async ({ page }) => {
      // Focus on Education tab without clicking
      await page.getByRole('tab', { name: 'Education' }).focus();

      // Press Enter to activate
      await page.keyboard.press('Enter');

      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toHaveAttribute('data-state', 'active');
    });

    test('should activate tab when pressing Space on focused tab', async ({ page }) => {
      // Focus on Experience tab without clicking
      await page.getByRole('tab', { name: 'Experience' }).focus();

      // Press Space to activate
      await page.keyboard.press('Space');

      const experienceTab = page.getByRole('tab', { name: 'Experience' });
      await expect(experienceTab).toHaveAttribute('data-state', 'active');
    });
  });

  test.describe('Loading States', () => {
    test('should show skeleton loaders while data is loading', async ({ page }) => {
      // Intercept the API calls to delay responses
      await page.route('**/api/**', route => {
        setTimeout(() => route.continue(), 100);
      });

      await page.goto('/about');

      // Check for skeleton elements (using class or role)
      const skeletons = page.locator('[class*="skeleton"]').first();
      await expect(skeletons).toBeVisible();
    });

    test('should display loaded Skills data', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForLoadState('networkidle');

      // Check that actual content is displayed (not just skeletons)
      const skillsContent = page.getByRole('tabpanel', { name: /skills/i });
      await expect(skillsContent).toBeVisible();

      // Verify no skeleton loaders are visible
      const skeletons = page.locator('[class*="skeleton"]');
      await expect(skeletons).toHaveCount(0);
    });

    test('should display loaded Education data', async ({ page }) => {
      await page.getByRole('tab', { name: 'Education' }).click();

      // Wait for content to load
      await page.waitForLoadState('networkidle');

      const educationContent = page.getByRole('tabpanel', { name: /education/i });
      await expect(educationContent).toBeVisible();
    });

    test('should display loaded Experience data', async ({ page }) => {
      await page.getByRole('tab', { name: 'Experience' }).click();

      // Wait for content to load
      await page.waitForLoadState('networkidle');

      const experienceContent = page.getByRole('tabpanel', { name: /experience/i });
      await expect(experienceContent).toBeVisible();
    });

    test('should display loaded Awards data', async ({ page }) => {
      await page.getByRole('tab', { name: 'Awards' }).click();

      // Wait for content to load
      await page.waitForLoadState('networkidle');

      // Wait for content to load
      await page.waitForTimeout(500);
      const awardsContent = page.locator('[role="tabpanel"][data-state="active"]');
      await expect(awardsContent).toBeVisible();
    });
  });

  test.describe('Page Content', () => {
    test('should display page title and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /About & Skills/i })).toBeVisible();
      await expect(page.getByText(/Engineering student passionate about/i)).toBeVisible();
    });

    test('should display "Skills & Experience" section header', async ({ page }) => {
      await expect(page.getByText('Skills & Experience')).toBeVisible();
    });

    test('should display about cards section', async ({ page }) => {
      await expect(page.getByText('Technical Excellence')).toBeVisible();
      await expect(page.getByText('Innovation Focus')).toBeVisible();
      await expect(page.getByText('Collaborative Problem-Solving')).toBeVisible();
      await expect(page.getByText('Continuous Learning')).toBeVisible();
    });
  });
});
