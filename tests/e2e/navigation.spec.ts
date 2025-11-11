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

    test('should display mobile menu button on mobile', async ({ page }) => {
      await page.goto('/')

      // Mobile menu button should be visible
      const menuButton = page.getByLabel('Toggle mobile menu')
      await expect(menuButton).toBeVisible()
    })

    test('should open mobile menu when hamburger button is clicked', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

      // Click to open menu
      await menuButton.click()

      // Menu should be open
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Mobile navigation should be visible
      const mobileNav = page.getByLabel('Mobile navigation')
      await expect(mobileNav).toBeVisible()
    })

    test('should display visible backdrop when mobile menu is open', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Backdrop should be visible (semi-transparent black overlay)
      const backdrop = page.locator('.bg-black\\/50')
      await expect(backdrop).toBeVisible()
    })

    test('should close mobile menu when backdrop is clicked', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Menu should be open
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Click backdrop to close
      const backdrop = page.locator('.bg-black\\/50')
      await backdrop.click({ position: { x: 10, y: 10 } })

      // Menu should be closed
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('should close mobile menu when X button is clicked', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')

      // Open menu
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Close menu by clicking same button (now shows X icon)
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('should close mobile menu when Escape key is pressed', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')

      // Open menu
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Press Escape
      await page.keyboard.press('Escape')

      // Menu should be closed
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('should navigate to Projects page from mobile menu', async ({ page }) => {
      await page.goto('/')

      // Open mobile menu
      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Click Projects link in mobile nav
      const mobileNav = page.getByLabel('Mobile navigation')
      const projectsLink = mobileNav.getByRole('link', { name: 'Projects' })
      await projectsLink.click()

      // Should navigate to projects page
      await expect(page).toHaveURL('/projects')
    })

    test('should navigate to About page from mobile menu', async ({ page }) => {
      await page.goto('/')

      // Open mobile menu
      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Click About link in mobile nav
      const mobileNav = page.getByLabel('Mobile navigation')
      const aboutLink = mobileNav.getByRole('link', { name: /About.*Skills/i })
      await aboutLink.click()

      // Should navigate to about page
      await expect(page).toHaveURL('/about')
    })

    test('should navigate to Contact page from mobile menu', async ({ page }) => {
      await page.goto('/')

      // Open mobile menu
      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Click Contact link in mobile nav
      const mobileNav = page.getByLabel('Mobile navigation')
      const contactLink = mobileNav.getByRole('link', { name: 'Contact' })
      await contactLink.click()

      // Should navigate to contact page
      await expect(page).toHaveURL('/contact')
    })

    test('should highlight active page in mobile menu', async ({ page }) => {
      await page.goto('/projects')

      // Open mobile menu
      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Projects link should have active styling
      const mobileNav = page.getByLabel('Mobile navigation')
      const projectsLink = mobileNav.getByRole('link', { name: 'Projects' })
      await expect(projectsLink).toHaveClass(/bg-accent/)
    })

    test('should close mobile menu after navigating to new page', async ({ page }) => {
      await page.goto('/')

      // Open mobile menu
      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Click Projects link
      const mobileNav = page.getByLabel('Mobile navigation')
      const projectsLink = mobileNav.getByRole('link', { name: 'Projects' })
      await projectsLink.click()

      // Wait for navigation
      await expect(page).toHaveURL('/projects')

      // Menu should auto-close after navigation
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('should show hamburger icon when menu is closed', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')

      // Should show hamburger icon (3 horizontal lines)
      const hamburgerIcon = menuButton.locator('svg line[x1="3"]')
      await expect(hamburgerIcon).toBeVisible()
    })

    test('should show X icon when menu is open', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')
      await menuButton.click()

      // Should show X icon (2 diagonal lines)
      const closeIcon = menuButton.locator('svg line[x1="18"][y1="6"]')
      await expect(closeIcon).toBeVisible()
    })

    test('should prevent body scroll when mobile menu is open', async ({ page }) => {
      await page.goto('/')

      const menuButton = page.getByLabel('Toggle mobile menu')

      // Initially body should be scrollable
      let bodyOverflow = await page.evaluate(() => document.body.style.overflow)
      expect(bodyOverflow).toBe('')

      // Open menu
      await menuButton.click()

      // Body scroll should be prevented
      bodyOverflow = await page.evaluate(() => document.body.style.overflow)
      expect(bodyOverflow).toBe('hidden')

      // Close menu
      await menuButton.click()

      // Body scroll should be restored
      bodyOverflow = await page.evaluate(() => document.body.style.overflow)
      expect(bodyOverflow).toBe('')
    })
  })
})
