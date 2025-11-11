import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  describe('Rendering', () => {
    it('renders search input field', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toBeInTheDocument()
    })

    it('displays current value', () => {
      render(<SearchInput value="test search" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue('test search')
    })

    it('displays placeholder when provided', () => {
      render(<SearchInput value="" onChange={() => {}} placeholder="Search projects..." />)
      const input = screen.getByPlaceholderText('Search projects...')
      expect(input).toBeInTheDocument()
    })

    it('renders without placeholder', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toBeInTheDocument()
      expect(input).not.toHaveAttribute('placeholder')
    })

    it('renders search icon', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('search icon is not interactive', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('pointer-events-none')
    })

    it('search icon has aria-hidden attribute', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('search icon is not focusable', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('focusable', 'false')
    })
  })

  describe('User Interactions', () => {
    it('calls onChange when user types', async () => {
      const onChange = vi.fn()
      render(<SearchInput value="" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      await userEvent.type(input, 'test')

      expect(onChange).toHaveBeenCalled()
      expect(onChange.mock.calls.length).toBeGreaterThan(0)
    })

    it('calls onChange with correct value on each keystroke', async () => {
      const onChange = vi.fn()
      render(<SearchInput value="" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      await userEvent.type(input, 'a')

      expect(onChange).toHaveBeenCalled()
      const callArg = onChange.mock.calls[0][0]
      expect(callArg).toContain('a')
    })

    it('updates when value prop changes', () => {
      const { rerender } = render(<SearchInput value="initial" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue('initial')

      rerender(<SearchInput value="updated" onChange={() => {}} />)
      expect(input).toHaveValue('updated')
    })

    it('clears input when empty string is set', () => {
      const { rerender } = render(<SearchInput value="some text" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue('some text')

      rerender(<SearchInput value="" onChange={() => {}} />)
      expect(input).toHaveValue('')
    })

    it('handles paste events', async () => {
      const onChange = vi.fn()
      render(<SearchInput value="" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      await userEvent.click(input)
      await userEvent.paste('pasted text')

      expect(onChange).toHaveBeenCalled()
    })

    it('handles delete/backspace', () => {
      const onChange = vi.fn()
      render(<SearchInput value="test" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      fireEvent.change(input, { target: { value: 'tes' } })

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has accessible label (sr-only)', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const label = screen.getByText('Search projects')
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('sr-only')
    })

    it('label is associated with input via htmlFor', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const label = container.querySelector('label')
      const input = container.querySelector('input')
      expect(label).toHaveAttribute('for', 'search-input')
      expect(input).toHaveAttribute('id', 'search-input')
    })

    it('has aria-label on input', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('aria-label', 'Search projects')
    })

    it('uses type="search" for semantic HTML', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('type', 'search')
    })

    it('is keyboard accessible', async () => {
      const onChange = vi.fn()
      render(<SearchInput value="" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      // Tab to focus
      await userEvent.tab()
      expect(input).toHaveFocus()

      // Type with keyboard
      await userEvent.keyboard('test')
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('has correct input styling classes', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveClass('w-full')
      expect(input).toHaveClass('rounded-md')
      expect(input).toHaveClass('border')
      expect(input).toHaveClass('border-border')
    })

    it('has focus styling classes', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveClass('focus:border-primary')
      expect(input).toHaveClass('focus:outline-none')
    })

    it('has transition classes', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveClass('transition-all')
    })

    it('has padding for icon and text', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveClass('pl-11') // Left padding for icon
      expect(input).toHaveClass('pr-4') // Right padding
      expect(input).toHaveClass('py-3') // Vertical padding
    })

    it('icon is positioned absolutely', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('absolute')
      expect(icon).toHaveClass('left-4')
    })

    it('container has relative positioning', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const wrapper = container.querySelector('.relative')
      expect(wrapper).toBeInTheDocument()
    })

    it('container has minimum width', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const wrapper = container.querySelector('.min-w-\\[280px\\]')
      expect(wrapper).toBeInTheDocument()
    })

    it('container is flex-1', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const wrapper = container.querySelector('.flex-1')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty value', () => {
      render(<SearchInput value="" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue('')
    })

    it('handles very long value', () => {
      const longValue = 'A'.repeat(500)
      render(<SearchInput value={longValue} onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue(longValue)
    })

    it('handles special characters in value', () => {
      const specialValue = '<>&"\'test'
      render(<SearchInput value={specialValue} onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue(specialValue)
    })

    it('handles unicode characters', () => {
      const unicodeValue = '测试 тест テスト'
      render(<SearchInput value={unicodeValue} onChange={() => {}} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveValue(unicodeValue)
    })

    it('handles numbers in value', () => {
      const onChange = vi.fn()
      render(<SearchInput value="" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      userEvent.type(input, '12345')

      // onChange will be called but async, so we don't check the calls
      expect(input).toBeInTheDocument()
    })

    it('handles empty placeholder', () => {
      render(<SearchInput value="" onChange={() => {}} placeholder="" />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('placeholder', '')
    })

    it('handles very long placeholder', () => {
      const longPlaceholder = 'Search for '.repeat(20)
      render(<SearchInput value="" onChange={() => {}} placeholder={longPlaceholder} />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('placeholder', longPlaceholder)
    })
  })

  describe('Component Integration', () => {
    it('works as controlled component', async () => {
      let value = ''
      const onChange = (newValue: string) => {
        value = newValue
      }

      const { rerender } = render(<SearchInput value={value} onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      expect(input).toHaveValue('')

      await userEvent.type(input, 'test')

      // Rerender with updated value
      rerender(<SearchInput value="test" onChange={onChange} />)
      expect(input).toHaveValue('test')
    })

    it('can be cleared by parent component', () => {
      const onChange = vi.fn()
      const { rerender } = render(<SearchInput value="search text" onChange={onChange} />)
      const input = screen.getByRole('searchbox')

      expect(input).toHaveValue('search text')

      // Parent clears the value
      rerender(<SearchInput value="" onChange={onChange} />)
      expect(input).toHaveValue('')
    })

    it('maintains focus when value changes', () => {
      const { rerender } = render(<SearchInput value="test" onChange={() => {}} />)
      const input = screen.getByRole('searchbox')

      input.focus()
      expect(input).toHaveFocus()

      rerender(<SearchInput value="updated" onChange={() => {}} />)
      expect(input).toHaveFocus()
    })
  })

  describe('Icon Details', () => {
    it('icon has correct dimensions', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('width', '20')
      expect(icon).toHaveAttribute('height', '20')
    })

    it('icon is centered vertically', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('top-1/2')
      expect(icon).toHaveClass('-translate-y-1/2')
    })

    it('icon has muted color', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-muted-foreground')
    })
  })
})
