'use client'

import React from 'react'
import styles from './HeroSection.module.css'

export interface SocialLink {
  href: string
  label: string
  icon?: React.ReactNode
}

export interface HeroSectionProps {
  badge: string
  title: React.ReactNode
  subtitle: React.ReactNode
  actions: React.ReactNode
  showScroll?: boolean
  socialLinks?: SocialLink[]
}

export function HeroSection({
  badge,
  title,
  subtitle,
  actions,
  showScroll = false,
  socialLinks,
}: HeroSectionProps) {
  return (
    <div className={styles['heroSection']}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {badge && <div className={styles['heroBadge']}>{badge}</div>}

        <h1 className={styles['heroTitle']}>{title}</h1>

        <p className={styles['heroSubtitle']}>{subtitle}</p>

        <div className={styles['heroActions']}>{actions}</div>

        {socialLinks && socialLinks.length > 0 && (
          <div className={styles['heroSocialLinks']}>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={styles['socialLink']}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon || link.label}
              </a>
            ))}
          </div>
        )}

        {showScroll && (
          <div className={styles['heroScroll']}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
