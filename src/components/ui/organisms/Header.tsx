'use client'

import React, { useEffect, useState } from 'react'
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
 * - Mobile navigation menu with hamburger icon
 */
export function Header() {
  const pathname = usePathname()
  const { theme, setTheme, isDropdownOpen, setIsDropdownOpen } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle Escape key to close dropdown and mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDropdownOpen) setIsDropdownOpen(false)
        if (isMobileMenuOpen) setIsMobileMenuOpen(false)
      }
    }

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
    return undefined
  }, [isDropdownOpen, setIsDropdownOpen, isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleModeSelect = (mode: 'light' | 'dark', e: React.MouseEvent) => {
    e.stopPropagation()
    setTheme(mode)
    setIsDropdownOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About & Skills' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-[1020] w-full border-b border-border bg-[color-mix(in_srgb,oklch(var(--background))_95%,transparent)] backdrop-blur-[8px] transition-[background-color,border-color] duration-300">
      <div className="mx-auto flex h-16 max-w-[75rem] items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center text-lg font-semibold text-foreground no-underline transition-colors duration-150 hover:text-primary"
        >
          <span className="text-primary">&lt;</span>Liam West
          <span className="text-accent"> /&gt;</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="m-0 flex list-none items-center gap-8 p-0">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium text-foreground no-underline transition-colors duration-150 hover:text-accent ${
                    pathname === link.href
                      ? 'text-accent after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-accent after:content-[""]'
                      : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Dropdown */}
          <div className="theme-dropdown relative">
            <button
              className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-secondary p-2 text-foreground transition-all duration-150 hover:border-accent hover:bg-muted"
              aria-label="Change theme"
              onClick={toggleDropdown}
            >
              <svg
                className="dark:hidden"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
              <svg
                className="hidden dark:block"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
              className={`absolute right-0 top-[calc(100%+0.5rem)] z-[1000] min-w-[220px] rounded-lg border border-border bg-card p-2 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] transition-all duration-150 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 ${
                isDropdownOpen
                  ? 'visible translate-y-0 opacity-100 max-sm:-translate-x-1/2 max-sm:translate-y-0'
                  : 'invisible -translate-y-2.5 opacity-0 max-sm:-translate-x-1/2 max-sm:-translate-y-2.5'
              }`}
            >
              <div className="py-2">
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Appearance
                </h4>
                <button
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-md border border-transparent bg-transparent p-2 text-sm text-foreground transition-all duration-150 ${
                    theme === 'light'
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  data-mode="light"
                  onClick={e => handleModeSelect('light', e)}
                >
                  <div className="flex h-8 w-8 gap-1 overflow-hidden rounded-sm border border-sky-600 bg-gradient-to-br from-sky-100 to-sky-200" />
                  <span>Light</span>
                </button>
                <button
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-md border border-transparent bg-transparent p-2 text-sm text-foreground transition-all duration-150 ${
                    theme === 'dark'
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  data-mode="dark"
                  onClick={e => handleModeSelect('dark', e)}
                >
                  <div className="flex h-8 w-8 gap-1 overflow-hidden rounded-sm border border-slate-600 bg-gradient-to-br from-slate-800 to-slate-950" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex cursor-pointer items-center justify-center rounded-md border border-border bg-secondary p-2 text-foreground transition-all duration-150 hover:border-accent hover:bg-muted md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 top-16 z-[1010] transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="bg-background/80 absolute inset-0 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Content */}
        <nav
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 h-full w-[280px] border-l border-border bg-card shadow-xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ul className="m-0 flex list-none flex-col gap-1 p-4">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex w-full items-center rounded-lg px-4 py-3 text-base font-medium transition-colors duration-150 ${
                    pathname === link.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-secondary hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
