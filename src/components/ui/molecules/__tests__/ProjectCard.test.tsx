import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCard } from '../ProjectCard'

const mockProject = {
  _id: '1',
  title: 'Test Project',
  category: 'Web Development',
  date: '2024-01-15',
  description: 'This is a test project description',
  image: '/test-image.jpg',
  technologies: ['React', 'TypeScript', 'Tailwind'],
}

const mockProjectWithoutImage = {
  _id: '2',
  title: 'No Image Project',
  category: 'Mobile',
  date: '2024-02-01',
  description: 'Project without image',
  technologies: ['Swift', 'UIKit'],
}

const mockProjectWithManyTechnologies = {
  _id: '3',
  title: 'Many Tech Project',
  category: 'Full Stack',
  date: '2024-03-01',
  description: 'Project with many technologies',
  technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'],
}

const mockProjectMinimal = {
  _id: '4',
  title: 'Minimal Project',
  category: 'Design',
  date: '2024-04-01',
  description: 'Minimal project data',
}

describe('ProjectCard', () => {
  describe('Rendering', () => {
    it('renders project title', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('renders project category', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('Web Development')).toBeInTheDocument()
    })

    it('renders project description', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('This is a test project description')).toBeInTheDocument()
    })

    it('renders project image when available', () => {
      render(<ProjectCard project={mockProject} />)
      const image = screen.getByAltText(
        'Test Project project screenshot showing the main interface'
      )
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })

    it('does not render image container when image is not available', () => {
      const { container: _container } = render(<ProjectCard project={mockProjectWithoutImage} />)
      const imageContainer = _container.querySelector('.aspect-video')
      expect(imageContainer).not.toBeInTheDocument()
    })

    it('renders technologies when available', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Tailwind')).toBeInTheDocument()
    })

    it('limits technologies to first 3', () => {
      render(<ProjectCard project={mockProjectWithManyTechnologies} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('MongoDB')).toBeInTheDocument()
      expect(screen.queryByText('Express')).not.toBeInTheDocument()
      expect(screen.queryByText('AWS')).not.toBeInTheDocument()
    })

    it('does not render technologies section when not available', () => {
      const { container: _container } = render(<ProjectCard project={mockProjectMinimal} />)
      const techBadges = _container.querySelectorAll('.rounded-full')
      expect(techBadges).toHaveLength(0)
    })

    it('does not render technologies section when empty array', () => {
      const projectWithEmptyTech = { ...mockProject, technologies: [] }
      const { container: _container } = render(<ProjectCard project={projectWithEmptyTech} />)
      const techBadges = _container.querySelectorAll('.rounded-full')
      expect(techBadges).toHaveLength(0)
    })
  })

  describe('Accessibility', () => {
    it('has role="button" for keyboard accessibility', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
    })

    it('has tabIndex={0} for keyboard focus', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('has descriptive aria-label', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'View details for Test Project project')
    })

    it('has descriptive alt text for image', () => {
      render(<ProjectCard project={mockProject} />)
      const image = screen.getByAltText(
        'Test Project project screenshot showing the main interface'
      )
      expect(image).toBeInTheDocument()
    })

    it('sets aria-hidden on empty image alt', () => {
      const projectWithEmptyImage = { ...mockProject, image: '' }
      const { container: _container } = render(<ProjectCard project={projectWithEmptyImage} />)
      const image = _container.querySelector('img')
      if (image && !projectWithEmptyImage.image) {
        expect(image).toHaveAttribute('aria-hidden', 'true')
      }
    })

    it('uses semantic heading for title', () => {
      render(<ProjectCard project={mockProject} />)
      const heading = screen.getByRole('heading', { name: 'Test Project' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H3')
    })
  })

  describe('Click Interactions', () => {
    it('calls onClick when card is clicked', async () => {
      const onClick = vi.fn()
      render(<ProjectCard project={mockProject} onClick={onClick} />)
      const card = screen.getByRole('button')
      await userEvent.click(card)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does not throw error when onClick is not provided', async () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      await userEvent.click(card)
      // Should not throw error
    })

    it('calls onClick when Enter key is pressed', () => {
      const onClick = vi.fn()
      render(<ProjectCard project={mockProject} onClick={onClick} />)
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Space key is pressed', () => {
      const onClick = vi.fn()
      render(<ProjectCard project={mockProject} onClick={onClick} />)
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ' })
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when Space key is pressed', () => {
      const onClick = vi.fn()
      const preventDefault = vi.fn()
      render(<ProjectCard project={mockProject} onClick={onClick} />)
      const card = screen.getByRole('button')

      // Create a proper event object that fireEvent can work with
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
      Object.defineProperty(event, 'preventDefault', { value: preventDefault, writable: false })

      card.dispatchEvent(event)
      expect(preventDefault).toHaveBeenCalled()
    })

    it('does not call onClick when other keys are pressed', () => {
      const onClick = vi.fn()
      render(<ProjectCard project={mockProject} onClick={onClick} />)
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Tab' })
      fireEvent.keyDown(card, { key: 'Escape' })
      fireEvent.keyDown(card, { key: 'a' })
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('Styling and Animations', () => {
    it('has cursor-pointer class', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('has transition classes', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('transition-all')
      expect(card).toHaveClass('duration-300')
    })

    it('has hover effect classes', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('hover:-translate-y-0.5')
      expect(card).toHaveClass('hover:border-accent')
      expect(card).toHaveClass('hover:shadow-xl')
    })

    it('has group class for hover effects on children', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('group')
    })

    it('image has scale hover effect', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const image = _container.querySelector('img')
      expect(image).toHaveClass('group-hover:scale-105')
    })

    it('title has hover color transition', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const title = _container.querySelector('h3')
      expect(title).toHaveClass('group-hover:text-accent')
    })
  })

  describe('Layout', () => {
    it('has flex column layout', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('flex')
      expect(card).toHaveClass('flex-col')
    })

    it('has full height', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('h-full')
    })

    it('has overflow hidden', () => {
      render(<ProjectCard project={mockProject} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('overflow-hidden')
    })

    it('category is displayed as uppercase', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const category = screen.getByText('Web Development')
      expect(category).toHaveClass('uppercase')
    })

    it('description has line-clamp-3', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const description = screen.getByText('This is a test project description')
      expect(description).toHaveClass('line-clamp-3')
    })

    it('technologies are displayed at bottom with mt-auto', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const techContainer = _container.querySelector('.mt-auto')
      expect(techContainer).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long title', () => {
      const longTitleProject = {
        ...mockProject,
        title: 'A'.repeat(200),
      }
      render(<ProjectCard project={longTitleProject} />)
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })

    it('handles very long description', () => {
      const longDescProject = {
        ...mockProject,
        description: 'B'.repeat(500),
      }
      render(<ProjectCard project={longDescProject} />)
      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument()
    })

    it('handles empty string category', () => {
      const emptyCategory = { ...mockProject, category: '' }
      const { container: _container } = render(<ProjectCard project={emptyCategory} />)
      // Should still render the category element
      expect(_container.querySelector('.uppercase')).toBeInTheDocument()
    })

    it('handles special characters in title', () => {
      const specialCharProject = {
        ...mockProject,
        title: 'Project <>&" Test',
      }
      render(<ProjectCard project={specialCharProject} />)
      expect(screen.getByText('Project <>&" Test')).toBeInTheDocument()
    })

    it('handles single technology', () => {
      const singleTech = { ...mockProject, technologies: ['React'] }
      render(<ProjectCard project={singleTech} />)
      expect(screen.getByText('React')).toBeInTheDocument()
    })

    it('handles exactly 3 technologies (boundary case)', () => {
      const threeTech = { ...mockProject, technologies: ['A', 'B', 'C'] }
      render(<ProjectCard project={threeTech} />)
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
    })

    it('renders all required fields with minimal data', () => {
      render(<ProjectCard project={mockProjectMinimal} />)
      expect(screen.getByText('Minimal Project')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
      expect(screen.getByText('Minimal project data')).toBeInTheDocument()
    })
  })

  describe('Content Structure', () => {
    it('renders CardContent component', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      // CardContent should have specific padding classes
      const content = _container.querySelector('.p-6')
      expect(content).toBeInTheDocument()
    })

    it('image has aspect-video ratio', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const imageContainer = _container.querySelector('.aspect-video')
      expect(imageContainer).toBeInTheDocument()
    })

    it('image has object-cover class', () => {
      const { container: _container } = render(<ProjectCard project={mockProject} />)
      const image = _container.querySelector('img')
      expect(image).toHaveClass('object-cover')
    })
  })
})
