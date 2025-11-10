'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '../common/ThemeProvider'

interface HeaderProps {
  currentPage?: 'home' | 'projects' | 'about' | 'contact'
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const { theme, setTheme, isDropdownOpen, setIsDropdownOpen } = useTheme()

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleModeSelect = (mode: 'light' | 'dark', e: React.MouseEvent) => {
    e.stopPropagation()
    setTheme(mode)
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <span className="logo-bracket">&lt;</span>Liam West<span className="logo-accent"> /&gt;</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={currentPage === 'home' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/projects" className={currentPage === 'projects' ? 'active' : ''}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className={currentPage === 'about' ? 'active' : ''}>
                About & Skills
              </Link>
            </li>
            <li>
              <Link href="/contact" className={currentPage === 'contact' ? 'active' : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className={`theme-dropdown ${isDropdownOpen ? 'active' : ''}`}>
            <button
              className="theme-dropdown-trigger"
              aria-label="Change theme"
              onClick={toggleDropdown}
            >
              <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <svg className="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="theme-dropdown-content">
              <div className="theme-section">
                <h4 className="theme-section-title">Appearance</h4>
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  data-mode="light"
                  onClick={(e) => handleModeSelect('light', e)}
                >
                  <div className="theme-option-visual mode-light"></div>
                  <span>Light</span>
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  data-mode="dark"
                  onClick={(e) => handleModeSelect('dark', e)}
                >
                  <div className="theme-option-visual mode-dark"></div>
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
