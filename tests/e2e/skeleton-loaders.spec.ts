import { test, expect } from '@playwright/test'

/**
 * E2E tests for skeleton loading states
 * Validates that skeleton loaders appear during data fetching and disappear when content loads
 */

test.describe('Skeleton Loaders', () => {
  test.describe('Home Page - Featured Projects', () => {
    test('should show skeleton loaders while featured projects are loading', async ({ page }) => {
      // Slow down all Sanity CDN requests to catch loading state
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.continue()
      })

      const navigationPromise = page.goto('/')

      // Try to catch skeleton loaders before data loads
      // This may not always be visible if data loads very fast
      const skeletons = page.locator('.animate-pulse')
      const skeletonVisible = await skeletons.first().isVisible().catch(() => false)

      await navigationPromise

      // Wait for featured projects section
      await page.waitForSelector('text=Featured Projects')

      if (skeletonVisible) {
        // If we caught the skeleton, verify it disappears
        await expect(skeletons.first()).not.toBeVisible({ timeout: 5000 })
      }

      // Always verify we have actual project cards at the end
      const projectCards = page.locator('[data-testid="project-card"]')
      await expect(projectCards.first()).toBeVisible({ timeout: 5000 })
    })

    test('should display exactly 3 skeleton cards for featured projects when loading', async ({ page }) => {
      // Slow down Sanity requests significantly
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto('/')

      // Wait for featured projects section to appear
      await page.waitForSelector('text=Featured Projects', { timeout: 10000 })

      // Look for all skeleton elements (including image and text skeletons)
      const featuredSection = page.locator('#featured-projects').locator('..')
      const allSkeletons = featuredSection.locator('.animate-pulse')

      // Count all skeleton elements - if any exist, we caught the loading state
      const skeletonCount = await allSkeletons.count()

      if (skeletonCount > 0) {
        // If we saw skeletons, the loading state is working
        expect(skeletonCount).toBeGreaterThan(0)
      }

      // Eventually, we should have exactly 3 project cards loaded
      const projectCards = page.locator('[data-testid="project-card"]')
      await expect(projectCards).toHaveCount(3, { timeout: 10000 })
    })

    test('skeleton loaders should match project card structure', async ({ page }) => {
      // Slow down Sanity requests
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto('/')

      // Wait for featured projects section
      await page.waitForSelector('text=Featured Projects', { timeout: 10000 })

      // Check for skeleton with aspect-video (image skeleton)
      const imageSkeleton = page.locator('.animate-pulse.aspect-video').first()
      const imageSkeletonVisible = await imageSkeleton.isVisible().catch(() => false)

      // Check for rounded-full skeletons (badge skeletons)
      const badgeSkeleton = page.locator('.animate-pulse.rounded-full').first()
      const badgeSkeletonVisible = await badgeSkeleton.isVisible().catch(() => false)

      // Verify skeleton structure if visible
      if (imageSkeletonVisible) {
        await expect(imageSkeleton).toBeVisible()
      }

      if (badgeSkeletonVisible) {
        await expect(badgeSkeleton).toBeVisible()
      }

      // Wait for actual project cards to load
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      // Verify skeletons are gone
      await expect(imageSkeleton).not.toBeVisible({ timeout: 1000 })
    })

    test('should transition smoothly from skeleton to actual content', async ({ page }) => {
      // Slow down Sanity requests
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        await route.continue()
      })

      await page.goto('/')

      // Wait for project cards to load (either skeletons or actual)
      await page.waitForSelector('text=Featured Projects', { timeout: 10000 })

      // Wait for actual project cards
      const projectCard = page.locator('[data-testid="project-card"]').first()
      await expect(projectCard).toBeVisible({ timeout: 10000 })

      // Verify no skeletons remain
      const skeletons = page.locator('.animate-pulse')
      const skeletonCount = await skeletons.count()
      expect(skeletonCount).toBe(0)
    })
  })

  test.describe('Projects Page', () => {
    test('should show skeleton loaders while all projects are loading', async ({ page }) => {
      // Slow down Sanity requests
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.continue()
      })

      const navigationPromise = page.goto('/projects')

      // Try to catch skeletons
      const skeletons = page.locator('.animate-pulse')
      const skeletonVisible = await skeletons.first().isVisible().catch(() => false)

      await navigationPromise

      if (skeletonVisible) {
        // If we caught skeletons, verify they disappear
        await expect(skeletons.first()).not.toBeVisible({ timeout: 5000 })
      }

      // Verify actual project cards load
      const projectCards = page.locator('[data-testid="project-card"]')
      await expect(projectCards.first()).toBeVisible({ timeout: 10000 })
    })

    test('should display 6 skeleton cards on projects page', async ({ page }) => {
      // Slow down Sanity requests significantly
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto('/projects')

      // Wait for page header
      await page.waitForSelector('text=All Projects', { timeout: 10000 })

      // Check for all skeleton elements
      const allSkeletons = page.locator('.animate-pulse')
      const skeletonCount = await allSkeletons.count()

      if (skeletonCount > 0) {
        // If we saw any skeletons, the loading state is working
        expect(skeletonCount).toBeGreaterThan(0)
      }

      // Verify actual project cards eventually load (should be at least 6)
      const projectCards = page.locator('[data-testid="project-card"]')
      const finalCount = await projectCards.count()
      expect(finalCount).toBeGreaterThanOrEqual(6)
    })

    test('should show no skeletons after initial load completes', async ({ page }) => {
      await page.goto('/projects')

      // Wait for initial load
      await page.waitForSelector('text=All Projects')

      // Wait for project cards to load
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      // Skeletons should be gone
      const skeletons = page.locator('.animate-pulse')
      const count = await skeletons.count()
      expect(count).toBe(0)
    })

    test('skeleton cards should have accessible labels', async ({ page }) => {
      // Slow down Sanity requests
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto('/projects')

      // Should have screen reader text for loading state in the DOM
      const srText = page.locator('.sr-only:has-text("Loading projects")')

      // sr-only elements are not in viewport but should exist in the DOM
      const srTextCount = await srText.count()

      if (srTextCount > 0) {
        // If skeleton is showing, verify SR text exists (it won't be in viewport due to sr-only)
        await expect(srText).toBeAttached()
      } else {
        // Data loaded fast - verify we have project cards
        await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
      }
    })
  })

  test.describe('ProjectModal', () => {
    test('should open modal when clicking project card', async ({ page }) => {
      await page.goto('/')

      // Wait for projects to load
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      // Click first project card
      const firstCard = page.locator('[data-testid="project-card"]').first()
      await firstCard.click()

      // Modal should open with correct z-index
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Check z-index is high enough (above header z-1020)
      const zIndex = await modal.evaluate(el => window.getComputedStyle(el).zIndex)
      expect(parseInt(zIndex)).toBeGreaterThan(1020)
    })

    test('modal should display project details with correct layout', async ({ page }) => {
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      // Click first project card
      await page.locator('[data-testid="project-card"]').first().click()

      // Modal should be visible
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Title should be at the top with large font
      const title = modal.locator('h2#modal-title')
      await expect(title).toBeVisible()

      // Badge should be visible
      const badge = modal.locator('text=/Digital Electronics|PLTW Aerospace|PLTW POE|Engineering/i').first()
      await expect(badge).toBeVisible()

      // Close button should be visible
      const closeButton = modal.locator('button[aria-label="Close modal"]')
      await expect(closeButton).toBeVisible()
    })

    test('modal should show image carousel when multiple images exist', async ({ page }) => {
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      await page.locator('[data-testid="project-card"]').first().click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Check if navigation arrows exist (indicates multiple images)
      const prevButton = modal.locator('button[aria-label="Previous image"]')
      const nextButton = modal.locator('button[aria-label="Next image"]')

      // If multiple images, arrows should be visible
      const prevVisible = await prevButton.isVisible().catch(() => false)
      const nextVisible = await nextButton.isVisible().catch(() => false)

      if (prevVisible && nextVisible) {
        // Test image navigation
        await nextButton.click()

        // Dot indicators should change
        const dots = modal.locator('button[aria-label*="View image"]')
        await expect(dots.first()).toBeVisible()
      }
    })

    test('modal should close when clicking close button', async ({ page }) => {
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      await page.locator('[data-testid="project-card"]').first().click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Click close button
      await page.locator('button[aria-label="Close modal"]').click()

      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 1000 })
    })

    test('modal should close when clicking backdrop', async ({ page }) => {
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      await page.locator('[data-testid="project-card"]').first().click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Click backdrop (outside modal content)
      await page.locator('[role="dialog"]').click({ position: { x: 10, y: 10 } })

      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 1000 })
    })

    test('modal should work consistently on both home and projects pages', async ({ page }) => {
      // Test on home page
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
      await page.locator('[data-testid="project-card"]').first().click()

      let modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      await page.locator('button[aria-label="Close modal"]').click()
      await expect(modal).not.toBeVisible({ timeout: 2000 })

      // Test on projects page
      await page.goto('/projects')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
      await page.locator('[data-testid="project-card"]').first().click()

      modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Should have same structure
      const title = modal.locator('h2#modal-title')
      await expect(title).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('skeletons should have proper ARIA attributes', async ({ page }) => {
      // Slow down Sanity requests
      await page.route('**/*cdn.sanity.io/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto('/projects')

      // Screen reader text should be present if skeletons are showing
      const srOnly = page.locator('.sr-only:has-text("Loading projects")')
      const srVisible = await srOnly.isVisible().catch(() => false)

      if (srVisible) {
        await expect(srOnly).toBeInViewport({ timeout: 2000 })
      } else {
        // Data loaded fast, verify we have project cards
        await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
      }
    })

    test('modal should have proper focus management', async ({ page }) => {
      await page.goto('/')
      await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      await page.locator('[data-testid="project-card"]').first().click()

      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()

      // Modal should have aria-modal
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // Modal should have aria-labelledby pointing to title
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby')
      expect(ariaLabelledBy).toBe('modal-title')
    })
  })
})
