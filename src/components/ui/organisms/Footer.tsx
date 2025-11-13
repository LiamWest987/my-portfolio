'use client'

import Link from 'next/link'
import { Container } from '@/components/ui'

/**
 * Footer component provides site-wide footer with navigation, social links, and copyright.
 * Comprehensive footer with multiple sections and back-to-top functionality.
 *
 * @returns The site footer with navigation and information
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 *
 * @remarks
 * Features:
 * - Brand section with logo and social media links
 * - Site map navigation
 * - Resource links (resume, LinkedIn)
 * - Back to top button with smooth scroll
 * - Dynamic copyright year
 * - Responsive grid layout
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  const getEmailHref = (user: string, domain: string) => {
    return `mailto:${user}@${domain}`
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto w-full border-t border-border bg-card pt-8 md:pt-12">
      <Container>
        <div className="mb-8 grid grid-cols-1 gap-8 md:mb-12 md:grid-cols-2 md:gap-12 lg:grid-cols-[2fr_1fr]">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex w-fit items-center text-xl font-bold text-foreground transition-colors duration-200 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="font-extrabold text-accent">&lt;</span>Liam West
              <span className="font-extrabold text-accent"> /&gt;</span>
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                id="footer-linkedin-link"
                href="https://www.linkedin.com/in/liam-west-/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary p-2 text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="LinkedIn"
              >
                <svg
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                id="footer-email-link"
                href={getEmailHref('liamwest987', 'gmail.com')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary p-2 text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Email"
              >
                <svg
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
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>

            <p className="m-0 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Engineering student interested in product management and engineering.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {/* Site Map */}
            <div className="flex flex-col gap-3">
              <h3 className="m-0 text-sm font-semibold uppercase tracking-wider text-foreground">
                Site Map
              </h3>
              <nav aria-label="Footer site map" className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Homepage
                </Link>
                <Link
                  href="/about"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  About & Skills
                </Link>
                <Link
                  href="/projects"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <h3 className="m-0 text-sm font-semibold uppercase tracking-wider text-foreground">
                Resources
              </h3>
              <nav aria-label="Footer resources" className="flex flex-col gap-2">
                <a
                  id="footer-resume-link"
                  href="/pdfs/resume.pdf"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  download
                >
                  Resume
                </a>
                <a
                  id="footer-linkedin-nav-link"
                  href="https://www.linkedin.com/in/liam-west-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-block w-fit text-sm text-muted-foreground transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:text-accent hover:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="mt-4 flex justify-center border-t border-border py-6 md:mt-8">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={handleBackToTop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            Back to Top
          </button>
        </div>
      </Container>

      {/* Copyright Bar */}
      <div className="border-t border-border bg-background py-4">
        <Container>
          <p id="footer-copyright" className="m-0 text-center text-sm text-muted-foreground">
            Copyright © {currentYear}, Liam West. All Rights Reserved.
          </p>
        </Container>
      </div>
    </footer>
  )
}
