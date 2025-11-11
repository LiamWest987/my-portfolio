import { test, expect } from '@playwright/test';

test.describe('Project Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"], .project-card, article', { timeout: 10000 });
  });

  test('should display modal when project card is clicked', async ({ page }) => {
    // Click first project card
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    // Check modal is visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check modal has title
    const modalTitle = modal.locator('#modal-title, [id*="title"]');
    await expect(modalTitle).toBeVisible();
  });

  test('should close modal with close button', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click close button
    const closeButton = modal.locator('button[aria-label*="Close"]').first();
    await closeButton.click();

    // Check modal is hidden
    await expect(modal).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Check modal is hidden
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click backdrop (the modal overlay itself, not its content)
    await modal.click({ position: { x: 10, y: 10 } });

    // Check modal is hidden
    await expect(modal).not.toBeVisible();
  });

  test('should navigate image gallery with next/previous buttons', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check if project has multiple images (navigation buttons present)
    const nextButton = modal.locator('button[aria-label*="Next"]');
    const prevButton = modal.locator('button[aria-label*="Previous"]');

    if (await nextButton.count() > 0) {
      // Get initial image
      const images = modal.locator('img[data-index]');
      const firstImage = images.first();
      const firstImageSrc = await firstImage.getAttribute('src');

      // Click next button
      await nextButton.click();

      // Wait a moment for transition
      await page.waitForTimeout(400);

      // Check that a different image is now visible (opacity-100)
      const visibleImage = modal.locator('img[data-index].opacity-100');
      const newImageSrc = await visibleImage.getAttribute('src');

      // Images should be different (unless there's only one image)
      if (await images.count() > 1) {
        expect(firstImageSrc).not.toBe(newImageSrc);
      }

      // Click previous button to go back
      await prevButton.click();
      await page.waitForTimeout(400);

      // Should be back to first image
      const currentImage = modal.locator('img[data-index].opacity-100');
      const currentSrc = await currentImage.getAttribute('src');
      expect(currentSrc).toBe(firstImageSrc);
    }
  });

  test('should navigate to specific image with gallery indicators', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check if gallery indicators exist
    const indicators = modal.locator('button[aria-label*="View image"]');

    if (await indicators.count() > 1) {
      // Click second indicator
      const secondIndicator = indicators.nth(1);
      await secondIndicator.click();

      // Wait for transition
      await page.waitForTimeout(400);

      // Check that second image is visible
      const secondImage = modal.locator('img[data-index="1"]');
      await expect(secondImage).toHaveClass(/opacity-100/);

      // Check indicator is active
      await expect(secondIndicator).toHaveAttribute('aria-current', 'true');
    }
  });

  test('should display PDF download button when available', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check for PDF download button
    const pdfButton = modal.getByRole('link', { name: /View PDF|Download PDF/i });

    if (await pdfButton.count() > 0) {
      await expect(pdfButton).toBeVisible();
      await expect(pdfButton).toHaveAttribute('href');
      await expect(pdfButton).toHaveAttribute('target', '_blank');
      await expect(pdfButton).toHaveAttribute('rel', /noopener noreferrer/);
    }
  });

  test('should display demo link when available', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check for demo link
    const demoLink = modal.getByRole('link', { name: /Live Demo|View Demo/i });

    if (await demoLink.count() > 0) {
      await expect(demoLink).toBeVisible();
      await expect(demoLink).toHaveAttribute('href');
      await expect(demoLink).toHaveAttribute('target', '_blank');
      await expect(demoLink).toHaveAttribute('rel', /noopener noreferrer/);
    }
  });

  test('should trap focus within modal', async ({ page }) => {
    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Get all focusable elements in modal
    const focusableElements = modal.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();

    if (count > 0) {
      // Tab through all elements
      for (let i = 0; i < count + 1; i++) {
        await page.keyboard.press('Tab');
      }

      // Focus should still be within the modal
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.closest('[role="dialog"]') !== null;
      });

      expect(focusedElement).toBe(true);
    }
  });

  test('should restore focus to trigger element after closing', async ({ page }) => {
    // Get first project card
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();

    // Click to open modal
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Close modal
    const closeButton = modal.locator('button[aria-label*="Close"]').first();
    await closeButton.click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible();

    // Focus should be restored (checking if focus is back in the document body)
    const hasFocus = await page.evaluate(() => {
      return document.activeElement !== null && document.activeElement.tagName !== 'BODY';
    });

    expect(hasFocus).toBe(true);
  });

  test('should prevent body scroll when modal is open', async ({ page }) => {
    // Check body overflow before opening modal
    const initialOverflow = await page.evaluate(() => document.body.style.overflow);

    // Open modal
    const projectCard = page.locator('[data-testid="project-card"], .project-card, article').first();
    await projectCard.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check body overflow is hidden
    const modalOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(modalOverflow).toBe('hidden');

    // Close modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // Check body overflow is restored
    const finalOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(finalOverflow).toBe(initialOverflow);
  });
});
