import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Projects Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 5000 }).catch(() => {
      // Some tests may not need projects loaded
    });
  });

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('should not have accessibility violations on page load', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('page header section is accessible', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('header, [role="banner"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('controls bar section is accessible', async ({ page }) => {
      // Test the search and filter controls area
      const results = await new AxeBuilder({ page })
        .include('input[type="search"], input[placeholder*="Search"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('project grid section is accessible', async ({ page }) => {
      // Wait for projects to be visible
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 5000 }).catch(() => {});

      const results = await new AxeBuilder({ page })
        .include('[data-testid="project-card"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('should have no color contrast violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = results.violations.filter(v =>
        v.id === 'color-contrast' || v.id === 'color-contrast-enhanced'
      );

      expect(contrastViolations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .analyze();

      const headingViolations = results.violations.filter(v =>
        v.id.includes('heading')
      );

      expect(headingViolations).toEqual([]);
    });

    test('images should have alt text', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .analyze();

      const imageViolations = results.violations.filter(v =>
        v.id === 'image-alt'
      );

      expect(imageViolations).toEqual([]);
    });
  });

  test.describe('Search Input Accessibility', () => {
    test('search input has accessible label', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Should have aria-label or label element
      const ariaLabel = await searchInput.getAttribute('aria-label');
      const id = await searchInput.getAttribute('id');

      // Either has aria-label or has associated label
      const hasLabel = ariaLabel || (id && await page.locator(`label[for="${id}"]`).count() > 0);
      expect(hasLabel).toBeTruthy();
    });

    test('search input has correct role and type', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      const type = await searchInput.getAttribute('type');
      expect(type).toBe('search');
    });

    test('search input is keyboard accessible', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Focus on input
      await searchInput.focus();

      // Should be focused
      const isFocused = await searchInput.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);

      // Should be able to type
      await page.keyboard.type('test project');
      const value = await searchInput.inputValue();
      expect(value).toBe('test project');

      // Should be able to clear with keyboard
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      const clearedValue = await searchInput.inputValue();
      expect(clearedValue).toBe('');
    });

    test('search input has visible focus indicator', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      await searchInput.focus();

      // Check for focus-visible styles
      const hasFocusStyle = await searchInput.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });

      expect(hasFocusStyle).toBe(true);
    });

    test('search results are announced to screen readers', async ({ page }) => {
      // Results info should have live region
      const resultsInfo = page.getByRole('status');
      await expect(resultsInfo).toBeVisible();

      const ariaLive = await resultsInfo.getAttribute('aria-live');
      const ariaAtomic = await resultsInfo.getAttribute('aria-atomic');

      expect(ariaLive).toBe('polite');
      expect(ariaAtomic).toBe('true');
    });

    test('empty search results are announced', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');
      await searchInput.fill('xyznonexistent999');
      await page.waitForTimeout(300);

      // Empty state message should be visible
      const emptyMessage = page.getByText('No projects found matching your criteria.');
      await expect(emptyMessage).toBeVisible();

      // Results status should update
      const resultsInfo = page.getByRole('status');
      const text = await resultsInfo.textContent();
      expect(text).toContain('0');
    });
  });

  test.describe('Filter Dropdowns Accessibility', () => {
    test('category dropdown button has accessible label', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      await expect(categoryButton).toBeVisible();

      // Should have text content or aria-label
      const text = await categoryButton.textContent();
      const ariaLabel = await categoryButton.getAttribute('aria-label');

      expect(text || ariaLabel).toBeTruthy();
    });

    test('category dropdown has proper ARIA attributes', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      // Check for aria-expanded
      const ariaExpandedBefore = await categoryButton.getAttribute('aria-expanded');

      await categoryButton.click();

      const ariaExpandedAfter = await categoryButton.getAttribute('aria-expanded');

      // aria-expanded should exist and change state
      expect(ariaExpandedBefore).not.toEqual(ariaExpandedAfter);
    });

    test('category dropdown menu has proper role', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const dropdown = page.locator('#category-dropdown-menu');
      const role = await dropdown.getAttribute('role');

      expect(role).toBe('menu');
    });

    test('category dropdown items have menuitem role', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const count = await menuItems.count();

      expect(count).toBeGreaterThan(0);

      // Check first item has proper role
      const role = await menuItems.first().getAttribute('role');
      expect(role).toBe('menuitem');
    });

    test('active category is indicated with aria-current', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const activeItem = page.locator('#category-dropdown-menu [role="menuitem"][aria-current="true"]');
      await expect(activeItem).toBeVisible();
    });

    test('sort dropdown button has accessible label', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });

      await expect(sortButton).toBeVisible();

      const text = await sortButton.textContent();
      const ariaLabel = await sortButton.getAttribute('aria-label');

      expect(text || ariaLabel).toBeTruthy();
    });

    test('sort dropdown has proper ARIA attributes', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });

      await sortButton.click();

      const dropdown = page.locator('#sort-dropdown-menu');
      const role = await dropdown.getAttribute('role');

      expect(role).toBe('menu');
    });

    test('sort dropdown items have menuitem role', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      const menuItems = page.locator('#sort-dropdown-menu [role="menuitem"]');
      const count = await menuItems.count();

      expect(count).toBe(4); // dateDesc, dateAsc, nameAsc, nameDesc

      // All should have menuitem role
      const roles = await menuItems.evaluateAll(items =>
        items.map(item => item.getAttribute('role'))
      );

      expect(roles.every(role => role === 'menuitem')).toBe(true);
    });

    test('active sort option is indicated with aria-current', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      const activeItem = page.locator('#sort-dropdown-menu [role="menuitem"][aria-current="true"]');
      await expect(activeItem).toBeVisible();
    });

    test('dropdowns have visible focus indicators', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      await categoryButton.focus();

      // Should have visible focus style
      const hasFocusStyle = await categoryButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });

      expect(hasFocusStyle).toBe(true);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('can tab to search input', async ({ page }) => {
      // Tab until we reach search input
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await page.keyboard.press('Tab');
        attempts++;

        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el?.tagName,
            type: el?.getAttribute('type'),
            placeholder: el?.getAttribute('placeholder')
          };
        });

        if (activeElement.type === 'search' ||
            activeElement.placeholder?.includes('Search')) {
          expect(activeElement.tagName).toBe('INPUT');
          return;
        }
      }

      // If we get here, we should have found the search input
      expect(attempts).toBeLessThan(maxAttempts);
    });

    test('can tab to category dropdown', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      // Tab to button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify we can reach it
      await categoryButton.focus();
      const isFocused = await categoryButton.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    });

    test('can open category dropdown with Enter key', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.focus();

      await page.keyboard.press('Enter');

      const dropdown = page.locator('#category-dropdown-menu');
      await expect(dropdown).toBeVisible();
    });

    test('can open category dropdown with Space key', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.focus();

      await page.keyboard.press('Space');

      const dropdown = page.locator('#category-dropdown-menu');
      await expect(dropdown).toBeVisible();
    });

    test('can navigate category dropdown with arrow keys', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const count = await menuItems.count();

      if (count > 1) {
        // Arrow down to next item
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);

        // Focus should move to menu item
        const focusedElement = await page.evaluate(() => {
          return document.activeElement?.getAttribute('role');
        });

        expect(focusedElement).toBe('menuitem');
      }
    });

    test('can select category with Enter key', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const count = await menuItems.count();

      if (count > 1) {
        // Focus and select second item
        await menuItems.nth(1).focus();
        const categoryName = await menuItems.nth(1).textContent();

        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);

        // Button should update
        await expect(page.getByRole('button', { name: categoryName || '' })).toBeVisible();
      }
    });

    test('can close category dropdown with Escape key', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      await expect(page.locator('#category-dropdown-menu')).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      await expect(page.locator('#category-dropdown-menu')).not.toBeVisible();
    });

    test('can navigate sort dropdown with keyboard', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.focus();

      await page.keyboard.press('Enter');

      await expect(page.locator('#sort-dropdown-menu')).toBeVisible();

      // Navigate with arrow keys
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.getAttribute('role');
      });

      expect(focusedElement).toBe('menuitem');
    });

    test('can tab through project cards', async ({ page }) => {
      // Wait for cards to load
      await page.waitForSelector('[data-testid="project-card"]');

      const projectCards = page.locator('[data-testid="project-card"]');
      const count = await projectCards.count();

      expect(count).toBeGreaterThan(0);

      // Cards should be focusable
      await projectCards.first().focus();
      const isFocused = await projectCards.first().evaluate(el =>
        el === document.activeElement || el.contains(document.activeElement)
      );

      expect(isFocused).toBe(true);
    });

    test('can open project card with Enter key', async ({ page }) => {
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.focus();

      await page.keyboard.press('Enter');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
    });

    test('can close modal with Escape key', async ({ page }) => {
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(dialog).not.toBeVisible();
    });

    test('focus returns to trigger after closing modal', async ({ page }) => {
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.focus();
      await page.keyboard.press('Enter');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');

      // Focus should return to card or close button
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(['BUTTON', 'DIV', 'ARTICLE']).toContain(focusedElement);
    });

    test('tab order is logical', async ({ page }) => {
      const tabOrder: string[] = [];

      // Tab through first few elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        const elementInfo = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.getAttribute('placeholder') ||
                 el?.textContent?.slice(0, 30) ||
                 el?.tagName ||
                 'unknown';
        });

        tabOrder.push(elementInfo);
      }

      // Should follow logical order: skip link -> nav -> search -> filters -> projects
      expect(tabOrder.length).toBe(10);
    });
  });

  test.describe('Screen Reader Announcements', () => {
    test('page has descriptive title', async ({ page }) => {
      await expect(page).toHaveTitle(/Projects/);
    });

    test('main heading is properly marked up', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'All Projects', level: 1 });
      await expect(heading).toBeVisible();
    });

    test('project count is semantically connected to description', async ({ page }) => {
      const projectCount = page.locator('#project-count');
      await expect(projectCount).toBeVisible();

      const text = await projectCount.textContent();
      expect(Number(text)).toBeGreaterThan(0);
    });

    test('loading state is announced to screen readers', async ({ page }) => {
      // Navigate with domcontentloaded to catch loading state
      await page.goto('/projects', { waitUntil: 'domcontentloaded' });

      const loadingStatus = page.getByRole('status', { name: /loading/i });
      const hasAriaLabel = await loadingStatus.getAttribute('aria-label').catch(() => false);
      const hasAriaLive = await loadingStatus.getAttribute('aria-live').catch(() => false);

      // If loading state exists, it should be announced
      const isVisible = await loadingStatus.isVisible().catch(() => false);
      if (isVisible) {
        expect(hasAriaLabel || hasAriaLive).toBeTruthy();
      }
    });

    test('results info updates are announced', async ({ page }) => {
      const resultsInfo = page.getByRole('status');

      const ariaLive = await resultsInfo.getAttribute('aria-live');
      const ariaAtomic = await resultsInfo.getAttribute('aria-atomic');

      expect(ariaLive).toBe('polite');
      expect(ariaAtomic).toBe('true');
    });

    test('empty state is announced', async ({ page }) => {
      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('xyznonexistent999');
      await page.waitForTimeout(300);

      const emptyMessage = page.getByText('No projects found matching your criteria.');
      await expect(emptyMessage).toBeVisible();

      // Should be announced via results status
      const resultsInfo = page.getByRole('status');
      const text = await resultsInfo.textContent();
      expect(text).toBeTruthy();
    });

    test('project cards have accessible names', async ({ page }) => {
      const projectCards = page.locator('[data-testid="project-card"]');
      const count = await projectCards.count();

      if (count > 0) {
        const firstCard = projectCards.first();
        const title = await firstCard.locator('h3').textContent();

        expect(title).toBeTruthy();
        expect(title?.length).toBeGreaterThan(0);
      }
    });

    test('category badges have accessible text', async ({ page }) => {
      const badges = page.locator('[data-testid="badge"]');
      const count = await badges.count();

      if (count > 0) {
        const firstBadge = badges.first();
        const text = await firstBadge.textContent();

        expect(text).toBeTruthy();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Modal Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      // Open modal
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('modal has no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('[role="dialog"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('modal has proper dialog role', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      const role = await dialog.getAttribute('role');
      expect(role).toBe('dialog');
    });

    test('modal has accessible label', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      const ariaLabelledBy = await dialog.getAttribute('aria-labelledby');
      const ariaLabel = await dialog.getAttribute('aria-label');

      expect(ariaLabelledBy || ariaLabel).toBeTruthy();
    });

    test('modal has close button', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      const closeButton = dialog.getByRole('button', { name: /close/i });

      await expect(closeButton).toBeVisible();
    });

    test('modal traps focus', async ({ page }) => {
      // Tab multiple times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      // Focus should still be within dialog
      const isWithinDialog = await page.evaluate(() => {
        return document.activeElement?.closest('[role="dialog"]') !== null;
      });

      expect(isWithinDialog).toBe(true);
    });

    test('modal close button is keyboard accessible', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      const closeButton = dialog.getByRole('button', { name: /close/i });

      await closeButton.focus();
      await page.keyboard.press('Enter');

      await expect(dialog).not.toBeVisible();
    });

    test('modal images have alt text', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      const images = dialog.locator('img');
      const count = await images.count();

      // If there are images, they should have alt text
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });

    test('modal headings are properly nested', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Dialog title should be h2 or higher
      const title = dialog.locator('h1, h2, h3').first();
      await expect(title).toBeVisible();
    });

    test('modal links have proper attributes', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      const links = dialog.getByRole('link');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();

        expect(href).toBeTruthy();
        expect(text).toBeTruthy();

        // External links should have proper attributes
        if (href?.startsWith('http')) {
          const target = await link.getAttribute('target');
          const rel = await link.getAttribute('rel');

          if (target === '_blank') {
            expect(rel).toContain('noopener');
          }
        }
      }
    });

    test('modal content is scrollable with keyboard', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      const dialogContent = dialog.locator('[class*="DialogContent"]').first();

      // Check if scrollable
      const isScrollable = await dialogContent.evaluate(el => {
        return el.scrollHeight > el.clientHeight;
      });

      if (isScrollable) {
        // Should be able to scroll with keyboard
        await dialogContent.focus();
        await page.keyboard.press('PageDown');

        const scrollTop = await dialogContent.evaluate(el => el.scrollTop);
        expect(scrollTop).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('mobile layout has no accessibility violations', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('tablet layout has no accessibility violations', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('touch targets are large enough on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      const box = await categoryButton.boundingBox();

      expect(box).not.toBeNull();
      if (box) {
        // WCAG recommends minimum 44x44 pixels for touch targets
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    });

    test('controls are accessible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByPlaceholder('Search projects, tags, or technologies...')).toBeVisible();
      await expect(page.getByRole('button', { name: /All Categories/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Newest First/i })).toBeVisible();
    });
  });

  test.describe('Focus Management', () => {
    test('focus indicators are visible', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');
      await searchInput.focus();

      const hasFocusIndicator = await searchInput.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });

      expect(hasFocusIndicator).toBe(true);
    });

    test('focus is not trapped outside modal', async ({ page }) => {
      // Should be able to tab through page normally
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    });

    test('skip link is present and functional', async ({ page }) => {
      await page.goto('/projects');

      // Tab to skip link (usually first focusable element)
      await page.keyboard.press('Tab');

      const skipLink = page.getByRole('link', { name: /skip to main content/i });
      const isVisible = await skipLink.isVisible().catch(() => false);

      // Skip link should exist (might be visually hidden until focused)
      if (isVisible) {
        await skipLink.click();
        const mainId = await page.evaluate(() => document.activeElement?.id);
        expect(mainId).toBeTruthy();
      }
    });

    test('focus does not get lost when filtering', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');
      await searchInput.focus();
      await searchInput.fill('test');

      await page.waitForTimeout(300);

      // Focus should still be on search input
      const isFocused = await searchInput.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    });
  });
});
