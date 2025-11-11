'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDropdownOpen: boolean
  setIsDropdownOpen: (isOpen: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Hook to access theme context
 *
 * Must be used within a ThemeProvider component.
 *
 * @returns Theme context with current theme and setter functions
 * @throws {Error} If used outside of ThemeProvider
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme()
 * setTheme('dark')
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  /** Child components that can access theme context */
  children: ReactNode
}

/**
 * Theme provider component for managing light/dark mode
 *
 * Provides theme state and control to all child components via React Context.
 * Persists theme preference to localStorage and applies it to document root.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('color-mode') as Theme | null
    const initialTheme = savedMode || 'dark'
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (mode: Theme) => {
    if (mode === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    // Always use slate theme
    document.documentElement.setAttribute('data-theme', 'slate')
  }

  const setTheme = (mode: Theme) => {
    setThemeState(mode)
    localStorage.setItem('color-mode', mode)
    applyTheme(mode)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.theme-dropdown')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
    return undefined
  }, [isDropdownOpen])

  const value = {
    theme,
    setTheme,
    isDropdownOpen,
    setIsDropdownOpen,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
