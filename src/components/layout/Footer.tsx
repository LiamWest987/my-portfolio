'use client'

import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const user = e.currentTarget.getAttribute('data-email-user')
    const domain = e.currentTarget.getAttribute('data-email-domain')
    if (user && domain) {
      window.location.href = `mailto:${user}@${domain}`
    }
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-bracket">&lt;</span>Liam West<span className="logo-accent"> /&gt;</span>
            </Link>

            {/* Social Links */}
            <div className="footer-social-links">
              <a
                id="footer-linkedin-link"
                href="https://www.linkedin.com/in/liam-west-/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                id="footer-email-link"
                href="#"
                data-email-user="liamwest987"
                data-email-domain="gmail.com"
                className="footer-social-icon"
                aria-label="Email"
                onClick={handleEmailClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </a>
            </div>

            <p className="footer-tagline">
              Engineering student passionate about circuit design, aerospace systems, and VR development.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="footer-nav-grid">
            {/* Site Map */}
            <div className="footer-nav-section">
              <h3 className="footer-nav-heading">Site Map</h3>
              <nav className="footer-nav-links">
                <Link href="/" className="footer-nav-link">
                  Homepage
                </Link>
                <Link href="/about" className="footer-nav-link">
                  About & Skills
                </Link>
                <Link href="/projects" className="footer-nav-link">
                  Projects
                </Link>
                <Link href="/contact" className="footer-nav-link">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div className="footer-nav-section">
              <h3 className="footer-nav-heading">Resources</h3>
              <nav className="footer-nav-links">
                <a
                  id="footer-resume-link"
                  href="/pdfs/resume.pdf"
                  className="footer-nav-link"
                  download
                >
                  Resume
                </a>
                <a
                  id="footer-linkedin-nav-link"
                  href="https://www.linkedin.com/in/liam-west-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="footer-back-to-top-container">
          <button className="back-to-top" onClick={handleBackToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            Back to Top
          </button>
        </div>
      </Container>

      {/* Copyright Bar */}
      <div className="footer-copyright-bar">
        <Container>
          <p id="footer-copyright" className="footer-copyright-text">
            Copyright © {currentYear}, Liam West. All Rights Reserved.
          </p>
        </Container>
      </div>
    </footer>
  )
}
