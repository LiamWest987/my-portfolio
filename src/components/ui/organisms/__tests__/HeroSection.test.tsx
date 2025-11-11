import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

describe('HeroSection (Organism)', () => {
  describe('Basic Rendering', () => {
    it('renders badge text', () => {
      render(
        <HeroSection
          badge="Test Badge"
          title="Test Title"
          subtitle="Test Subtitle"
          actions={<button>Test Action</button>}
        />
      )

      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('renders title', () => {
      render(
        <HeroSection
          badge="Badge"
          title="Hero Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
        />
      )

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hero Title')
    })

    it('renders subtitle', () => {
      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="This is the subtitle"
          actions={<button>Action</button>}
        />
      )

      expect(screen.getByText('This is the subtitle')).toBeInTheDocument()
    })

    it('renders actions', () => {
      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Click Me</button>}
        />
      )

      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })
  })

  describe('Social Links', () => {
    it('renders social links when provided', () => {
      const socialLinks = [
        { href: 'https://github.com', label: 'GitHub', icon: <span>GH</span> },
        { href: 'https://linkedin.com', label: 'LinkedIn', icon: <span>LI</span> },
      ]

      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
          socialLinks={socialLinks}
        />
      )

      const githubLink = screen.getByLabelText('GitHub')
      const linkedinLink = screen.getByLabelText('LinkedIn')

      expect(githubLink).toBeInTheDocument()
      expect(linkedinLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', 'https://github.com')
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com')
    })

    it('renders social link icons', () => {
      const socialLinks = [
        { href: 'https://example.com', label: 'Example', icon: <span>EX</span> },
      ]

      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
          socialLinks={socialLinks}
        />
      )

      expect(screen.getByText('EX')).toBeInTheDocument()
    })

    it('does not render social links section when not provided', () => {
      const { container } = render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
        />
      )

      const socialLinksContainer = container.querySelector('.mt-6.flex.justify-center.gap-3')
      expect(socialLinksContainer).not.toBeInTheDocument()
    })

    it('does not render social links section when empty array', () => {
      const { container } = render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
          socialLinks={[]}
        />
      )

      const socialLinksContainer = container.querySelector('.mt-6.flex.justify-center.gap-3')
      expect(socialLinksContainer).not.toBeInTheDocument()
    })

    it('opens social links in new tab', () => {
      const socialLinks = [
        { href: 'https://example.com', label: 'Example' },
      ]

      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
          socialLinks={socialLinks}
        />
      )

      const link = screen.getByLabelText('Example')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Complex Content', () => {
    it('renders title with React elements', () => {
      render(
        <HeroSection
          badge="Badge"
          title={
            <>
              Hello <span className="text-primary">World</span>
            </>
          }
          subtitle="Subtitle"
          actions={<button>Action</button>}
        />
      )

      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('World')).toBeInTheDocument()
    })

    it('renders subtitle with React elements', () => {
      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle={
            <>
              This is <em>emphasized</em> text
            </>
          }
          actions={<button>Action</button>}
        />
      )

      expect(screen.getByText('emphasized')).toBeInTheDocument()
      expect(screen.getByText(/This is.*text/)).toBeInTheDocument()
    })

    it('renders multiple action buttons', () => {
      render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={
            <>
              <button>Primary Action</button>
              <button>Secondary Action</button>
            </>
          }
        />
      )

      expect(screen.getByText('Primary Action')).toBeInTheDocument()
      expect(screen.getByText('Secondary Action')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies correct classes to container', () => {
      const { container } = render(
        <HeroSection
          badge="Badge"
          title="Title"
          subtitle="Subtitle"
          actions={<button>Action</button>}
        />
      )

      const mainDiv = container.firstChild
      expect(mainDiv).toHaveClass('relative', 'flex', 'min-h-[80vh]', 'items-center', 'justify-center')
    })
  })
})
