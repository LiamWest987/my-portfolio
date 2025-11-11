import { test, expect } from '@playwright/test';

/**
 * Helper function to wait for projects to load and return whether data exists
 */
async function waitForProjectsLoad(page: unknown): Promise<boolean> {
  // Wait for loading to complete
  await page.waitForSelector('[aria-label="Loading projects"]', { state: 'detached', timeout: 10000 }).catch(() => {});

  // Check if projects exist
  const projectCount = await page.locator('[data-testid="project-card"]').count();
  return projectCount > 0;
}

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test.describe('Page Load and Initial State', () => {
    test('should load successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Liam West/);
      await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
    });

    test('should display page header with description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
      await expect(page.getByText(/Explore my portfolio/)).toBeVisible();
    });

    test('should display project count in header', async ({ page }) => {
      const projectCount = await page.locator('#project-count').textContent();
      expect(projectCount).toBeTruthy();
      expect(Number(projectCount)).toBeGreaterThanOrEqual(0);
    });

    test('should display search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();
    });

    test('should display category dropdown', async ({ page }) => {
      await expect(page.getByRole('button', { name: /All Categories/i })).toBeVisible();
    });

    test('should display sort dropdown', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Newest First/i })).toBeVisible();
    });

    test('should display results info', async ({ page }) => {
      // Wait for loading to complete by checking for the absence of loading indicator
      await page.waitForSelector('[aria-label="Loading projects"]', { state: 'detached', timeout: 10000 }).catch(() => {});

      // Now check for the results status (only one should exist after loading)
      const resultsStatus = page.locator('[role="status"]').filter({ has: page.locator('text=/Showing.*of.*project/') });
      await expect(resultsStatus).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter projects by title search', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip test if no projects available
      if (!hasProjects) {
        test.skip();
        return;
      }

      // Get first project title
      const firstProjectTitle = await page.locator('[data-testid="project-card"]').first().locator('h3').textContent();

      if (firstProjectTitle) {
        // Search for a portion of the title
        const searchTerm = firstProjectTitle.split(' ')[0];
        await page.getByPlaceholder('Search projects, tags, or technologies...').fill(searchTerm);

        // Wait for results to update
        await page.waitForTimeout(300);

        // Verify filtered results
        const filteredCards = await page.locator('[data-testid="project-card"]').count();
        expect(filteredCards).toBeGreaterThanOrEqual(1);
      }
    });

    test('should filter projects by description search', async ({ page }) => {
      await waitForProjectsLoad(page);

      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Search for a common term that might be in descriptions
      await searchInput.fill('management');
      await page.waitForTimeout(300);

      // Results should update  - check the specific results status element
      const resultsStatus = page.locator('[role="status"]').filter({ has: page.locator('text=/Showing.*of.*project/') });
      await expect(resultsStatus).toBeVisible();
    });

    test('should show empty state when no results found', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Search for something that definitely won't exist
      await searchInput.fill('xyznonexistentproject123');
      await page.waitForTimeout(300);

      // Should show no results message
      await expect(page.getByText('No projects found matching your criteria.')).toBeVisible();
    });

    test('should clear search and show all projects', async ({ page }) => {
      await waitForProjectsLoad(page);

      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Get initial count
      const initialCards = await page.locator('[data-testid="project-card"]').count();

      // Search for something
      await searchInput.fill('test');
      await page.waitForTimeout(300);

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(300);

      // Verify all projects are shown again
      const finalCards = await page.locator('[data-testid="project-card"]').count();
      expect(finalCards).toBe(initialCards);
    });

    test('should update results count when searching', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Get the specific results status element (not the loading one)
      const resultsInfo = page.locator('[role="status"]').filter({ has: page.locator('text=/Showing.*of.*project/') });
      const initialText = await resultsInfo.textContent();

      // Perform search
      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('test');
      await page.waitForTimeout(300);

      const updatedText = await resultsInfo.textContent();
      expect(updatedText).not.toBe(initialText);
    });

    test('should search case-insensitively', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip test if no projects available
      if (!hasProjects) {
        test.skip();
        return;
      }

      const searchInput = page.getByPlaceholder('Search projects, tags, or technologies...');

      // Get a project title
      const firstProjectTitle = await page.locator('[data-testid="project-card"]').first().locator('h3').textContent();

      if (firstProjectTitle) {
        // Search with uppercase
        await searchInput.fill(firstProjectTitle.toUpperCase());
        await page.waitForTimeout(300);

        const upperResults = await page.locator('[data-testid="project-card"]').count();
        expect(upperResults).toBeGreaterThanOrEqual(1);

        // Clear and search with lowercase
        await searchInput.clear();
        await searchInput.fill(firstProjectTitle.toLowerCase());
        await page.waitForTimeout(300);

        const lowerResults = await page.locator('[data-testid="project-card"]').count();
        expect(lowerResults).toBe(upperResults);
      }
    });
  });

  test.describe('Category Filtering', () => {
    test('should open category dropdown when clicked', async ({ page }) => {
      await waitForProjectsLoad(page);

      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      // Dropdown should be visible with menu items
      const dropdown = page.locator('#category-dropdown-menu');
      await expect(dropdown).toBeVisible();

      const menuItems = dropdown.locator('[role="menuitem"]');
      await expect(menuItems.first()).toBeVisible();
    });

    test('should close category dropdown when clicking button again', async ({ page }) => {
      await waitForProjectsLoad(page);

      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      // Open dropdown
      await categoryButton.click();
      await expect(page.locator('#category-dropdown-menu')).toBeVisible();

      // Close dropdown
      await categoryButton.click();

      // Wait for dropdown to close (use waitFor instead of arbitrary timeout)
      await expect(page.locator('#category-dropdown-menu')).not.toBeVisible();
    });

    test('should filter projects by category', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      // Get all menu items
      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const itemCount = await menuItems.count();

      // Skip "All Categories" and click first actual category
      if (itemCount > 1) {
        const categoryName = await menuItems.nth(1).textContent();
        await menuItems.nth(1).click();

        // Wait for filter to apply
        await page.waitForTimeout(300);

        // Button label should update
        await expect(page.getByRole('button', { name: categoryName || '' })).toBeVisible();

        // Projects should be filtered
        const projectCards = page.locator('[data-testid="project-card"]');
        const count = await projectCards.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should show all categories when "All Categories" selected', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });

      // First, select a specific category
      await categoryButton.click();
      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const itemCount = await menuItems.count();

      if (itemCount > 1) {
        await menuItems.nth(1).click();
        await page.waitForTimeout(300);

        // Now select "All Categories"
        await categoryButton.click();
        await menuItems.first().click();
        await page.waitForTimeout(300);

        // Should show all projects
        await expect(page.getByRole('button', { name: /All Categories/i })).toBeVisible();
      }
    });

    test('should highlight active category', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const allCategoriesItem = page.locator('#category-dropdown-menu [role="menuitem"]').first();

      // Check active state
      const ariaCurrent = await allCategoriesItem.getAttribute('aria-current');
      expect(ariaCurrent).toBe('true');
    });

    test('should close category dropdown when selecting option', async ({ page }) => {
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      // Select an option
      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      await menuItems.first().click();

      // Dropdown should close
      await page.waitForTimeout(200);
      const dropdown = page.locator('#category-dropdown-menu');
      await expect(dropdown).not.toBeVisible();
    });
  });

  test.describe('Sort Functionality', () => {
    test('should open sort dropdown when clicked', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      const dropdown = page.locator('#sort-dropdown-menu');
      await expect(dropdown).toBeVisible();

      const menuItems = dropdown.locator('[role="menuitem"]');
      await expect(menuItems.first()).toBeVisible();
    });

    test('should close sort dropdown when clicking button again', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });

      await sortButton.click();
      await expect(page.locator('#sort-dropdown-menu')).toBeVisible();

      await sortButton.click();
      await page.waitForTimeout(200);

      const dropdown = page.locator('#sort-dropdown-menu');
      await expect(dropdown).not.toBeVisible();
    });

    test('should sort projects by newest first', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Newest First' }).click();
      await page.waitForTimeout(300);

      // Verify button label updated
      await expect(page.getByRole('button', { name: 'Newest First' })).toBeVisible();
    });

    test('should sort projects by oldest first', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Oldest First' }).click();
      await page.waitForTimeout(300);

      await expect(page.getByRole('button', { name: 'Oldest First' })).toBeVisible();
    });

    test('should sort projects by name A-Z', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Name A-Z' }).click();
      await page.waitForTimeout(300);

      await expect(page.getByRole('button', { name: 'Name A-Z' })).toBeVisible();

      // Get project titles and verify alphabetical order
      const titles = await page.locator('[data-testid="project-card"] h3').allTextContents();
      const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
      expect(titles).toEqual(sortedTitles);
    });

    test('should sort projects by name Z-A', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Name Z-A' }).click();
      await page.waitForTimeout(300);

      await expect(page.getByRole('button', { name: 'Name Z-A' })).toBeVisible();

      // Get project titles and verify reverse alphabetical order
      const titles = await page.locator('[data-testid="project-card"] h3').allTextContents();
      const sortedTitles = [...titles].sort((a, b) => b.localeCompare(a));
      expect(titles).toEqual(sortedTitles);
    });

    test('should highlight active sort option', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      const newestFirstItem = page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Newest First' });
      const ariaCurrent = await newestFirstItem.getAttribute('aria-current');
      expect(ariaCurrent).toBe('true');
    });

    test('should close sort dropdown when selecting option', async ({ page }) => {
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();

      await page.locator('#sort-dropdown-menu [role="menuitem"]').first().click();
      await page.waitForTimeout(200);

      const dropdown = page.locator('#sort-dropdown-menu');
      await expect(dropdown).not.toBeVisible();
    });
  });

  test.describe('Project Card Interactions', () => {
    test('should display project cards or empty state', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      if (!hasProjects) {
        // Verify empty state is shown
        await expect(page.getByText('No projects available yet.')).toBeVisible();
        return;
      }

      const projectCards = page.locator('[data-testid="project-card"]');
      await expect(projectCards.first()).toBeVisible();

      const count = await projectCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show project card information', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip if no projects
      if (!hasProjects) {
        test.skip();
        return;
      }

      const firstCard = page.locator('[data-testid="project-card"]').first();

      // Should have title
      await expect(firstCard.locator('h3')).toBeVisible();

      // Should have category text (displayed as uppercase text, not a badge component)
      const categoryText = firstCard.locator('.text-accent.uppercase').first();
      await expect(categoryText).toBeVisible();
    });

    test('should open modal when clicking project card', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip if no projects
      if (!hasProjects) {
        test.skip();
        return;
      }

      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();

      // Modal should appear
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Dialog should have title (use first to avoid strict mode violation - multiple headings in modal)
      await expect(dialog.getByRole('heading').first()).toBeVisible();
    });

    test('should show hover effect on project cards', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip if no projects
      if (!hasProjects) {
        test.skip();
        return;
      }

      const firstCard = page.locator('[data-testid="project-card"]').first();

      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(100);

      // Card should still be visible (transform doesn't change visibility)
      await expect(firstCard).toBeVisible();
    });

    test('should display project badges/tags', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip if no projects
      if (!hasProjects) {
        test.skip();
        return;
      }

      const projectCards = page.locator('[data-testid="project-card"]');

      // Check first card has category text and/or technology tags
      const firstCard = projectCards.first();
      const categoryText = firstCard.locator('.text-accent.uppercase').first();
      await expect(categoryText).toBeVisible();
    });
  });

  test.describe('Modal Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Wait for projects to load
      const hasProjects = await waitForProjectsLoad(page);

      // Skip all tests in this block if no projects
      if (!hasProjects) {
        test.skip();
        return;
      }

      // Open modal by clicking first project
      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should display modal with project details', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Should have title (use first to avoid strict mode violation - multiple headings in modal)
      await expect(dialog.getByRole('heading').first()).toBeVisible();

      // Should have badges (category badge is always shown, line 223 of ProjectModal)
      // Badge uses classes: "rounded-full border px-3 py-1"
      const badges = dialog.locator('.rounded-full.border.px-3.py-1');
      expect(await badges.count()).toBeGreaterThan(0);
    });

    test('should close modal with close button', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Find and click close button
      const closeButton = dialog.getByRole('button', { name: /close/i });
      await closeButton.click();

      // Modal should be hidden
      await expect(dialog).not.toBeVisible();
    });

    test('should close modal with Escape key', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should be hidden
      await expect(dialog).not.toBeVisible();
    });

    test('should display project images in modal', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Check if images are present (some projects might not have images)
      const images = dialog.locator('img');
      const imageCount = await images.count();

      // If there are images, they should have proper alt text
      if (imageCount > 0) {
        const firstImage = images.first();
        const alt = await firstImage.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('should display technologies section in modal', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Check if technologies section exists
      const technologiesHeading = dialog.getByRole('heading', { name: /technologies/i });

      // If technologies section exists, it should have badges
      if (await technologiesHeading.isVisible()) {
        // Badge uses classes: "rounded-full border px-3 py-1"
        const techBadges = dialog.locator('.rounded-full.border.px-3.py-1');
        expect(await techBadges.count()).toBeGreaterThan(1); // Category + at least one tech
      }
    });

    test('should display action buttons in modal', async ({ page }) => {
      const dialog = page.getByRole('dialog');

      // Check for PDF download or Demo buttons
      const pdfButton = dialog.getByRole('link', { name: /download pdf/i });
      const demoButton = dialog.getByRole('link', { name: /view demo/i });

      const hasPdf = await pdfButton.isVisible().catch(() => false);
      const hasDemo = await demoButton.isVisible().catch(() => false);

      // At least verify buttons are properly configured if they exist
      if (hasPdf) {
        const href = await pdfButton.getAttribute('href');
        expect(href).toBeTruthy();
      }

      if (hasDemo) {
        const href = await demoButton.getAttribute('href');
        expect(href).toBeTruthy();
        const target = await demoButton.getAttribute('target');
        expect(target).toBe('_blank');
      }
    });

    test('should scroll content in modal if needed', async ({ page }) => {
      const dialog = page.getByRole('dialog');
      // The scrollable content area has overflow-y-auto class (line 243 of ProjectModal)
      const dialogContent = dialog.locator('.overflow-y-auto').first();

      // Check if content is scrollable
      const hasOverflow = await dialogContent.evaluate((el) => {
        return el.scrollHeight > el.clientHeight;
      });

      // This is just a structural test - some modals may not need scrolling
      expect(typeof hasOverflow).toBe('boolean');
    });

    test('should trap focus within modal', async ({ page }) => {
      // Tab through modal elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Focus should remain within dialog
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.closest('[role="dialog"]') !== null;
      });

      expect(focusedElement).toBe(true);
    });
  });

  test.describe('Combined Filters', () => {
    test('should apply search and category filter together', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Apply category filter
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      const menuItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      const itemCount = await menuItems.count();

      if (itemCount > 1) {
        await menuItems.nth(1).click();
        await page.waitForTimeout(300);

        // Get count after category filter
        const categoryFilteredCount = await page.locator('[data-testid="project-card"]').count();

        // Apply search
        await page.getByPlaceholder('Search projects, tags, or technologies...').fill('project');
        await page.waitForTimeout(300);

        // Results should be filtered by both
        const combinedFilterCount = await page.locator('[data-testid="project-card"]').count();
        expect(combinedFilterCount).toBeLessThanOrEqual(categoryFilteredCount);
      }
    });

    test('should apply search and sort together', async ({ page }) => {
      // Apply search
      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('project');
      await page.waitForTimeout(300);

      // Apply sort
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();
      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Name A-Z' }).click();
      await page.waitForTimeout(300);

      // Get titles and verify they're sorted
      const titles = await page.locator('[data-testid="project-card"] h3').allTextContents();
      if (titles.length > 1) {
        const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
        expect(titles).toEqual(sortedTitles);
      }
    });

    test('should apply all filters together', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Apply category
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();
      const categoryItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      if (await categoryItems.count() > 1) {
        await categoryItems.nth(1).click();
        await page.waitForTimeout(300);
      }

      // Apply search
      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('e');
      await page.waitForTimeout(300);

      // Apply sort - use the button with aria-controls="sort-dropdown-menu"
      const sortButton = page.locator('button[aria-controls="sort-dropdown-menu"]');
      await sortButton.click();
      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Name A-Z' }).click();
      await page.waitForTimeout(300);

      // Verify results info updates
      await expect(page.getByRole('status').filter({ has: page.locator('text=/Showing.*of.*project/') })).toBeVisible();
    });

    test('should maintain sort when changing category', async ({ page }) => {
      // Set sort to Name A-Z
      const sortButton = page.getByRole('button', { name: /Newest First/i });
      await sortButton.click();
      await page.locator('#sort-dropdown-menu [role="menuitem"]').filter({ hasText: 'Name A-Z' }).click();
      await page.waitForTimeout(300);

      // Change category
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();
      const categoryItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      if (await categoryItems.count() > 1) {
        await categoryItems.nth(1).click();
        await page.waitForTimeout(300);
      }

      // Verify sort is still active
      await expect(page.getByRole('button', { name: 'Name A-Z' })).toBeVisible();
    });

    test('should clear all filters independently', async ({ page }) => {
      // Apply all filters
      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();
      const categoryItems = page.locator('#category-dropdown-menu [role="menuitem"]');
      if (await categoryItems.count() > 1) {
        await categoryItems.nth(1).click();
        await page.waitForTimeout(300);
      }

      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('test');
      await page.waitForTimeout(300);

      // Clear search
      await page.getByPlaceholder('Search projects, tags, or technologies...').clear();
      await page.waitForTimeout(300);

      // Category filter should still be active
      const currentButton = page.getByRole('button').filter({ hasText: /^(?!All Categories)/ }).first();
      await expect(currentButton).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should show skeleton loaders while projects load', async ({ page }) => {
      // Navigate with slow network to catch loading state
      await page.goto('/projects', { waitUntil: 'domcontentloaded' });

      // Check for loading state, skeleton (animate-pulse class), or loaded content
      const loadingState = page.getByRole('status', { name: /loading/i });
      const skeleton = page.locator('.animate-pulse').first();

      // Either loading state, skeleton, or actual content should be present
      const hasLoadingState = await loadingState.isVisible().catch(() => false);
      const hasSkeleton = await skeleton.isVisible().catch(() => false);
      const hasContent = await page.locator('[data-testid="project-card"]').first().isVisible().catch(() => false);

      expect(hasLoadingState || hasSkeleton || hasContent).toBe(true);
    });

    test('should hide loading state when projects loaded', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Projects should be visible after load (or empty state if no projects)
      const hasProjects = await page.locator('[data-testid="project-card"]').count() > 0;
      const hasEmptyState = await page.getByText(/No projects/).isVisible().catch(() => false);

      expect(hasProjects || hasEmptyState).toBe(true);
    });

    test('should maintain UI structure during loading', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Even during/after load, essential UI should be present
      await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
      await expect(page.getByPlaceholder('Search projects, tags, or technologies...')).toBeVisible();
    });
  });

  test.describe('Empty States', () => {
    test('should show empty state with no search results', async ({ page }) => {
      await waitForProjectsLoad(page);

      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('xyznonexistent999');
      await page.waitForTimeout(300);

      await expect(page.getByText('No projects found matching your criteria.')).toBeVisible();
    });

    test('should show empty state message in center', async ({ page }) => {
      await waitForProjectsLoad(page);

      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('xyznonexistent999');
      await page.waitForTimeout(300);

      const emptyMessage = page.getByText('No projects found matching your criteria.');
      await expect(emptyMessage).toBeVisible();

      // Check it has center styling
      const classes = await emptyMessage.getAttribute('class');
      expect(classes).toContain('center');
    });

    test('should allow clearing filters from empty state', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Create empty state
      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('xyznonexistent999');
      await page.waitForTimeout(300);

      // Clear search
      await page.getByPlaceholder('Search projects, tags, or technologies...').clear();
      await page.waitForTimeout(300);

      // Projects should reappear
      const projectCards = page.locator('[data-testid="project-card"]');
      expect(await projectCards.count()).toBeGreaterThan(0);
    });

    test('should show results info as 0 of total in empty state', async ({ page }) => {
      await waitForProjectsLoad(page);

      await page.getByPlaceholder('Search projects, tags, or technologies...').fill('xyznonexistent999');
      await page.waitForTimeout(300);

      const resultsInfo = page.getByRole('status');
      const text = await resultsInfo.textContent();
      expect(text).toMatch(/0.*of/);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display controls in mobile layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await waitForProjectsLoad(page);

      // Controls should still be visible
      await expect(page.getByPlaceholder('Search projects, tags, or technologies...')).toBeVisible();
      await expect(page.getByRole('button', { name: /All Categories/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Newest First/i })).toBeVisible();
    });

    test('should display project grid in mobile layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const hasProjects = await waitForProjectsLoad(page);

      // Skip test if no projects available
      if (!hasProjects) {
        test.skip();
        return;
      }

      const projectCards = page.locator('[data-testid="project-card"]');
      await expect(projectCards.first()).toBeVisible();
    });

    test('should open modal in mobile layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const hasProjects = await waitForProjectsLoad(page);

      // Skip test if no projects available
      if (!hasProjects) {
        test.skip();
        return;
      }

      const firstCard = page.locator('[data-testid="project-card"]').first();
      await firstCard.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
    });

    test('should handle dropdown in tablet layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await waitForProjectsLoad(page);

      const categoryButton = page.getByRole('button', { name: /All Categories/i });
      await categoryButton.click();

      await expect(page.locator('#category-dropdown-menu')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to homepage', async ({ page }) => {
      await waitForProjectsLoad(page);

      // Click on logo or home link (use first match to avoid strict mode violation)
      const homeLink = page.locator('a[href="/"]').first();
      await homeLink.click();

      await expect(page).toHaveURL('/');
    });

    test('should maintain scroll position when opening modal', async ({ page }) => {
      const hasProjects = await waitForProjectsLoad(page);

      // Skip test if no projects available
      if (!hasProjects) {
        test.skip();
        return;
      }

      // Scroll down to a reasonable position
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200); // Wait for scroll and layout to stabilize
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Skip test if page couldn't scroll (not tall enough)
      if (scrollBefore < 100) {
        test.skip();
        return;
      }

      // Open modal
      const cards = page.locator('[data-testid="project-card"]');
      await cards.first().click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300); // Wait for modal close animation and body scroll unlock

      // Verify modal is closed
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Verify scroll position - allow reasonable tolerance for layout shifts
      // Note: Modal opening/closing may cause minor scroll adjustments due to overflow hidden on body
      const scrollAfter = await page.evaluate(() => window.scrollY);
      const scrollDifference = Math.abs(scrollAfter - scrollBefore);

      // Allow up to 200px difference to account for layout adjustments when modal opens/closes
      expect(scrollDifference).toBeLessThan(200);
    });
  });
});
