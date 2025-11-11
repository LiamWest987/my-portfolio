'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/common'

/**
 * Header component provides the main site navigation and theme switcher.
 * Sticky positioned header with responsive navigation and theme controls.
 *
 * @returns The site header with navigation and theme switcher
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 *
 * @remarks
 * - Sticky positioning stays at top during scroll
 * - Active page indicator with accent underline
 * - Theme dropdown with light/dark mode selection
 * - Backdrop blur effect for modern glassmorphism
 * - Responsive: Desktop navigation hidden on mobile (note: mobile menu not yet implemented)
 */
export function Header() {
  const pathname = usePathname()
  const { theme, setTheme, isDropdownOpen, setIsDropdownOpen } = useTheme()

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
    return undefined
  }, [isDropdownOpen, setIsDropdownOpen])

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleModeSelect = (mode: 'light' | 'dark', e: React.MouseEvent) => {
    e.stopPropagation()
    setTheme(mode)
    setIsDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-[1020] w-full border-b border-border bg-[color-mix(in_srgb,oklch(var(--background))_95%,transparent)] backdrop-blur-[8px] transition-[background-color,border-color] duration-300">
      <div className="flex h-16 items-center justify-between mx-auto max-w-[75rem] px-4 md:px-8">
        <Link href="/" className="flex items-center text-lg font-semibold text-foreground no-underline transition-colors duration-150 hover:text-primary">
          <span className="text-primary">&lt;</span>Liam West<span className="text-accent"> /&gt;</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            <li>
              <Link
                href="/"
                className={`relative text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent ${
                  pathname === '/'
                    ? 'text-accent after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full'
                    : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className={`relative text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent ${
                  pathname === '/projects'
                    ? 'text-accent after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full'
                    : ''
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`relative text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent ${
                  pathname === '/about'
                    ? 'text-accent after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full'
                    : ''
                }`}
              >
                About & Skills
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`relative text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent ${
                  pathname === '/contact'
                    ? 'text-accent after:content-[""] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full'
                    : ''
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative theme-dropdown">
            <button
              className="flex items-center gap-1 p-2 bg-secondary border border-border rounded-md cursor-pointer transition-all duration-150 text-foreground hover:bg-muted hover:border-accent"
              aria-label="Change theme"
              onClick={toggleDropdown}
            >
              <svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg className="hidden dark:block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg
                className={`opacity-50 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              data-testid="theme-dropdown"
              className={`absolute top-[calc(100%+0.5rem)] right-0 min-w-[220px] max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 bg-card border border-border rounded-lg shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] p-2 z-[1000] transition-all duration-150 ${
                isDropdownOpen
                  ? 'opacity-100 visible translate-y-0 max-sm:translate-y-0 max-sm:-translate-x-1/2'
                  : 'opacity-0 invisible -translate-y-2.5 max-sm:-translate-y-2.5 max-sm:-translate-x-1/2'
              }`}
            >
              <div className="py-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Appearance</h4>
                <button
                  className={`flex items-center gap-3 w-full p-2 bg-transparent border border-transparent rounded-md cursor-pointer transition-all duration-150 text-foreground text-sm ${
                    theme === 'light'
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'hover:bg-secondary'
                  }`}
                  data-mode="light"
                  onClick={(e) => handleModeSelect('light', e)}
                >
                  <div className="flex gap-1 w-8 h-8 rounded-sm overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200 border border-sky-600" />
                  <span>Light</span>
                </button>
                <button
                  className={`flex items-center gap-3 w-full p-2 bg-transparent border border-transparent rounded-md cursor-pointer transition-all duration-150 text-foreground text-sm ${
                    theme === 'dark'
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'hover:bg-secondary'
                  }`}
                  data-mode="dark"
                  onClick={(e) => handleModeSelect('dark', e)}
                >
                  <div className="flex gap-1 w-8 h-8 rounded-sm overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-600" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
