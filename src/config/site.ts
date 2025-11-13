/**
 * Site Configuration Module
 *
 * Central configuration object containing site metadata, author information,
 * and external links used throughout the portfolio application.
 *
 * @module config/site
 */

/**
 * Site-wide configuration object containing metadata and contact information.
 *
 * @remarks
 * This configuration is used for:
 * - SEO metadata (title, description, URLs)
 * - Social media links
 * - Contact information
 * - Site identity and branding
 *
 * Update this configuration when site information changes rather than
 * modifying values throughout the codebase.
 *
 * @example
 * ```typescript
 * import { siteConfig } from '@/config/site';
 *
 * // Use in metadata
 * export const metadata = {
 *   title: siteConfig.name,
 *   description: siteConfig.description,
 * };
 *
 * // Use for contact links
 * <a href={siteConfig.links.linkedin}>LinkedIn</a>
 * ```
 */
export const siteConfig = {
  /** Full site name displayed in browser title and metadata */
  name: 'Liam West - Portfolio',
  /** Site description for SEO and social media previews */
  description: 'Engineering student interested in product management and engineering',
  /** Canonical site URL */
  url: 'https://liamwest.com',
  /** Author/owner information */
  author: {
    /** Full name of the portfolio owner */
    name: 'Liam West',
    /** Primary contact email address */
    email: 'liamwest987@gmail.com',
    /** LinkedIn profile URL */
    linkedin: 'https://www.linkedin.com/in/liam-west-/',
  },
  /** External links used throughout the site */
  links: {
    /** LinkedIn profile URL for navigation and social links */
    linkedin: 'https://www.linkedin.com/in/liam-west-/',
    /** Mailto link for email contact */
    email: 'mailto:liamwest987@gmail.com',
  },
}
