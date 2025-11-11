import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from '../PageHeader'

describe('PageHeader (Organism)', () => {
  describe('Basic Rendering', () => {
    it('renders title in h1 element', () => {
      render(<PageHeader title="Test Title" description="Test description" />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders description as string', () => {
      render(<PageHeader title="Title" description="This is a description" />)

      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })

    it('renders description as React node', () => {
      render(
        <PageHeader
          title="Title"
          description={
            <>
              This is <strong>bold</strong> description
            </>
          }
        />
      )

      expect(screen.getByText('bold')).toBeInTheDocument()
      expect(screen.getByText(/This is.*description/)).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies correct classes to container', () => {
      const { container } = render(<PageHeader title="Title" description="Description" />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('mb-12', 'text-center')
    })

    it('applies correct classes to title', () => {
      render(<PageHeader title="Title" description="Description" />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('mb-4', 'text-4xl', 'font-bold', 'text-foreground')
    })

    it('applies correct classes to description', () => {
      const { container } = render(<PageHeader title="Title" description="Description" />)

      const description = container.querySelector('.mx-auto.max-w-2xl.text-base.text-muted-foreground')
      expect(description).toBeInTheDocument()
    })
  })

  describe('Content Variations', () => {
    it('handles long title text', () => {
      const longTitle = 'This is a Very Long Title That Should Still Be Displayed Correctly'
      render(<PageHeader title={longTitle} description="Description" />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle)
    })

    it('handles long description text', () => {
      const longDescription =
        'This is a very long description that contains multiple sentences. It should be properly displayed and wrapped in the component with appropriate styling for readability.'
      render(<PageHeader title="Title" description={longDescription} />)

      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it('handles description with multiple elements', () => {
      render(
        <PageHeader
          title="Title"
          description={
            <>
              <p>First paragraph</p>
              <p>Second paragraph</p>
            </>
          }
        />
      )

      expect(screen.getByText('First paragraph')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph')).toBeInTheDocument()
    })
  })
})
