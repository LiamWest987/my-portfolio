import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown, type DropdownOption } from '../Dropdown'

const mockOptions: DropdownOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('Dropdown', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<Dropdown label="Select Option" options={mockOptions} />)
      expect(screen.getByText('Select Option')).toBeInTheDocument()
    })

    it('renders with custom icon', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>
      render(<Dropdown label="Filter" icon={<CustomIcon />} options={mockOptions} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('renders dropdown button with correct ARIA attributes', () => {
      render(<Dropdown label="Select Option" options={mockOptions} />)
      const button = screen.getByRole('button', { name: 'Select Option' })
      expect(button).toHaveAttribute('aria-haspopup', 'true')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('applies custom className to container', () => {
      const { container } = render(
        <Dropdown label="Test" options={mockOptions} className="custom-class" />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('applies custom buttonClassName to button', () => {
      render(
        <Dropdown
          label="Test"
          options={mockOptions}
          buttonClassName="custom-button-class"
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-button-class')
    })

    it('applies custom contentClassName to dropdown menu', () => {
      const { container } = render(
        <Dropdown
          label="Test"
          options={mockOptions}
          contentClassName="custom-content-class"
        />
      )
      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('custom-content-class')
    })

    it('generates unique menu ID from label', () => {
      const { container } = render(<Dropdown label="My Test Label" options={mockOptions} />)
      const menu = container.querySelector('#dropdown-menu-my-test-label')
      expect(menu).toBeInTheDocument()
    })

    it('uses custom id when provided', () => {
      const { container } = render(
        <Dropdown label="Test" options={mockOptions} id="custom-id" />
      )
      const menu = container.querySelector('#custom-id')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('Open/Close Behavior', () => {
    it('starts closed by default', () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('hidden')
    })

    it('opens when button is clicked', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')
      expect(menu).not.toHaveClass('hidden')
    })

    it('closes when button is clicked again', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')

      await userEvent.click(button)
      let menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')

      await userEvent.click(button)
      menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('hidden')
    })

    it('updates aria-expanded when toggling', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      await userEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes when clicking outside', async () => {
      const { container } = render(
        <div>
          <Dropdown label="Test" options={mockOptions} />
          <div data-testid="outside">Outside</div>
        </div>
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)

      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')

      const outside = screen.getByTestId('outside')
      fireEvent.mouseDown(outside)

      await waitFor(() => {
        expect(menu).toHaveClass('hidden')
      })
    })

    it('closes when Escape key is pressed', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)

      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(menu).toHaveClass('hidden')
      })
    })

    it('works with controlled open state', async () => {
      const onToggle = vi.fn()
      const { container } = render(
        <Dropdown label="Test" options={mockOptions} isOpen={true} onToggle={onToggle} />
      )
      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')
    })

    it('calls onToggle when button is clicked in controlled mode', async () => {
      const onToggle = vi.fn()
      render(<Dropdown label="Test" options={mockOptions} isOpen={false} onToggle={onToggle} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(onToggle).toHaveBeenCalled()
    })
  })

  describe('Option Selection', () => {
    it('renders all provided options', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('calls onChange when option is clicked', async () => {
      const onChange = vi.fn()
      render(<Dropdown label="Test" options={mockOptions} onChange={onChange} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)

      const option = screen.getByText('Option 2')
      await userEvent.click(option)

      expect(onChange).toHaveBeenCalledWith('2')
    })

    it('closes dropdown after option selection', async () => {
      const onChange = vi.fn()
      const { container } = render(
        <Dropdown label="Test" options={mockOptions} onChange={onChange} />
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)

      const option = screen.getByText('Option 1')
      await userEvent.click(option)

      await waitFor(() => {
        const menu = container.querySelector('[role="menu"]')
        expect(menu).toHaveClass('hidden')
      })
    })

    it('displays selected option label in button', () => {
      render(<Dropdown label="Select" options={mockOptions} value="2" />)
      const button = screen.getByRole('button', { name: 'Select' })
      expect(button).toHaveTextContent('Option 2')
    })

    it('displays default label when no option is selected', () => {
      render(<Dropdown label="Select Option" options={mockOptions} />)
      expect(screen.getByText('Select Option')).toBeInTheDocument()
    })

    it('highlights selected option with special styling', async () => {
      render(<Dropdown label="Test" options={mockOptions} value="2" />)
      const button = screen.getByRole('button', { name: 'Test' })
      await userEvent.click(button)

      const menuitems = screen.getAllByRole('menuitem')
      const selectedOption = menuitems.find(item => item.textContent === 'Option 2')
      expect(selectedOption).toHaveClass('bg-primary')
    })

    it('sets aria-current on selected option', async () => {
      render(<Dropdown label="Test" options={mockOptions} value="2" />)
      const button = screen.getByRole('button', { name: 'Test' })
      await userEvent.click(button)

      const menuitems = screen.getAllByRole('menuitem')
      const selectedOption = menuitems.find(item => item.textContent === 'Option 2')
      expect(selectedOption).toHaveAttribute('aria-current', 'true')
    })
  })

  describe('Custom Children', () => {
    it('renders custom children instead of options', async () => {
      render(
        <Dropdown label="Test">
          <div data-testid="custom-content">Custom Content</div>
        </Dropdown>
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('does not render options when children are provided', async () => {
      render(
        <Dropdown label="Test" options={mockOptions}>
          <div>Custom Content</div>
        </Dropdown>
      )
      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes with Escape in controlled mode', async () => {
      const onToggle = vi.fn()
      render(
        <Dropdown label="Test" options={mockOptions} isOpen={true} onToggle={onToggle} />
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(onToggle).toHaveBeenCalled()
      })
    })

    it('does not close when pressing other keys', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)

      fireEvent.keyDown(document, { key: 'Enter' })

      const menu = container.querySelector('[role="menu"]')
      expect(menu).toHaveClass('block')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<Dropdown label="Test" options={[]} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('handles undefined options', async () => {
      render(<Dropdown label="Test" />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('handles onChange not provided', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)

      const option = screen.getByText('Option 1')
      await userEvent.click(option)
      // Should not throw error
    })

    it('handles onClick not provided', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      // Should not throw error
    })

    it('handles value that does not match any option', () => {
      render(<Dropdown label="Select" options={mockOptions} value="999" />)
      expect(screen.getByText('Select')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper menu role', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('has proper menuitem roles for options', async () => {
      render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      const menuitems = screen.getAllByRole('menuitem')
      expect(menuitems).toHaveLength(3)
    })

    it('has aria-label on menu', async () => {
      render(<Dropdown label="Test Label" options={mockOptions} />)
      const button = screen.getByRole('button')
      await userEvent.click(button)
      const menu = screen.getByRole('menu')
      expect(menu).toHaveAttribute('aria-label', 'Test Label menu')
    })

    it('has aria-controls linking button to menu', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')
      const menu = container.querySelector('[role="menu"]')
      const menuId = menu?.getAttribute('id')
      expect(button).toHaveAttribute('aria-controls', menuId)
    })
  })

  describe('Chevron Icon', () => {
    it('rotates chevron when dropdown is open', async () => {
      const { container } = render(<Dropdown label="Test" options={mockOptions} />)
      const button = screen.getByRole('button')

      let svg = container.querySelector('svg')
      expect(svg?.style.transform).toBe('rotate(0deg)')

      await userEvent.click(button)

      svg = container.querySelector('svg')
      expect(svg?.style.transform).toBe('rotate(180deg)')
    })
  })
})
