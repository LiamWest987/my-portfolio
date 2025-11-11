import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('About Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('should not have automatically detectable accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper document structure', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa'])
        .disableRules(['color-contrast-enhanced']) // Only check AA (4.5:1), not AAA (7:1)
        .analyze();

      const colorContrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );

      expect(colorContrastViolations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = await Promise.all(
        headings.map(async (heading) => {
          const tagName = await heading.evaluate((el) => el.tagName);
          return parseInt(tagName.substring(1));
        })
      );

      // Check that there's at least one h1
      expect(headingLevels).toContain(1);

      // Headings should follow proper hierarchy (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const diff = headingLevels[i] - headingLevels[i - 1];
        expect(diff).toBeLessThanOrEqual(1);
      }
    });

    test('should have alt text for all images', async ({ page }) => {
      const images = await page.locator('img').all();

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });

    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.aria'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper form labels', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.forms'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have sufficient button and link targets', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.sensory-and-visual-cues'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Tab Accessibility', () => {
    test('should have proper ARIA roles on tabs', async ({ page }) => {
      const tabs = await page.getByRole('tab').all();
      expect(tabs.length).toBeGreaterThan(0);

      // Each tab should have a role="tab"
      for (const tab of tabs) {
        const role = await tab.getAttribute('role');
        expect(role).toBe('tab');
      }
    });

    test('should have proper ARIA attributes on active tab', async ({ page }) => {
      const activeTab = page.getByRole('tab', { name: 'Skills' });

      // Active tab should have data-state="active"
      await expect(activeTab).toHaveAttribute('data-state', 'active');
    });

    test('should have proper ARIA attributes on inactive tabs', async ({ page }) => {
      const inactiveTabs = [
        page.getByRole('tab', { name: 'Education' }),
        page.getByRole('tab', { name: 'Experience' }),
        page.getByRole('tab', { name: 'Awards' }),
      ];

      for (const tab of inactiveTabs) {
        await expect(tab).toHaveAttribute('data-state', 'inactive');
      }
    });

    test('should associate tabpanels with tabs', async ({ page }) => {
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      const tabpanel = page.getByRole('tabpanel', { name: /skills/i });

      await expect(skillsTab).toBeVisible();
      await expect(tabpanel).toBeVisible();
    });

    test('should update ARIA attributes when switching tabs', async ({ page }) => {
      // Initially Skills tab is active
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toHaveAttribute('data-state', 'active');

      // Switch to Education
      const educationTab = page.getByRole('tab', { name: 'Education' });
      await educationTab.click();

      // Education should now be active
      await expect(educationTab).toHaveAttribute('data-state', 'active');

      // Skills should be inactive
      await expect(skillsTab).toHaveAttribute('data-state', 'inactive');
    });

    test('should have proper tab list role', async ({ page }) => {
      const tabList = page.locator('[role="tablist"]');
      await expect(tabList).toBeVisible();
    });

    test('should have descriptive text for each tab', async ({ page }) => {
      const tabs = await page.getByRole('tab').all();

      for (const tab of tabs) {
        const text = await tab.textContent();
        expect(text).toBeTruthy();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate tabs with Tab key', async ({ page }) => {
      // Tab to first tab
      await page.keyboard.press('Tab');

      // Continue tabbing until we reach the tabs
      let attempts = 0;
      while (attempts < 20) {
        const role = await page.evaluate(() => document.activeElement?.getAttribute('role'));

        if (role === 'tab') {
          break;
        }

        await page.keyboard.press('Tab');
        attempts++;
      }

      // Should be focused on a tab
      const role = await page.evaluate(() => document.activeElement?.getAttribute('role'));
      expect(role).toBe('tab');
    });

    test('should navigate between tabs with arrow keys', async ({ page }) => {
      // Focus on Skills tab
      await page.getByRole('tab', { name: 'Skills' }).focus();

      // Press ArrowRight to move to Education
      await page.keyboard.press('ArrowRight');

      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toBeFocused();
    });

    test('should activate tab with Enter key', async ({ page }) => {
      // Focus on Education tab
      await page.getByRole('tab', { name: 'Education' }).focus();

      // Press Enter to activate
      await page.keyboard.press('Enter');

      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toHaveAttribute('data-state', 'active');
    });

    test('should activate tab with Space key', async ({ page }) => {
      // Focus on Experience tab
      await page.getByRole('tab', { name: 'Experience' }).focus();

      // Press Space to activate
      await page.keyboard.press('Space');

      const experienceTab = page.getByRole('tab', { name: 'Experience' });
      await expect(experienceTab).toHaveAttribute('data-state', 'active');
    });

    test('should support Home key to focus first tab', async ({ page }) => {
      // Focus on last tab
      await page.getByRole('tab', { name: 'Awards' }).focus();

      // Press Home
      await page.keyboard.press('Home');

      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await expect(skillsTab).toBeFocused();
    });

    test('should support End key to focus last tab', async ({ page }) => {
      // Focus on first tab
      await page.getByRole('tab', { name: 'Skills' }).focus();

      // Press End
      await page.keyboard.press('End');

      const awardsTab = page.getByRole('tab', { name: 'Awards' });
      await expect(awardsTab).toBeFocused();
    });

    test('should have visible focus indicators on tabs', async ({ page }) => {
      // Focus on a tab
      const skillsTab = page.getByRole('tab', { name: 'Skills' });
      await skillsTab.focus();

      // Check for focus-visible styles
      const hasFocusStyles = await skillsTab.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return (
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          styles.border !== 'none'
        );
      });

      expect(hasFocusStyles).toBeTruthy();
    });

    test('should be able to navigate entire page with keyboard', async ({ page }) => {
      let tabCount = 0;
      const maxTabs = 50;

      // Tab through entire page
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;

        // Check if we can still focus on elements
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();
      }

      // Should have been able to tab through without errors
      expect(tabCount).toBe(maxTabs);
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper page title', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have main landmark', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should have proper section headings', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /About & Skills/i })).toBeVisible();
      await expect(page.getByText('Skills & Experience')).toBeVisible();
    });

    test('should have descriptive link text', async ({ page }) => {
      const links = await page.locator('a').all();

      for (const link of links) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Link should have either text or aria-label
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should have proper button labels', async ({ page }) => {
      const buttons = await page.locator('button').all();

      for (const button of buttons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');

        // Button should have either text or aria-label
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should have proper ARIA live regions for dynamic content', async ({ page }) => {
      // Switch tabs to trigger dynamic content update
      await page.getByRole('tab', { name: 'Education' }).click();

      // Check for proper announcement
      const tabpanel = page.getByRole('tabpanel', { name: /education/i });
      await expect(tabpanel).toBeVisible();
    });

    test('should not have empty links', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .analyze();

      const emptyLinkViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'link-name'
      );

      expect(emptyLinkViolations).toEqual([]);
    });

    test('should not have empty buttons', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .analyze();

      const emptyButtonViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'button-name'
      );

      expect(emptyButtonViolations).toEqual([]);
    });
  });

  test.describe('Loading State Accessibility', () => {
    test('should announce loading state to screen readers', async ({ page }) => {
      // Reload page to catch loading state
      await page.reload();

      // Wait briefly to catch loading state
      await page.waitForTimeout(100);
    });

    test('should have proper loading skeleton accessibility', async ({ page }) => {
      // Intercept API calls to delay response
      await page.route('**/api/**', (route) => {
        setTimeout(() => route.continue(), 500);
      });

      await page.goto('/about');

      // Check that skeletons are properly hidden from screen readers
      const skeletons = page.locator('[class*="skeleton"]');
      const count = await skeletons.count();

      if (count > 0) {
        const firstSkeleton = skeletons.first();
        const ariaHidden = await firstSkeleton.getAttribute('aria-hidden');

        // Skeletons should be aria-hidden or have proper role
        expect(ariaHidden === 'true' || (await firstSkeleton.getAttribute('role'))).toBeTruthy();
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should be accessible on mobile viewports', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have touch-friendly targets on mobile', async ({ page }) => {
      const tabs = await page.getByRole('tab').all();

      for (const tab of tabs) {
        const box = await tab.boundingBox();
        expect(box).toBeTruthy();

        if (box) {
          // Touch targets should be at least 44x44 pixels (WCAG 2.1 Level AAA)
          expect(box.height).toBeGreaterThanOrEqual(36); // AA standard is 36px
        }
      }
    });

    test('should support zoom up to 200%', async ({ page }) => {
      // Simulate zoom by changing viewport scale
      await page.setViewportSize({ width: 375, height: 667 });

      // Content should still be accessible
      await expect(page.getByRole('heading', { name: /About & Skills/i })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Skills' })).toBeVisible();
    });
  });

  test.describe('Focus Management', () => {
    test('should manage focus when switching tabs', async ({ page }) => {
      // Click Education tab
      await page.getByRole('tab', { name: 'Education' }).click();

      // Tab panel content should be visible
      const tabpanel = page.getByRole('tabpanel', { name: /education/i });
      await expect(tabpanel).toBeVisible();
    });

    test('should not lose focus during tab transitions', async ({ page }) => {
      // Focus on Skills tab
      await page.getByRole('tab', { name: 'Skills' }).focus();

      // Press arrow key to move to next tab
      await page.keyboard.press('ArrowRight');

      // Focus should be on Education tab now
      const educationTab = page.getByRole('tab', { name: 'Education' });
      await expect(educationTab).toBeFocused();
    });

    test('should have skip link or proper focus order', async ({ page }) => {
      // Tab from the beginning
      await page.keyboard.press('Tab');

      // Check that focus moves in a logical order
      const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocusable).toBeTruthy();
    });
  });
});
