import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/molecules/Badge'
import { Badge as AtomBadge } from '@/components/ui/atoms/badge'

describe('Badge (Molecule)', () => {
  describe('Rendering', () => {
    it('renders with default variant', () => {
      render(<Badge>Default Badge</Badge>)
      const badge = screen.getByText('Default Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full')
    })

    it('renders children correctly', () => {
      render(<Badge>Test Content</Badge>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-class')
    })

    it('renders with complex children', () => {
      render(
        <Badge>
          <span>Complex</span> <strong>Content</strong>
        </Badge>
      )
      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="primary">Primary</Badge>)
      const badge = screen.getByText('Primary')
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'capitalize')
    })

    it('renders outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('border-border', 'bg-transparent', 'text-foreground')
    })

    it('renders accent variant', () => {
      render(<Badge variant="accent">Accent</Badge>)
      const badge = screen.getByText('Accent')
      expect(badge).toHaveClass('text-accent')
    })

    it('renders destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>)
      const badge = screen.getByText('Destructive')
      expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('defaults to secondary variant when no variant is specified', () => {
      render(<Badge>Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })
  })

  describe('Base Styles', () => {
    it('includes base badge styling', () => {
      render(<Badge>Styled Badge</Badge>)
      const badge = screen.getByText('Styled Badge')
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-full',
        'border',
        'px-3',
        'py-1',
        'text-xs',
        'font-medium',
        'transition-all',
        'whitespace-nowrap'
      )
    })

    it('has hover transition classes', () => {
      render(<Badge variant="primary">Hover Badge</Badge>)
      const badge = screen.getByText('Hover Badge')
      expect(badge).toHaveClass('transition-all', 'hover:bg-primary/80')
    })
  })

  describe('Class Merging', () => {
    it('properly merges custom className with variant classes', () => {
      render(
        <Badge variant="outline" className="custom-spacing">
          Custom Badge
        </Badge>
      )
      const badge = screen.getByText('Custom Badge')
      expect(badge).toHaveClass('border-border', 'custom-spacing')
    })

    it('allows custom classes to override default padding', () => {
      render(<Badge className="px-6 py-3">Large Padding</Badge>)
      const badge = screen.getByText('Large Padding')
      expect(badge).toHaveClass('px-6', 'py-3')
    })

    it('allows adding custom text styles', () => {
      render(<Badge className="text-lg font-bold">Large Text</Badge>)
      const badge = screen.getByText('Large Text')
      expect(badge).toHaveClass('text-lg', 'font-bold')
    })
  })

  describe('HTML Attributes', () => {
    it('supports data attributes', () => {
      render(<Badge data-testid="test-badge">Badge</Badge>)
      expect(screen.getByTestId('test-badge')).toBeInTheDocument()
    })

    it('supports id attribute', () => {
      render(<Badge id="unique-badge">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('id', 'unique-badge')
    })

    it('supports title attribute', () => {
      render(<Badge title="Badge tooltip">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('title', 'Badge tooltip')
    })

    it('supports onClick handler', () => {
      const handleClick = vi.fn()
      render(<Badge onClick={handleClick}>Clickable</Badge>)
      const badge = screen.getByText('Clickable')
      badge.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Badge aria-label="Status indicator">New</Badge>)
      expect(screen.getByLabelText('Status indicator')).toBeInTheDocument()
    })

    it('supports role attribute', () => {
      render(<Badge role="status">Live</Badge>)
      const badge = screen.getByText('Live')
      expect(badge).toHaveAttribute('role', 'status')
    })

    it('supports aria-describedby', () => {
      render(
        <>
          <Badge aria-describedby="badge-description">Badge</Badge>
          <span id="badge-description">This is a badge description</span>
        </>
      )
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('aria-describedby', 'badge-description')
    })
  })

  describe('Use Cases', () => {
    it('renders as a status indicator', () => {
      render(<Badge variant="primary">Active</Badge>)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders as a tag', () => {
      render(<Badge variant="secondary">JavaScript</Badge>)
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })

    it('renders as a notification badge', () => {
      render(<Badge variant="destructive">3</Badge>)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('renders multiple badges together', () => {
      render(
        <div>
          <Badge variant="primary">React</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="accent">Featured</Badge>
        </div>
      )
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })
  })
})

describe('Badge (Atom)', () => {
  describe('Direct Rendering', () => {
    it('renders as a div element', () => {
      const { container } = render(<AtomBadge>Badge</AtomBadge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Badge')
    })

    it('applies default variant when no variant specified', () => {
      render(<AtomBadge>Default</AtomBadge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
    })
  })

  describe('All Atom Variants', () => {
    it('renders default variant', () => {
      render(<AtomBadge variant="default">Default</AtomBadge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground')
    })

    it('renders primary variant', () => {
      render(<AtomBadge variant="primary">Primary</AtomBadge>)
      const badge = screen.getByText('Primary')
      expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground')
    })

    it('renders secondary variant', () => {
      render(<AtomBadge variant="secondary">Secondary</AtomBadge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground')
    })

    it('renders destructive variant', () => {
      render(<AtomBadge variant="destructive">Error</AtomBadge>)
      const badge = screen.getByText('Error')
      expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground')
    })

    it('renders outline variant', () => {
      render(<AtomBadge variant="outline">Outline</AtomBadge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('border-border', 'bg-transparent', 'text-foreground')
    })

    it('renders accent variant with custom colors', () => {
      render(<AtomBadge variant="accent">Accent</AtomBadge>)
      const badge = screen.getByText('Accent')
      expect(badge).toHaveClass('text-accent')
      // Accent variant uses Tailwind opacity syntax (accent/20, accent/10, etc.)
      expect(badge.className).toMatch(/accent\/\d+/)
    })
  })

  describe('Shadow and Border Styling', () => {
    it('applies shadow to primary variant', () => {
      render(<AtomBadge variant="primary">Shadowed</AtomBadge>)
      const badge = screen.getByText('Shadowed')
      expect(badge).toHaveClass('shadow')
    })

    it('applies border to outline variant', () => {
      render(<AtomBadge variant="outline">Bordered</AtomBadge>)
      const badge = screen.getByText('Bordered')
      expect(badge).toHaveClass('border', 'border-border')
    })

    it('applies transparent border to solid variants', () => {
      render(<AtomBadge variant="primary">Transparent Border</AtomBadge>)
      const badge = screen.getByText('Transparent Border')
      expect(badge).toHaveClass('border-transparent')
    })
  })

  describe('Hover States', () => {
    it('includes hover state classes for primary variant', () => {
      render(<AtomBadge variant="primary">Hoverable</AtomBadge>)
      const badge = screen.getByText('Hoverable')
      expect(badge).toHaveClass('hover:bg-primary/80')
    })

    it('includes hover state classes for secondary variant', () => {
      render(<AtomBadge variant="secondary">Hoverable</AtomBadge>)
      const badge = screen.getByText('Hoverable')
      expect(badge).toHaveClass('hover:bg-secondary/80')
    })

    it('includes hover state classes for outline variant', () => {
      render(<AtomBadge variant="outline">Hoverable</AtomBadge>)
      const badge = screen.getByText('Hoverable')
      expect(badge).toHaveClass('hover:bg-secondary/20')
    })
  })

  describe('Class Name Override', () => {
    it('merges custom className with variant classes', () => {
      render(<AtomBadge variant="primary" className="ml-4">Custom</AtomBadge>)
      const badge = screen.getByText('Custom')
      expect(badge).toHaveClass('bg-primary', 'ml-4')
    })

    it('allows complete style override with className', () => {
      render(<AtomBadge className="bg-custom text-custom">Override</AtomBadge>)
      const badge = screen.getByText('Override')
      expect(badge).toHaveClass('bg-custom', 'text-custom')
    })
  })

  describe('Typography', () => {
    it('applies capitalize to secondary variant', () => {
      render(<AtomBadge variant="secondary">javascript</AtomBadge>)
      const badge = screen.getByText('javascript')
      expect(badge).toHaveClass('capitalize')
    })

    it('uses text-xs and font-medium for all variants', () => {
      render(<AtomBadge variant="primary">Text</AtomBadge>)
      const badge = screen.getByText('Text')
      expect(badge).toHaveClass('text-xs', 'font-medium')
    })

    it('applies whitespace-nowrap to prevent text wrapping', () => {
      render(<AtomBadge>Long Badge Text</AtomBadge>)
      const badge = screen.getByText('Long Badge Text')
      expect(badge).toHaveClass('whitespace-nowrap')
    })
  })
})
