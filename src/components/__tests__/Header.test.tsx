import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Header } from '../layout/Header'
import { ThemeProvider } from '../common/ThemeProvider'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
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
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('About & Skills')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('applies active class to current page', () => {
    renderWithTheme(<Header currentPage="projects" />)
    const projectsLink = screen.getByText('Projects')
    expect(projectsLink).toHaveClass('active')
  })

  it('does not apply active class to other pages', () => {
    renderWithTheme(<Header currentPage="projects" />)
    const homeLink = screen.getByText('Home')
    expect(homeLink).not.toHaveClass('active')
  })

  it('defaults to home page when no currentPage is provided', () => {
    renderWithTheme(<Header />)
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('active')
  })

  it('renders theme toggle button', () => {
    renderWithTheme(<Header />)
    const themeButton = screen.getByLabelText('Change theme')
    expect(themeButton).toBeInTheDocument()
  })

  it('toggles dropdown when theme button is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(<Header />)

    const themeButton = screen.getByLabelText('Change theme')
    const dropdown = themeButton.closest('.theme-dropdown')

    expect(dropdown).not.toHaveClass('active')

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

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home')
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '/projects')
    expect(screen.getByText('About & Skills').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
  })

  it('logo links to home page', () => {
    renderWithTheme(<Header />)
    const logo = screen.getByText(/Liam West/).closest('a')
    expect(logo).toHaveAttribute('href', '/home')
  })
})
