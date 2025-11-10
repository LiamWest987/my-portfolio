import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatDate,
  truncate,
  cn,
  slugify,
  debounce,
  isClient,
  getInitialTheme,
  saveTheme,
} from '../../utils'

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    const result = formatDate('2024-01-15T12:00:00Z')
    expect(result).toContain('2024')
    expect(result).toContain('January')
  })

  it('formats a Date object correctly', () => {
    const date = new Date(2024, 0, 15) // Month is 0-indexed
    const result = formatDate(date)
    expect(result).toBe('January 15, 2024')
  })
})

describe('truncate', () => {
  it('truncates string longer than max length', () => {
    const result = truncate('Hello World', 5)
    expect(result).toBe('Hello...')
  })

  it('returns original string if shorter than max length', () => {
    const result = truncate('Hello', 10)
    expect(result).toBe('Hello')
  })

  it('returns original string if equal to max length', () => {
    const result = truncate('Hello', 5)
    expect(result).toBe('Hello')
  })
})

describe('cn', () => {
  it('combines multiple class names', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('filters out falsy values', () => {
    const result = cn('class1', false, 'class2', null, undefined, 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('returns empty string for all falsy values', () => {
    const result = cn(false, null, undefined)
    expect(result).toBe('')
  })
})

describe('slugify', () => {
  it('converts string to lowercase slug', () => {
    const result = slugify('Hello World')
    expect(result).toBe('hello-world')
  })

  it('removes special characters', () => {
    const result = slugify('Hello @#$ World!')
    expect(result).toBe('hello-world')
  })

  it('replaces multiple spaces with single dash', () => {
    const result = slugify('Hello    World')
    expect(result).toBe('hello-world')
  })

  it('trims leading and trailing dashes', () => {
    const result = slugify('  Hello World  ')
    expect(result).toBe('hello-world')
  })

  it('handles underscores and hyphens', () => {
    const result = slugify('hello_world-test')
    expect(result).toBe('hello-world-test')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces function calls', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc()
    debouncedFunc()
    debouncedFunc()

    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledTimes(1)
  })

  it('passes arguments to debounced function', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc('arg1', 'arg2')

    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('resets timer on subsequent calls', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc()
    vi.advanceTimersByTime(50)
    debouncedFunc()
    vi.advanceTimersByTime(50)

    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)

    expect(func).toHaveBeenCalledTimes(1)
  })
})

describe('isClient', () => {
  it('returns true in browser environment', () => {
    expect(isClient()).toBe(true)
  })
})

describe('getInitialTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const result = getInitialTheme()
    expect(result).toBe('dark')
  })

  it('returns default theme when no saved theme exists', () => {
    const result = getInitialTheme()
    expect(result).toBe('slate')
  })

  it('returns slate when localStorage has no theme', () => {
    localStorage.clear()
    const result = getInitialTheme()
    expect(result).toBe('slate')
  })
})

describe('saveTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves theme to localStorage', () => {
    saveTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('overwrites existing theme', () => {
    localStorage.setItem('theme', 'light')
    saveTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
