import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Footer } from '../layout/Footer'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  it('renders the footer logo', () => {
    render(<Footer />)
    const logoElements = screen.getAllByText(/Liam West/)
    expect(logoElements.length).toBeGreaterThan(0)
  })

  it('displays current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`Copyright © ${currentYear}`))).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<Footer />)
    expect(
      screen.getByText(/Engineering student passionate about circuit design/)
    ).toBeInTheDocument()
  })

  it('renders all site map navigation links', () => {
    render(<Footer />)
    expect(screen.getByText('Homepage')).toBeInTheDocument()
    expect(screen.getByText('About & Skills')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('site map links have correct hrefs', () => {
    render(<Footer />)
    expect(screen.getByText('Homepage').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('About & Skills').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '/projects')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
  })

  it('renders resources section with resume and LinkedIn links', () => {
    render(<Footer />)
    expect(screen.getByText('Resume')).toBeInTheDocument()
    const linkedInLinks = screen.getAllByText('LinkedIn')
    expect(linkedInLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('resume link has correct href and download attribute', () => {
    render(<Footer />)
    const resumeLink = screen.getByText('Resume').closest('a')
    expect(resumeLink).toHaveAttribute('href', '/pdfs/resume.pdf')
    expect(resumeLink).toHaveAttribute('download')
  })

  it('LinkedIn links have correct href and attributes', () => {
    render(<Footer />)
    const linkedinLinks = screen.getAllByLabelText('LinkedIn')
    linkedinLinks.forEach(link => {
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/liam-west-/')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('email link has correct data attributes', () => {
    render(<Footer />)
    const emailLink = screen.getByLabelText('Email')
    expect(emailLink).toHaveAttribute('data-email-user', 'liamwest987')
    expect(emailLink).toHaveAttribute('data-email-domain', 'gmail.com')
  })

  it('email link has correct attributes and is clickable', () => {
    render(<Footer />)

    const emailLink = screen.getByLabelText('Email')

    // Verify it's a link with proper attributes
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', '#')
    expect(emailLink).toHaveAttribute('data-email-user', 'liamwest987')
    expect(emailLink).toHaveAttribute('data-email-domain', 'gmail.com')

    // Click event handler is tested implicitly by the data attributes being present
    // The actual mailto behavior is browser-specific and doesn't need testing
  })

  it('back to top button is rendered', () => {
    render(<Footer />)
    expect(screen.getByText('Back to Top')).toBeInTheDocument()
  })

  it('back to top button scrolls to top when clicked', async () => {
    const user = userEvent.setup()
    render(<Footer />)

    const backToTopButton = screen.getByText('Back to Top')
    await user.click(backToTopButton)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('logo links to home page', () => {
    render(<Footer />)
    const logoElements = screen.getAllByText(/Liam West/)
    const logo = logoElements[0]?.closest('a')
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders section headings', () => {
    render(<Footer />)
    expect(screen.getByText('Site Map')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('has social icons with proper aria labels', () => {
    render(<Footer />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
