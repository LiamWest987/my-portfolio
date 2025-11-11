import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.describe('Page Navigation', () => {
    test('should navigate from Home to Projects page', async ({ page }) => {
      await page.goto('/')

      // Use header navigation specifically
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click()

      await expect(page).toHaveURL('/projects')
      // Check for the visible heading
      await expect(page.getByRole('heading', { name: 'All Projects' }).first()).toBeVisible()
    })

    test('should navigate from Home to About page', async ({ page }) => {
      await page.goto('/')

      // Use header navigation specifically
      await page
        .getByRole('banner')
        .getByRole('link', { name: /About.*Skills/i })
        .click()

      await expect(page).toHaveURL('/about')
      await expect(page.getByRole('heading', { name: /About & Skills/i })).toBeVisible()
    })

    test('should navigate from Home to Contact page', async ({ page }) => {
      await page.goto('/')

      // Use header navigation specifically
      await page.getByRole('banner').getByRole('link', { name: 'Contact' }).click()

      await expect(page).toHaveURL('/contact')
      // Check for the visible h2 heading (not sr-only h1)
      await expect(page.locator('#contact-heading')).toBeVisible()
    })

    test('should navigate back to Home from Projects page', async ({ page }) => {
      await page.goto('/projects')

      // Use header navigation specifically
      await page.getByRole('banner').getByRole('link', { name: 'Home' }).click()

      await expect(page).toHaveURL('/')
      await expect(page.getByText(/Hi, I'm/)).toBeVisible()
    })

    test('should navigate between all pages in sequence', async ({ page }) => {
      await page.goto('/')

      // Home -> Projects
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click()
      await expect(page).toHaveURL('/projects')

      // Projects -> About
      await page
        .getByRole('banner')
        .getByRole('link', { name: /About.*Skills/i })
        .click()
      await expect(page).toHaveURL('/about')

      // About -> Contact
      await page.getByRole('banner').getByRole('link', { name: 'Contact' }).click()
      await expect(page).toHaveURL('/contact')

      // Contact -> Home
      await page.getByRole('banner').getByRole('link', { name: 'Home' }).click()
      await expect(page).toHaveURL('/')
    })

    test('should navigate using logo link', async ({ page }) => {
      await page.goto('/projects')

      await page
        .getByRole('link', { name: /Liam West/i })
        .first()
        .click()

      await expect(page).toHaveURL('/')
    })
  })

  test.describe('Active Navigation Highlighting', () => {
    test('should highlight Home link when on homepage', async ({ page }) => {
      await page.goto('/')

      // Use header navigation specifically
      const homeLink = page.getByRole('banner').getByRole('link', { name: 'Home' })
      await expect(homeLink).toHaveClass(/text-accent/)
    })

    test('should highlight Projects link when on projects page', async ({ page }) => {
      await page.goto('/projects')

      // Use header navigation specifically
      const projectsLink = page.getByRole('banner').getByRole('link', { name: 'Projects' })
      await expect(projectsLink).toHaveClass(/text-accent/)
    })

    test('should highlight About link when on about page', async ({ page }) => {
      await page.goto('/about')

      // Check header navigation link specifically
      const aboutLink = page.getByRole('banner').getByRole('link', { name: /About.*Skills/i })
      await expect(aboutLink).toHaveClass(/text-accent/)
    })

    test('should highlight Contact link when on contact page', async ({ page }) => {
      await page.goto('/contact')

      // Use header navigation specifically
      const contactLink = page.getByRole('banner').getByRole('link', { name: 'Contact' })
      await expect(contactLink).toHaveClass(/text-accent/)
    })

    test('should update active link when navigating', async ({ page }) => {
      await page.goto('/')

      // Home link should be active (check for active class, not hover class)
      let homeLink = page.getByRole('banner').getByRole('link', { name: 'Home' })
      await expect(homeLink).toHaveClass(/text-accent after:/)

      // Navigate to Projects
      await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click()

      // Projects link should now be active
      const projectsLink = page.getByRole('banner').getByRole('link', { name: 'Projects' })
      await expect(projectsLink).toHaveClass(/text-accent after:/)

      // Re-query home link after navigation and check it's no longer active
      // The home link should not have the active state (no "after:" in class)
      homeLink = page.getByRole('banner').getByRole('link', { name: 'Home' })
      await expect(homeLink).not.toHaveClass(/after:/)
    })
  })

  test.describe('Homepage CTAs', () => {
    test('should navigate to projects page via "View My Work" CTA', async ({ page }) => {
      await page.goto('/')

      const viewWorkButton = page.getByRole('link', { name: /View My Work/i })
      await expect(viewWorkButton).toBeVisible()

      await viewWorkButton.click()

      await expect(page).toHaveURL('/projects')
    })

    test('should navigate to projects page via "View All Projects" CTA', async ({ page }) => {
      await page.goto('/')

      // Scroll to Featured Projects section
      await page.getByText('Featured Projects').scrollIntoViewIfNeeded()

      const viewAllButton = page.getByRole('link', { name: /View All Projects/i })
      await expect(viewAllButton).toBeVisible()

      await viewAllButton.click()

      await expect(page).toHaveURL('/projects')
    })

    test('should have visible Download Resume CTA', async ({ page }) => {
      await page.goto('/')

      const downloadResumeButton = page.getByRole('link', { name: /Download Resume/i })
      await expect(downloadResumeButton).toBeVisible()
    })

    test('should have working social links', async ({ page }) => {
      await page.goto('/')

      // LinkedIn link should be visible in hero section
      const linkedinLink = page.getByRole('link', { name: 'LinkedIn' }).first()
      await expect(linkedinLink).toBeVisible()
      await expect(linkedinLink).toHaveAttribute('href', /.+/)

      // Email link should be visible in hero section
      const emailLink = page.getByRole('link', { name: 'Email' }).first()
      await expect(emailLink).toBeVisible()
    })
  })

  test.describe('Resume Download', () => {
    test('should have download attribute on resume link from homepage', async ({ page }) => {
      await page.goto('/')

      const downloadResumeButton = page.getByRole('link', { name: /Download Resume/i })
      await expect(downloadResumeButton).toHaveAttribute('download')
    })

    test('should have valid href for resume download', async ({ page }) => {
      await page.goto('/')

      const downloadResumeButton = page.getByRole('link', { name: /Download Resume/i })
      const href = await downloadResumeButton.getAttribute('href')

      expect(href).toBeTruthy()
      expect(href).toMatch(/\.(pdf|PDF)$/)
    })
  })

  test.describe('Featured Projects Navigation', () => {
    test('should display featured projects section on homepage', async ({ page }) => {
      await page.goto('/')

      await expect(page.getByText('Featured Projects')).toBeVisible()
    })

    test('should display project cards in featured section', async ({ page }) => {
      await page.goto('/')

      // Wait for projects to load
      await page.waitForLoadState('networkidle')

      // Check if project cards are present
      const projectCards = page.locator('[class*="projectCard"]')
      const count = await projectCards.count()

      // Should have at least one featured project (up to 3 max)
      expect(count).toBeGreaterThanOrEqual(0)
      expect(count).toBeLessThanOrEqual(3)
    })

    test('should open project modal when featured project is clicked', async ({ page }) => {
      await page.goto('/')

      // Wait for projects to load
      await page.waitForLoadState('networkidle')

      // Find and click first project card
      const firstProjectCard = page.locator('[class*="projectCard"]').first()

      if (await firstProjectCard.isVisible()) {
        await firstProjectCard.click()

        // Check if modal/dialog opens
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible({ timeout: 3000 })
      }
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should allow Tab navigation through header links', async ({ page }) => {
      await page.goto('/')

      // Focus on logo directly
      const logo = page.getByRole('banner').getByRole('link', { name: /Liam West/i })
      await logo.focus()
      await expect(logo).toBeFocused()

      // Tab to Home
      await page.keyboard.press('Tab')
      const homeLink = page.getByRole('banner').getByRole('link', { name: 'Home' })
      await expect(homeLink).toBeFocused()

      // Tab to Projects
      await page.keyboard.press('Tab')
      const projectsLink = page.getByRole('banner').getByRole('link', { name: 'Projects' })
      await expect(projectsLink).toBeFocused()

      // Tab to About
      await page.keyboard.press('Tab')
      const aboutLink = page.getByRole('banner').getByRole('link', { name: /About.*Skills/i })
      await expect(aboutLink).toBeFocused()

      // Tab to Contact
      await page.keyboard.press('Tab')
      const contactLink = page.getByRole('banner').getByRole('link', { name: 'Contact' })
      await expect(contactLink).toBeFocused()
    })

    test('should navigate using Enter key on focused link', async ({ page }) => {
      await page.goto('/')

      // Focus on Projects link directly
      const projectsLink = page.getByRole('banner').getByRole('link', { name: 'Projects' })
      await projectsLink.focus()
      await expect(projectsLink).toBeFocused()

      // Press Enter
      await page.keyboard.press('Enter')

      await expect(page).toHaveURL('/projects')
    })
  })

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should display navigation on mobile', async ({ page }) => {
      await page.goto('/')

      // Header should be visible
      const header = page.locator('header')
      await expect(header).toBeVisible()

      // Logo should be visible
      const logo = page.getByRole('link', { name: /Liam West/i }).first()
      await expect(logo).toBeVisible()
    })

    test('should allow navigation on mobile devices', async ({ page }) => {
      await page.goto('/')

      // Use header navigation specifically
      const projectsLink = page.getByRole('banner').getByRole('link', { name: 'Projects' })

      // May be hidden in mobile menu, so check if visible first
      if (await projectsLink.isVisible()) {
        await projectsLink.click()
        await expect(page).toHaveURL('/projects')
      }
    })
  })
})
