import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectGrid } from '../ProjectGrid'

describe('ProjectGrid (Organism)', () => {
  describe('Basic Rendering', () => {
    it('renders children', () => {
      render(
        <ProjectGrid>
          <div>Project 1</div>
          <div>Project 2</div>
        </ProjectGrid>
      )

      expect(screen.getByText('Project 1')).toBeInTheDocument()
      expect(screen.getByText('Project 2')).toBeInTheDocument()
    })

    it('renders multiple children correctly', () => {
      render(
        <ProjectGrid>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </ProjectGrid>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
      expect(screen.getByText('Item 4')).toBeInTheDocument()
    })

    it('renders with no children', () => {
      const { container } = render(<ProjectGrid>{null}</ProjectGrid>)

      const gridDiv = container.querySelector('.grid')
      expect(gridDiv).toBeInTheDocument()
      expect(gridDiv).toBeEmptyDOMElement()
    })
  })

  describe('Styling', () => {
    it('applies grid classes', () => {
      const { container } = render(
        <ProjectGrid>
          <div>Test</div>
        </ProjectGrid>
      )

      const gridDiv = container.firstChild
      expect(gridDiv).toHaveClass('grid')
    })

    it('applies responsive column classes', () => {
      const { container } = render(
        <ProjectGrid>
          <div>Test</div>
        </ProjectGrid>
      )

      const gridDiv = container.firstChild
      expect(gridDiv).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('applies gap classes', () => {
      const { container } = render(
        <ProjectGrid>
          <div>Test</div>
        </ProjectGrid>
      )

      const gridDiv = container.firstChild
      expect(gridDiv).toHaveClass('gap-6', 'md:gap-7', 'lg:gap-8')
    })
  })

  describe('Complex Content', () => {
    it('renders nested components', () => {
      render(
        <ProjectGrid>
          <div>
            <h3>Project Title</h3>
            <p>Project Description</p>
          </div>
        </ProjectGrid>
      )

      expect(screen.getByText('Project Title')).toBeInTheDocument()
      expect(screen.getByText('Project Description')).toBeInTheDocument()
    })

    it('handles mixed content types', () => {
      render(
        <ProjectGrid>
          <div>Text content</div>
          <button>Button content</button>
          <img src="test.jpg" alt="Test" />
        </ProjectGrid>
      )

      expect(screen.getByText('Text content')).toBeInTheDocument()
      expect(screen.getByText('Button content')).toBeInTheDocument()
      expect(screen.getByAltText('Test')).toBeInTheDocument()
    })
  })
})
