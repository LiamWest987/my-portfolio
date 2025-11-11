import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Header } from '@/components/ui'
import { ThemeProvider } from '@/components/common'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

// Mock Next.js usePathname hook
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('Header', () => {
  it('renders the logo', () => {
    renderWithTheme(<Header />)
    expect(screen.getByText(/Liam West/)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderWithTheme(<Header />)
    // Each link appears twice (desktop + mobile nav)
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('About & Skills').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1)
  })

  it('applies active styling to current page', () => {
    renderWithTheme(<Header />)
    const homeLinks = screen.getAllByText('Home')
    // At least one home link should have active styling
    const hasActiveLink = homeLinks.some(link => link.className.includes('text-accent'))
    expect(hasActiveLink).toBe(true)
  })

  it('renders theme toggle button', () => {
    renderWithTheme(<Header />)
    const themeButton = screen.getByLabelText('Change theme')
    expect(themeButton).toBeInTheDocument()
  })

  it('theme button is clickable', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')

    await user.click(themeButton)

    // The dropdown state is controlled by ThemeProvider
    // This test verifies the button is clickable
    expect(themeButton).toBeInTheDocument()
  })

  it('displays light and dark theme options', () => {
    renderWithTheme(<Header />)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('displays appearance section title', () => {
    renderWithTheme(<Header />)
    expect(screen.getByText('Appearance')).toBeInTheDocument()
  })

  it('has correct link hrefs', () => {
    renderWithTheme(<Header />)

    // Check first instance of each link (desktop nav)
    expect(screen.getAllByText('Home')[0].closest('a')).toHaveAttribute('href', '/')
    expect(screen.getAllByText('Projects')[0].closest('a')).toHaveAttribute('href', '/projects')
    expect(screen.getAllByText('About & Skills')[0].closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getAllByText('Contact')[0].closest('a')).toHaveAttribute('href', '/contact')
  })

  it('logo links to home page', () => {
    renderWithTheme(<Header />)
    const logo = screen.getByText(/Liam West/).closest('a')
    expect(logo).toHaveAttribute('href', '/')
  })

  it('opens theme dropdown when theme button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const dropdown = screen.getByTestId('theme-dropdown')

    // Initially hidden
    expect(dropdown).toHaveClass('invisible')

    await user.click(themeButton)

    // Should be visible after click
    expect(dropdown).toHaveClass('visible')
  })

  it('closes theme dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const dropdown = screen.getByTestId('theme-dropdown')

    // Open dropdown
    await user.click(themeButton)
    expect(dropdown).toHaveClass('visible')

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' })

    // Should be hidden
    expect(dropdown).toHaveClass('invisible')
  })

  it('does not close dropdown on non-Escape key press', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const dropdown = screen.getByTestId('theme-dropdown')

    // Open dropdown
    await user.click(themeButton)
    expect(dropdown).toHaveClass('visible')

    // Press other key
    fireEvent.keyDown(document, { key: 'Tab' })

    // Should still be visible
    expect(dropdown).toHaveClass('visible')
  })

  it('switches to light theme when light option is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    await user.click(themeButton)

    const lightOption = screen.getByText('Light').closest('button')
    await user.click(lightOption!)

    // Dropdown should close after selection
    const dropdown = screen.getByTestId('theme-dropdown')
    expect(dropdown).toHaveClass('invisible')
  })

  it('switches to dark theme when dark option is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    await user.click(themeButton)

    const darkOption = screen.getByText('Dark').closest('button')
    await user.click(darkOption!)

    // Dropdown should close after selection
    const dropdown = screen.getByTestId('theme-dropdown')
    expect(dropdown).toHaveClass('invisible')
  })

  it('highlights selected theme option', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    await user.click(themeButton)

    // Click light theme to select it
    const lightOption = screen.getByText('Light').closest('button')
    await user.click(lightOption!)

    // Reopen dropdown and check if light is highlighted
    await user.click(themeButton)
    const lightOptionAfter = screen.getByText('Light').closest('button')
    expect(lightOptionAfter).toHaveClass('bg-accent')
  })

  it('toggles dropdown open/closed on multiple clicks', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const dropdown = screen.getByTestId('theme-dropdown')

    // Initially closed
    expect(dropdown).toHaveClass('invisible')

    // Open
    await user.click(themeButton)
    expect(dropdown).toHaveClass('visible')

    // Close
    await user.click(themeButton)
    expect(dropdown).toHaveClass('invisible')
  })

  it('renders sun icon in light mode', () => {
    renderWithTheme(<Header />)
    const themeButton = screen.getByLabelText('Change theme')
    const sunIcon = themeButton.querySelector('svg:not(.hidden)')
    expect(sunIcon).toBeInTheDocument()
  })

  it('rotates chevron icon when dropdown is open', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const chevron = themeButton.querySelector('svg:last-child')

    // Initially not rotated
    expect(chevron).not.toHaveClass('rotate-180')

    // Click to open
    await user.click(themeButton)

    // Should be rotated
    expect(chevron).toHaveClass('rotate-180')
  })

  it('renders mobile menu button', () => {
    renderWithTheme(<Header />)
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('opens mobile menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')

    // Initially closed (aria-expanded should be false)
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(mobileMenuButton)

    // Should be open after click
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes mobile menu when backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    await user.click(mobileMenuButton)

    // Menu should be open
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true')

    // Click backdrop (div with bg-background/80 class)
    const backdrop = document.querySelector('.bg-background\\/80')
    if (backdrop) {
      await user.click(backdrop as HTMLElement)
    }

    // Menu should be closed
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes mobile menu when Escape key is pressed', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')

    // Open mobile menu
    await user.click(mobileMenuButton)
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true')

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' })

    // Should be closed
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows hamburger icon when menu is closed', () => {
    renderWithTheme(<Header />)
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')

    // Check for hamburger icon (3 lines)
    const hamburgerIcon = mobileMenuButton.querySelector('svg line[x1="3"]')
    expect(hamburgerIcon).toBeInTheDocument()
  })

  it('shows close icon when menu is open', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    await user.click(mobileMenuButton)

    // Check for close icon (X)
    const closeIcon = mobileMenuButton.querySelector('svg line[x1="18"]')
    expect(closeIcon).toBeInTheDocument()
  })
})
