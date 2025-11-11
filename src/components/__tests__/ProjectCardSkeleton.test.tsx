import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectCardSkeleton } from '@/components/ui/molecules/ProjectCardSkeleton'

/**
 * Test suite for ProjectCardSkeleton component
 * Validates loading state placeholder behavior and accessibility
 */
describe('ProjectCardSkeleton', () => {
  it('renders without crashing', () => {
    render(<ProjectCardSkeleton />)
    // Component should render without errors
  })

  it('renders with correct structure matching ProjectCard layout', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // Should have Card wrapper
    const card = container.querySelector('[class*="group"]')
    expect(card).toBeTruthy()

    // Should have CardContent
    const cardContent = container.querySelector('[class*="flex-col"]')
    expect(cardContent).toBeTruthy()
  })

  it('renders skeleton elements with pulse animation', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // All skeleton elements should have animate-pulse class
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders correct number of skeleton placeholders', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // Should have skeleton elements for:
    // - 1 image
    // - 1 category badge
    // - 2 title lines
    // - 3 description lines
    // - 3 technology badges
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBe(10)
  })

  it('has aspect-video skeleton for image placeholder', () => {
    const { container } = render(<ProjectCardSkeleton />)

    const imageSkeleton = container.querySelector('[class*="aspect-video"]')
    expect(imageSkeleton).toBeTruthy()
  })

  it('has rounded-full skeletons for technology badges', () => {
    const { container } = render(<ProjectCardSkeleton />)

    const badgeSkeletons = container.querySelectorAll('[class*="rounded-full"]')
    expect(badgeSkeletons.length).toBe(3)
  })

  it('maintains consistent dimensions', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // Category badge should have fixed width
    const categoryBadge = container.querySelector('[class*="w-24"]')
    expect(categoryBadge).toBeTruthy()

    // Some description lines should have proportional widths
    const fullWidthLine = container.querySelector('[class*="w-full"]')
    expect(fullWidthLine).toBeTruthy()

    const partialWidthLine = container.querySelector('[class*="w-3/4"]')
    expect(partialWidthLine).toBeTruthy()
  })

  it('renders multiple instances independently', () => {
    const { container } = render(
      <>
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </>
    )

    const cards = container.querySelectorAll('[class*="group"]')
    expect(cards.length).toBe(3)
  })

  it('uses correct spacing classes', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // Should have gap spacing for badges
    const badgeContainer = container.querySelector('[class*="gap-2"]')
    expect(badgeContainer).toBeTruthy()

    // Should have margin-bottom classes
    const elementsWithMargin = container.querySelectorAll('[class*="mb-"]')
    expect(elementsWithMargin.length).toBeGreaterThan(0)
  })

  it('has proper padding in CardContent', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // CardContent should have p-6 pt-6
    const content = container.querySelector('[class*="p-6"]')
    expect(content).toBeTruthy()
  })

  it('uses mt-auto for technology badges placement', () => {
    const { container } = render(<ProjectCardSkeleton />)

    // Technology badges should use mt-auto to push to bottom
    const badgeContainer = container.querySelector('[class*="mt-auto"]')
    expect(badgeContainer).toBeTruthy()
  })
})
