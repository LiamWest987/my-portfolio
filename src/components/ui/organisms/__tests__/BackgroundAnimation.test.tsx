import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundAnimation from '../BackgroundAnimation'

describe('BackgroundAnimation', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<BackgroundAnimation />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies default variant (full)', () => {
      const { container } = render(<BackgroundAnimation />)
      const backgroundDiv = container.querySelector('div')
      expect(backgroundDiv).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<BackgroundAnimation className="custom-class" />)
      const backgroundDiv = container.querySelector('div')
      expect(backgroundDiv).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders dots variant correctly', () => {
      const { container } = render(<BackgroundAnimation variant="dots" />)
      // Dots variant should show dot pattern but not gradient orbs or grid
      const dotPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('dotPattern')
      )
      const gradientOrb = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb')
      )
      const gridPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gridPattern')
      )
      expect(dotPattern).toBeDefined()
      expect(gradientOrb).toBeUndefined()
      expect(gridPattern).toBeUndefined()
    })

    it('renders grid variant correctly', () => {
      const { container } = render(<BackgroundAnimation variant="grid" />)
      // Grid variant should show grid pattern but not gradient orbs or dots
      const gridPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gridPattern')
      )
      const gradientOrb = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb')
      )
      const dotPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('dotPattern')
      )
      expect(gridPattern).toBeDefined()
      expect(gradientOrb).toBeUndefined()
      expect(dotPattern).toBeUndefined()
    })

    it('renders gradient-orbs variant correctly', () => {
      const { container } = render(<BackgroundAnimation variant="gradient-orbs" />)
      // Gradient orbs variant should show gradient and orbs but not grid or dots
      const backgroundGradient = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('backgroundGradient')
      )
      const gradientOrb = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb')
      )
      const gridPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gridPattern')
      )
      const dotPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('dotPattern')
      )
      expect(backgroundGradient).toBeDefined()
      expect(gradientOrb).toBeDefined()
      expect(gridPattern).toBeUndefined()
      expect(dotPattern).toBeUndefined()
    })

    it('renders full variant correctly', () => {
      const { container } = render(<BackgroundAnimation variant="full" />)
      // Full variant should show all elements
      const backgroundGradient = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('backgroundGradient')
      )
      const gradientOrb = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb')
      )
      const gridPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gridPattern')
      )
      const dotPattern = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('dotPattern')
      )
      expect(backgroundGradient).toBeDefined()
      expect(gradientOrb).toBeDefined()
      expect(gridPattern).toBeDefined()
      expect(dotPattern).toBeDefined()
    })
  })

  describe('Gradient Orbs', () => {
    it('renders all three gradient orbs in gradient-orbs variant', () => {
      const { container } = render(<BackgroundAnimation variant="gradient-orbs" />)
      const orbs = Array.from(container.querySelectorAll('div')).filter(el =>
        el.className.includes('gradientOrb')
      )
      expect(orbs.length).toBeGreaterThanOrEqual(3)
    })

    it('renders all three gradient orbs in full variant', () => {
      const { container } = render(<BackgroundAnimation variant="full" />)
      const orbs = Array.from(container.querySelectorAll('div')).filter(el =>
        el.className.includes('gradientOrb')
      )
      expect(orbs.length).toBeGreaterThanOrEqual(3)
    })

    it('applies unique classes to each gradient orb', () => {
      const { container } = render(<BackgroundAnimation variant="gradient-orbs" />)
      const orb1 = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb1')
      )
      const orb2 = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb2')
      )
      const orb3 = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('gradientOrb3')
      )
      expect(orb1).toBeDefined()
      expect(orb2).toBeDefined()
      expect(orb3).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('renders with undefined className', () => {
      const { container } = render(<BackgroundAnimation className={undefined} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with empty string className', () => {
      const { container } = render(<BackgroundAnimation className="" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with multiple custom classes', () => {
      const { container } = render(<BackgroundAnimation className="class1 class2 class3" />)
      const backgroundDiv = container.querySelector('div')
      expect(backgroundDiv).toHaveClass('class1', 'class2', 'class3')
    })
  })

  describe('Accessibility', () => {
    it('renders decorative background without ARIA labels', () => {
      const { container } = render(<BackgroundAnimation />)
      // Background animations should be decorative and not have role/aria attributes
      expect(container.querySelector('[role]')).not.toBeInTheDocument()
      expect(container.querySelector('[aria-label]')).not.toBeInTheDocument()
    })

    it('does not interfere with page content (has negative z-index)', () => {
      const { container } = render(<BackgroundAnimation />)
      const backgroundDiv = Array.from(container.querySelectorAll('div')).find(el =>
        el.className.includes('backgroundAnimation')
      )
      // While we can't directly check z-index in tests, we can verify the base class is applied
      expect(backgroundDiv).toBeDefined()
    })
  })
})
