'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDropdownOpen: boolean
  setIsDropdownOpen: (isOpen: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('color-mode') as Theme | null
    const initialTheme = savedMode || 'dark'
    setThemeState(initialTheme)
    applyTheme(initialTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyTheme = (mode: Theme) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
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
