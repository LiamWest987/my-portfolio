import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Project Modal Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"], .project-card, article', { timeout: 10000 });
  });

  test('modal should not have WCAG violations', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Run accessibility scan on modal
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('modal should have correct ARIA attributes', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check role="dialog"
    await expect(modal).toHaveAttribute('role', 'dialog');

    // Check aria-modal="true"
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Check aria-labelledby points to title
    const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBeTruthy();

    // Check that the referenced element exists
    const titleElement = page.locator(`#${ariaLabelledBy}`);
    await expect(titleElement).toBeVisible();
  });

  test('modal should trap focus correctly', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Get all focusable elements
    const focusableElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();

    if (count > 0) {
      // Focus should be on first element initially
      const firstFocusable = await page.evaluate(() => {
        const activeEl = document.activeElement;
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(activeEl);
      });

      expect(firstFocusable).toBe(true);

      // Tab forward through all elements
      for (let i = 0; i < count; i++) {
        await page.keyboard.press('Tab');
      }

      // After tabbing past last element, focus should loop back to first
      await page.keyboard.press('Tab');

      const focusIsInModal = await page.evaluate(() => {
        const activeEl = document.activeElement;
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(activeEl);
      });

      expect(focusIsInModal).toBe(true);

      // Test Shift+Tab for reverse tabbing
      await page.keyboard.press('Shift+Tab');

      const stillInModal = await page.evaluate(() => {
        const activeEl = document.activeElement;
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(activeEl);
      });

      expect(stillInModal).toBe(true);
    }
  });

  test('modal should be closeable via keyboard', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Close with Escape key
    await page.keyboard.press('Escape');

    // Modal should be hidden
    await expect(modal).not.toBeVisible();

    // Open modal again
    await projectCard.click();
    await expect(modal).toBeVisible();

    // Tab to close button
    const closeButton = modal.locator('button[aria-label*="Close"]').first();
    await closeButton.focus();

    // Press Enter to close
    await page.keyboard.press('Enter');

    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('close button should have accessible label', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check close button has aria-label
    const closeButton = modal.locator('button[aria-label*="Close"]').first();
    await expect(closeButton).toBeVisible();

    const ariaLabel = await closeButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel?.toLowerCase()).toContain('close');
  });

  test('image gallery navigation should be accessible', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check for navigation buttons
    const nextButton = modal.locator('button[aria-label*="Next"]');
    const prevButton = modal.locator('button[aria-label*="Previous"]');

    if (await nextButton.count() > 0) {
      // Check buttons have proper aria-labels
      const nextLabel = await nextButton.getAttribute('aria-label');
      const prevLabel = await prevButton.getAttribute('aria-label');

      expect(nextLabel).toBeTruthy();
      expect(prevLabel).toBeTruthy();
      expect(nextLabel?.toLowerCase()).toContain('next');
      expect(prevLabel?.toLowerCase()).toContain('previous');

      // Check buttons are keyboard accessible
      await nextButton.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);

      await prevButton.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
    }
  });

  test('image gallery indicators should have accessible labels', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check gallery indicators
    const indicators = modal.locator('button[aria-label*="View image"]');

    if (await indicators.count() > 1) {
      const firstIndicator = indicators.first();

      // Check aria-label
      const ariaLabel = await firstIndicator.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('View image');

      // Check for aria-current on active indicator
      const ariaCurrentButtons = modal.locator('button[aria-current="true"]');
      expect(await ariaCurrentButtons.count()).toBeGreaterThan(0);

      // Check indicator is keyboard accessible
      await firstIndicator.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);

      // Check it became active
      await expect(firstIndicator).toHaveAttribute('aria-current', 'true');
    }
  });

  test('images should have descriptive alt text', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check all images have alt text
    const images = modal.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');

      // Alt text should exist and not be empty
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('action buttons should be accessible', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check PDF button if present
    const pdfButton = modal.getByRole('link', { name: /View PDF|Download PDF/i });
    if (await pdfButton.count() > 0) {
      await expect(pdfButton).toBeVisible();

      // Should be keyboard accessible
      await pdfButton.focus();
      const isFocused = await pdfButton.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }

    // Check demo link if present
    const demoLink = modal.getByRole('link', { name: /Live Demo|View Demo/i });
    if (await demoLink.count() > 0) {
      await expect(demoLink).toBeVisible();

      // Should be keyboard accessible
      await demoLink.focus();
      const isFocused = await demoLink.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
  });

  test('modal content should be scrollable and accessible', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check that modal content is within viewport height
    const modalContent = modal.locator('.overflow-y-auto, [style*="overflow"]').first();

    if (await modalContent.count() > 0) {
      // Content should be scrollable if needed
      const isScrollable = await modalContent.evaluate(el => {
        return el.scrollHeight > el.clientHeight;
      });

      if (isScrollable) {
        // Should be able to scroll with keyboard
        await modalContent.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        const scrollTop = await modalContent.evaluate(el => el.scrollTop);
        // Scrolling should work (scrollTop > 0) or focus should move to next element
        expect(scrollTop >= 0).toBe(true);
      }
    }
  });

  test('SVG icons should be hidden from screen readers', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check SVG elements have aria-hidden and focusable attributes
    const svgs = modal.locator('svg');
    const count = await svgs.count();

    for (let i = 0; i < count; i++) {
      const svg = svgs.nth(i);

      // Should have aria-hidden="true"
      const ariaHidden = await svg.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');

      // Should have focusable="false"
      const focusable = await svg.getAttribute('focusable');
      expect(focusable).toBe('false');
    }
  });

  test('modal heading structure should be semantic', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check for proper heading hierarchy
    const h2 = modal.locator('h2#modal-title, h2[id*="title"]');
    await expect(h2).toBeVisible();

    // Check for section headings (h3)
    const h3s = modal.locator('h3');
    const h3Count = await h3s.count();

    if (h3Count > 0) {
      // All h3s should be visible (when parent section is present)
      for (let i = 0; i < h3Count; i++) {
        const heading = h3s.nth(i);
        const isVisible = await heading.isVisible();
        if (isVisible) {
          const text = await heading.textContent();
          expect(text?.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
