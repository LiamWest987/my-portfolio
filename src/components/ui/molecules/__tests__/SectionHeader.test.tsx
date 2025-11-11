import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeader } from '../SectionHeader'

describe('SectionHeader (Molecule)', () => {
  describe('Basic Rendering', () => {
    it('renders title', () => {
      render(<SectionHeader title="Test Title" />)

      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('renders title in h2 by default', () => {
      render(<SectionHeader title="Test Title" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders title in h1 when as prop is h1', () => {
      render(<SectionHeader title="Test Title" as="h1" />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders description when provided', () => {
      render(<SectionHeader title="Title" description="This is a description" />)

      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      const { container } = render(<SectionHeader title="Title" />)

      const description = container.querySelector('p')
      expect(description).not.toBeInTheDocument()
    })

    it('applies titleId when provided', () => {
      render(<SectionHeader title="Title" titleId="my-section" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveAttribute('id', 'my-section')
    })
  })

  describe('Styling', () => {
    it('applies default classes to container', () => {
      const { container } = render(<SectionHeader title="Title" />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('text-center', 'mb-12')
    })

    it('merges custom className with default classes', () => {
      const { container } = render(<SectionHeader title="Title" className="custom-class" />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('text-center', 'mb-12', 'custom-class')
    })

    it('applies correct classes to heading', () => {
      render(<SectionHeader title="Title" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-4')
    })

    it('applies correct classes to description', () => {
      const { container } = render(<SectionHeader title="Title" description="Description" />)

      const description = container.querySelector('p')
      expect(description).toHaveClass('text-muted-foreground', 'max-w-2xl', 'mx-auto')
    })
  })

  describe('Content Variations', () => {
    it('handles long title text', () => {
      const longTitle = 'This is a Very Long Section Title That Should Still Be Displayed Correctly'
      render(<SectionHeader title={longTitle} />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('handles long description text', () => {
      const longDescription =
        'This is a very long description that contains multiple sentences and should be properly displayed and wrapped in the component.'
      render(<SectionHeader title="Title" description={longDescription} />)

      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it('handles special characters in title', () => {
      render(<SectionHeader title="Title & Subtitle: Here's What's New!" />)

      expect(screen.getByText("Title & Subtitle: Here's What's New!")).toBeInTheDocument()
    })

    it('handles special characters in description', () => {
      render(<SectionHeader title="Title" description="It's great! & more..." />)

      expect(screen.getByText("It's great! & more...")).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('heading can be used as anchor target with titleId', () => {
      render(<SectionHeader title="Skills" titleId="skills-section" />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading.id).toBe('skills-section')
    })

    it('heading renders with appropriate hierarchy for h1', () => {
      render(<SectionHeader title="Main Page Title" as="h1" />)

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('heading renders with appropriate hierarchy for h2', () => {
      render(<SectionHeader title="Section Title" as="h2" />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })
  })
})
