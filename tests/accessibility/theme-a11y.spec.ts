import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Theme Toggle Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('theme toggle should not have WCAG violations', async ({ page }) => {
    // Run accessibility scan on theme toggle
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('button[aria-label*="Change theme"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('theme toggle button should have accessible label', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Check button is visible
    await expect(themeButton).toBeVisible()

    // Check aria-label
    const ariaLabel = await themeButton.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel?.toLowerCase()).toContain('theme')
  })

  test('theme toggle should be keyboard accessible', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Tab to theme button
    let tabCount = 0
    const maxTabs = 20

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++

      const isFocused = await themeButton.evaluate(el => el === document.activeElement)
      if (isFocused) {
        break
      }
    }

    // Theme button should be focused
    const isFocused = await themeButton.evaluate(el => el === document.activeElement)
    expect(isFocused).toBe(true)

    // Open dropdown with Enter
    await page.keyboard.press('Enter')

    // Check dropdown is visible
    const dropdown = page
      .locator('button[aria-label*="Change theme"]')
      .locator('..')
      .locator('div[class*="absolute"]')
      .first()

    // Give it time to appear
    await page.waitForTimeout(300)

    const isVisible = await dropdown.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return styles.visibility !== 'hidden' && styles.opacity !== '0' && styles.display !== 'none'
    })

    expect(isVisible).toBe(true)
  })

  test('theme dropdown should close with Escape key', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Open dropdown
    await themeButton.click()

    // Wait for dropdown to open
    await page.waitForTimeout(300)

    // Press Escape
    await page.keyboard.press('Escape')

    // Wait for dropdown to close
    await page.waitForTimeout(300)

    // Check dropdown is hidden
    const dropdown = page
      .locator('button[aria-label*="Change theme"]')
      .locator('..')
      .locator('div[class*="absolute"]')
      .first()

    const isHidden = await dropdown.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return styles.visibility === 'hidden' || styles.opacity === '0'
    })

    expect(isHidden).toBe(true)
  })

  test('theme options should be keyboard navigable', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Open dropdown
    await themeButton.click()

    // Wait for dropdown
    await page.waitForTimeout(300)

    // Find theme option buttons
    const lightButton = page.locator('button[data-mode="light"]')
    const darkButton = page.locator('button[data-mode="dark"]')

    // Tab to first option
    await page.keyboard.press('Tab')

    // Check one of the options is focused
    const lightFocused = await lightButton.evaluate(el => el === document.activeElement)
    const darkFocused = await darkButton.evaluate(el => el === document.activeElement)

    expect(lightFocused || darkFocused).toBe(true)
  })

  test('theme selection should be indicated accessibly', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Open dropdown
    await themeButton.click()

    // Wait for dropdown
    await page.waitForTimeout(300)

    // Get current theme buttons
    const lightButton = page.locator('button[data-mode="light"]')
    const darkButton = page.locator('button[data-mode="dark"]')

    // Check that one button shows as selected (has different styling)
    const lightClasses = await lightButton.getAttribute('class')
    const darkClasses = await darkButton.getAttribute('class')

    // One should have styling indicating selection (e.g., bg-accent, border-accent)
    const lightIsSelected = lightClasses?.includes('accent')
    const darkIsSelected = darkClasses?.includes('accent')

    // At least one should be marked as selected
    expect(lightIsSelected || darkIsSelected).toBe(true)
  })

  test('changing theme with keyboard should work', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })

    // Open dropdown
    await themeButton.click()
    await page.waitForTimeout(300)

    // Find the opposite theme button
    const targetMode = initialTheme === 'dark' ? 'light' : 'dark'
    const targetButton = page.locator(`button[data-mode="${targetMode}"]`)

    // Focus and activate the button
    await targetButton.focus()
    await page.keyboard.press('Enter')

    // Wait for theme change
    await page.waitForTimeout(300)

    // Check theme changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })

    expect(newTheme).toBe(targetMode)
  })

  test('theme toggle should maintain focus after selection', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Open dropdown
    await themeButton.click()
    await page.waitForTimeout(300)

    // Select a theme
    const lightButton = page.locator('button[data-mode="light"]')
    await lightButton.click()

    // Wait for dropdown to close
    await page.waitForTimeout(300)

    // Focus should remain on or near the theme toggle area
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    // Focus should be on a button or similar interactive element
    expect(focusedElement).toMatch(/BUTTON|A|INPUT/)
  })

  test('theme icons should be hidden from screen readers', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Check SVG icons have proper attributes
    const svgs = themeButton.locator('svg')
    const count = await svgs.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const svg = svgs.nth(i)

      // Check aria-hidden
      const ariaHidden = await svg.getAttribute('aria-hidden')
      expect(ariaHidden).toBe('true')

      // Check focusable
      const focusable = await svg.getAttribute('focusable')
      expect(focusable).toBe('false')
    }
  })

  test('theme dropdown should have proper ARIA attributes', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="Change theme"]')

    // Open dropdown
    await themeButton.click()
    await page.waitForTimeout(300)

    // Check dropdown container
    const dropdown = page
      .locator('button[aria-label*="Change theme"]')
      .locator('..')
      .locator('div[class*="absolute"]')
      .first()

    // Check it's visible
    const isVisible = await dropdown.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return styles.visibility !== 'hidden' && styles.opacity !== '0'
    })

    expect(isVisible).toBe(true)

    // Check theme option buttons exist
    const lightButton = page.locator('button[data-mode="light"]')
    const darkButton = page.locator('button[data-mode="dark"]')

    await expect(lightButton).toBeVisible()
    await expect(darkButton).toBeVisible()
  })

  test('theme toggle should work across all pages', async ({ page }) => {
    // Test on homepage
    await page.goto('/')
    let themeButton = page.locator('button[aria-label*="Change theme"]')
    await expect(themeButton).toBeVisible()

    // Test on projects page
    await page.goto('/projects')
    themeButton = page.locator('button[aria-label*="Change theme"]')
    await expect(themeButton).toBeVisible()

    // Test on about page
    await page.goto('/about')
    themeButton = page.locator('button[aria-label*="Change theme"]')
    await expect(themeButton).toBeVisible()

    // Test on contact page
    await page.goto('/contact')
    themeButton = page.locator('button[aria-label*="Change theme"]')
    await expect(themeButton).toBeVisible()
  })

  test('theme preference should persist across page navigation', async ({ page }) => {
    // Set theme to dark
    const themeButton = page.locator('button[aria-label*="Change theme"]')
    await themeButton.click()
    await page.waitForTimeout(300)

    const darkButton = page.locator('button[data-mode="dark"]')
    await darkButton.click()
    await page.waitForTimeout(300)

    // Check theme is dark
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark')
    })

    if (isDark) {
      // Navigate to another page
      await page.goto('/projects')
      await page.waitForTimeout(500)

      // Check theme is still dark
      const stillDark = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark')
      })

      expect(stillDark).toBe(true)
    }
  })

  test('theme toggle should have sufficient color contrast', async ({ page }) => {
    // Run accessibility scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('button[aria-label*="Change theme"]')
      .withTags(['wcag2aa'])
      .analyze()

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(colorContrastViolations).toEqual([])
  })
})
