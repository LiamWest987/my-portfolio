import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, renderHook, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/components/common'

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('initializes with dark theme by default', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe('dark')
    })
  })

  it('loads saved theme from localStorage', async () => {
    localStorage.setItem('color-mode', 'light')

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe('light')
    })
  })

  it('sets theme and saves to localStorage', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe('dark')
    })

    result.current.setTheme('light')

    await waitFor(() => {
      expect(result.current.theme).toBe('light')
      expect(localStorage.getItem('color-mode')).toBe('light')
    })
  })

  it('applies dark class to document element', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe('dark')
    })

    result.current.setTheme('dark')

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('removes dark class when switching to light theme', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(result.current.theme).toBe('dark')
    })

    result.current.setTheme('light')

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  it('always sets slate as data-theme attribute', async () => {
    renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('slate')
    })
  })

  it('manages dropdown open state', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    expect(result.current.isDropdownOpen).toBe(false)

    result.current.setIsDropdownOpen(true)

    await waitFor(() => {
      expect(result.current.isDropdownOpen).toBe(true)
    })

    result.current.setIsDropdownOpen(false)

    await waitFor(() => {
      expect(result.current.isDropdownOpen).toBe(false)
    })
  })

  it('throws error when useTheme is used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a ThemeProvider')
  })
})
