/**
 * Global TypeScript Type Definitions
 *
 * Centralized type definitions used throughout the portfolio application.
 * These types ensure type safety and consistency across components.
 *
 * @module types
 */

/**
 * Contact page data structure from Sanity CMS.
 *
 * @remarks
 * This interface represents the shape of contact page content managed in Sanity CMS.
 * All fields except `_id` are optional to handle incomplete data gracefully.
 * The data is fetched using the `fetchContact` function from the Sanity client.
 *
 * @example
 * ```typescript
 * import { ContactData } from '@/types';
 *
 * const contactData: ContactData = {
 *   _id: 'contact-123',
 *   mainText: 'Get In Touch',
 *   email: 'example@email.com',
 *   linkedinUrl: 'https://linkedin.com/in/username'
 * };
 * ```
 */
export interface ContactData {
  /** Unique Sanity document identifier */
  _id: string
  /** Main heading text displayed on the contact page */
  mainText?: string
  /** Descriptive subtext or tagline */
  subtext?: string
  /** Physical location or city */
  location?: string
  /** Full URL to LinkedIn profile */
  linkedinUrl?: string
  /** Contact email address */
  email?: string
  /** URL to downloadable resume/CV file */
  resume?: string
  /** URL to success confirmation image shown after form submission */
  successImage?: string
}
