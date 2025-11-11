import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Section } from '../Section'

describe('Section', () => {
  it('renders children correctly', () => {
    render(<Section>Test Content</Section>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies section className by default', () => {
    const { container } = render(<Section>Content</Section>)
    const section = container.querySelector('section')
    expect(section).toHaveClass('section')
  })

  it('combines custom className with default', () => {
    const { container } = render(<Section className="py-16">Content</Section>)
    const section = container.querySelector('section')
    expect(section).toHaveClass('section')
    expect(section).toHaveClass('py-16')
  })

  it('passes through HTML attributes', () => {
    const { container } = render(
      <Section id="about" aria-label="About section">
        Content
      </Section>
    )
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('id', 'about')
    expect(section).toHaveAttribute('aria-label', 'About section')
  })

  it('renders as semantic section element', () => {
    const { container } = render(<Section>Content</Section>)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section?.tagName).toBe('SECTION')
  })

  it('handles empty className prop', () => {
    const { container } = render(<Section className="">Content</Section>)
    const section = container.querySelector('section')
    expect(section?.className).toBe('section')
  })

  it('trims whitespace from combined classNames', () => {
    const { container } = render(<Section className="  py-8  ">Content</Section>)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/^\s+|\s+$/)
  })

  it('supports nested elements', () => {
    render(
      <Section>
        <h2>Heading</h2>
        <p>Paragraph</p>
      </Section>
    )
    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
  })
})
