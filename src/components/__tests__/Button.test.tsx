import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from '@/components/ui/molecules/Button'
import { Button as AtomButton } from '@/components/ui/atoms/button'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Button (Molecule)', () => {
  describe('Rendering', () => {
    it('renders with default variant and size', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })

    it('renders children correctly', () => {
      render(<Button>Test Content</Button>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders primary variant (maps to default)', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-input', 'bg-background')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('renders accent variant', () => {
      render(<Button variant="accent">Accent</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })
  })

  describe('Sizes', () => {
    it('renders sm size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs')
    })

    it('renders base size (maps to default)', () => {
      render(<Button size="base">Base</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-4', 'py-2')
    })

    it('renders lg size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-8')
    })

    it('renders icon size', () => {
      render(<Button size="icon" aria-label="Icon button">X</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'w-9')
    })
  })

  describe('Icons', () => {
    it('renders with leftIcon', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Left Icon
        </Button>
      )
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByText('With Left Icon')).toBeInTheDocument()
    })

    it('renders with rightIcon', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Right Icon
        </Button>
      )
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByText('With Right Icon')).toBeInTheDocument()
    })

    it('renders with both leftIcon and rightIcon', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Both Icons
        </Button>
      )
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByText('Both Icons')).toBeInTheDocument()
    })
  })

  describe('Link Integration', () => {
    it('renders as Next.js Link when href is provided', () => {
      render(<Button href="/about">Go to About</Button>)
      const link = screen.getByRole('link', { name: /go to about/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/about')
    })

    it('applies button styles to link', () => {
      render(<Button href="/projects" variant="accent">Projects</Button>)
      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-accent', 'text-accent-foreground')
    })

    it('supports disabled state with href', () => {
      render(<Button href="/contact" disabled>Contact</Button>)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Full Width', () => {
    it('applies full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })

    it('does not apply full width class by default', () => {
      render(<Button>Regular Button</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('w-full')
    })
  })

  describe('Disabled State', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('does not trigger onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Event Handlers', () => {
    it('handles onClick events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles onFocus events', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()
      render(<Button onFocus={handleFocus}>Focus Me</Button>)

      await user.tab()

      expect(handleFocus).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Accessible Button</Button>)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>)
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <>
          <Button aria-describedby="button-description">Button</Button>
          <span id="button-description">This button does something</span>
        </>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'button-description')
    })

    it('has focus-visible ring styles', () => {
      render(<Button>Focus Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-1')
    })
  })

  describe('Type Attribute', () => {
    it('supports explicit button type', () => {
      render(<Button type="button">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('supports submit type', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('supports reset type', () => {
      render(<Button type="reset">Reset</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })
})

describe('Button (Atom)', () => {
  describe('asChild Functionality', () => {
    it('renders as a slot when asChild is true', () => {
      render(
        <AtomButton asChild>
          <a href="/test">Link Button</a>
        </AtomButton>
      )
      const link = screen.getByRole('link', { name: /link button/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('applies button styles to child element with asChild', () => {
      render(
        <AtomButton asChild variant="outline">
          <a href="/test">Styled Link</a>
        </AtomButton>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveClass('border', 'border-input')
    })
  })

  describe('Variant Classes', () => {
    it('renders default variant', () => {
      render(<AtomButton variant="default">Default</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('renders destructive variant', () => {
      render(<AtomButton variant="destructive">Delete</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')
    })

    it('renders outline variant', () => {
      render(<AtomButton variant="outline">Outline</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-input', 'bg-background')
    })

    it('renders secondary variant', () => {
      render(<AtomButton variant="secondary">Secondary</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('renders ghost variant', () => {
      render(<AtomButton variant="ghost">Ghost</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
    })

    it('renders link variant', () => {
      render(<AtomButton variant="link">Link Style</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
    })

    it('renders accent variant', () => {
      render(<AtomButton variant="accent">Accent</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-accent', 'text-accent-foreground')
    })
  })

  describe('Base Styles', () => {
    it('includes base transition and focus styles', () => {
      render(<AtomButton>Button</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'transition-all',
        'focus-visible:outline-none'
      )
    })

    it('includes base rounded and text styles', () => {
      render(<AtomButton>Button</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-md', 'text-sm', 'font-medium', 'whitespace-nowrap')
    })
  })

  describe('Class Merging', () => {
    it('properly merges custom className with variant classes', () => {
      render(
        <AtomButton variant="outline" className="custom-padding">
          Custom Button
        </AtomButton>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-input', 'custom-padding')
    })

    it('allows className override', () => {
      render(<AtomButton className="bg-custom-color">Custom</AtomButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-custom-color')
    })
  })
})
