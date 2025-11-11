import React from 'react'

/**
 * Social link configuration for hero section.
 */
export interface SocialLink {
  /** URL for the social link */
  href: string
  /** Accessible label for screen readers */
  label: string
  /** Optional icon component to display */
  icon?: React.ReactNode
}

/**
 * Props for the HeroSection component.
 */
export interface HeroSectionProps {
  /** Badge text displayed above title */
  badge: string
  /** Main heading (can include styled text/elements) */
  title: React.ReactNode
  /** Subtitle or description text */
  subtitle: React.ReactNode
  /** Call-to-action buttons or links */
  actions: React.ReactNode
  /** Whether to show scroll indicator (currently unused) */
  showScroll?: boolean
  /** Optional array of social media links */
  socialLinks?: SocialLink[]
}

/**
 * HeroSection component displays a prominent introductory section for pages.
 * Typically used on homepage with large heading, subtitle, and call-to-actions.
 *
 * @param props - Component props
 * @param props.badge - Badge text displayed above title
 * @param props.title - Main heading (can include styled text/elements)
 * @param props.subtitle - Subtitle or description text
 * @param props.actions - Call-to-action buttons or links
 * @param props.socialLinks - Optional array of social media links
 * @returns A full-width hero section with centered content
 *
 * @example
 * ```tsx
 * <HeroSection
 *   badge="Welcome"
 *   title={<>Hi, I'm <span className="text-accent">John</span></>}
 *   subtitle="Full-stack developer passionate about creating amazing experiences"
 *   actions={
 *     <>
 *       <Button variant="primary">View Projects</Button>
 *       <Button variant="outline">Contact Me</Button>
 *     </>
 *   }
 *   socialLinks={[
 *     { href: 'https://github.com/...', label: 'GitHub', icon: <GitHubIcon /> }
 *   ]}
 * />
 * ```
 *
 * @remarks
 * - Minimum height of 80vh for full-screen impact
 * - Responsive text sizing using CSS clamp()
 * - Centered content layout with flexbox
 */
export function HeroSection({
  badge,
  title,
  subtitle,
  actions,
  socialLinks,
}: HeroSectionProps) {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center py-12 text-center">
      <div className="flex flex-col items-center">
        {badge && <div className="mb-4 inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-sm text-foreground">{badge}</div>}

        <h1 className="mb-4 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight">{title}</h1>

        <p className="mx-auto mb-8 max-w-3xl text-[clamp(1.125rem,2vw,1.25rem)] leading-relaxed text-muted-foreground">{subtitle}</p>

        <div className="mb-8 flex flex-wrap justify-center gap-3">{actions}</div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-6 flex justify-center gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon || link.label}
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
