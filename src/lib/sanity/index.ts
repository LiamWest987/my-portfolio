/**
 * Sanity CMS Integration Module
 *
 * Central re-export location for all Sanity CMS functionality including the
 * configured client, image URL builder, and data fetching functions.
 *
 * @module lib/sanity
 */

/**
 * Re-exports all Sanity client functionality for convenient access.
 *
 * @remarks
 * Exported items:
 * - `client` - Configured Sanity client instance
 * - `urlFor` - Image URL builder function
 * - `fetchProjects` - Fetch all projects
 * - `fetchProjectById` - Fetch single project by ID
 * - `fetchSkills` - Fetch skill categories
 * - `fetchEducation` - Fetch education entries
 * - `fetchExperience` - Fetch work experience
 * - `fetchAwards` - Fetch awards and recognitions
 * - `fetchContact` - Fetch contact page data
 *
 * @example
 * ```typescript
 * import { client, fetchProjects, urlFor } from '@/lib/sanity';
 *
 * const projects = await fetchProjects();
 * const imageUrl = urlFor(projects[0].image).width(300).url();
 * ```
 */
export { client, urlFor, fetchProjects, fetchProjectById, fetchSkills, fetchEducation, fetchExperience, fetchAwards, fetchContact } from './client'
