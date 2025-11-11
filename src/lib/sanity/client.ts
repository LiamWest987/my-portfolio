/**
 * Sanity CMS Client and Data Fetching Module
 *
 * Provides configured Sanity client instance and helper functions for fetching
 * portfolio data including projects, skills, education, experience, and awards.
 *
 * @module lib/sanity/client
 */

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Configured Sanity client instance.
 *
 * @remarks
 * Configuration:
 * - Uses project ID from environment or defaults to "40f0qafr"
 * - Uses dataset from environment or defaults to "portfolio"
 * - Enables CDN in production for improved performance
 * - API version locked to "2024-01-01" for consistency
 *
 * @example
 * ```typescript
 * import { client } from '@/lib/sanity/client';
 *
 * const data = await client.fetch('*[_type == "project"]');
 * ```
 */
export const client = createClient({
  projectId: process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'] || "40f0qafr",
  dataset: process.env['NEXT_PUBLIC_SANITY_DATASET'] || "portfolio",
  useCdn: process.env['NODE_ENV'] === "production", // Use CDN in production for better performance
  apiVersion: "2024-01-01",
});

/**
 * Image URL builder instance for Sanity images.
 *
 * @internal
 */
const builder = imageUrlBuilder(client);

/**
 * Generates an optimized image URL builder from a Sanity image reference.
 *
 * @param source - Sanity image object, reference, or asset document
 * @returns Image URL builder with chainable transformation methods
 *
 * @remarks
 * The returned builder allows chaining transformations like:
 * - `.width(300)` - Set image width
 * - `.height(200)` - Set image height
 * - `.format('webp')` - Change image format
 * - `.quality(80)` - Adjust quality
 * - `.url()` - Get the final URL string
 *
 * @example
 * ```typescript
 * import { urlFor } from '@/lib/sanity/client';
 *
 * // Basic usage
 * const imageUrl = urlFor(project.image).url();
 *
 * // With transformations
 * const thumbnail = urlFor(project.image)
 *   .width(300)
 *   .height(200)
 *   .format('webp')
 *   .url();
 * ```
 */
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/**
 * Fetches all projects from Sanity CMS ordered by date (newest first).
 *
 * @returns Promise resolving to array of project objects with complete details
 *
 * @remarks
 * Returns comprehensive project data including:
 * - Basic info (id, title, category, date)
 * - Media (images, PDFs)
 * - Content (descriptions, overview, technologies)
 * - Metadata (tags, featured status)
 * - Links (demo URLs)
 *
 * PDF paths are automatically converted from Sanity CDN URLs to local proxy URLs
 * for proper serving through the application. Empty array is returned on error.
 *
 * @throws Logs error to console if fetch fails, but returns empty array instead of throwing
 *
 * @example
 * ```typescript
 * const projects = await fetchProjects();
 * console.log(`Found ${projects.length} projects`);
 *
 * // Filter featured projects
 * const featured = projects.filter(p => p.featured);
 * ```
 */
export async function fetchProjects() {
  try {
    const projects = await client.fetch(`
      *[_type == "project"] | order(date desc) {
        _id,
        title,
        category,
        date,
        featured,
        "image": image.asset->url,
        "images": images[].asset->url,
        description,
        longDescription,
        overview,
        technologies,
        challenges,
        outcomes,
        tags,
        "pdfPath": pdf.asset->path,
        demo
      }
    `);
    // Convert Sanity CDN URLs to local proxy URLs
    return projects.map((project: { pdfPath?: string; [key: string]: unknown }) => ({
      ...project,
      pdf: project.pdfPath ? `/pdfs/${project.pdfPath.split("/").pop()}` : null,
    }));
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return [];
  }
}

/**
 * Fetches a single project from Sanity CMS by its unique identifier.
 *
 * @param id - Unique Sanity document ID of the project
 * @returns Promise resolving to project object or null if not found
 *
 * @remarks
 * Returns project data including title, category, date, image, descriptions,
 * technologies, and demo link. PDF path is automatically converted from Sanity
 * CDN URL to local proxy URL.
 *
 * @throws Logs error to console if fetch fails, but returns null instead of throwing
 *
 * @example
 * ```typescript
 * const project = await fetchProjectById('project-123');
 *
 * if (project) {
 *   console.log(project.title);
 *   console.log(project.technologies);
 * }
 * ```
 */
export async function fetchProjectById(id: string) {
  try {
    const project = await client.fetch(
      `
      *[_type == "project" && _id == $id][0] {
        _id,
        title,
        category,
        date,
        "image": image.asset->url,
        description,
        longDescription,
        technologies,
        "pdfPath": pdf.asset->path,
        demo
      }
    `,
      { id },
    );
    // Convert Sanity CDN URL to local proxy URL
    if (project && project.pdfPath) {
      project.pdf = `/pdfs/${project.pdfPath.split("/").pop()}`;
    }
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

/**
 * Fetches all skill categories from Sanity CMS ordered by display order.
 *
 * @returns Promise resolving to array of skill category objects
 *
 * @remarks
 * Each skill category includes:
 * - Unique ID
 * - Category title (e.g., "Programming Languages", "Tools")
 * - Display order number
 * - Array of individual skills in the category
 * - Optional icon identifier
 *
 * @throws Logs error to console if fetch fails, but returns empty array instead of throwing
 *
 * @example
 * ```typescript
 * const skills = await fetchSkills();
 * skills.forEach(category => {
 *   console.log(`${category.title}: ${category.skills.join(', ')}`);
 * });
 * ```
 */
export async function fetchSkills() {
  try {
    const skills = await client.fetch(`
      *[_type == "skillCategory"] | order(order asc) {
        _id,
        title,
        order,
        skills,
        icon
      }
    `);
    return skills;
  } catch (error) {
    console.error("Error fetching skills from Sanity:", error);
    return [];
  }
}

/**
 * Fetches all education entries from Sanity CMS ordered by display order.
 *
 * @returns Promise resolving to array of education objects
 *
 * @remarks
 * Each education entry includes degree, school name, dates, and description.
 * The `isCurrent` flag indicates if the education is ongoing.
 *
 * @throws Logs error to console if fetch fails, but returns empty array instead of throwing
 *
 * @example
 * ```typescript
 * const education = await fetchEducation();
 * const current = education.filter(e => e.isCurrent);
 * ```
 */
export async function fetchEducation() {
  try {
    const education = await client.fetch(`
      *[_type == "education"] | order(order asc) {
        _id,
        degree,
        school,
        year,
        startDate,
        endDate,
        isCurrent,
        description,
        order
      }
    `);
    return education;
  } catch (error) {
    console.error("Error fetching education from Sanity:", error);
    return [];
  }
}

/**
 * Fetches all work experience entries from Sanity CMS ordered by display order.
 *
 * @returns Promise resolving to array of experience objects
 *
 * @remarks
 * Each experience entry includes:
 * - Role and company information
 * - Start/end dates and period string
 * - Description of responsibilities
 * - Skills utilized
 * - Key achievements
 * - Current employment status
 *
 * @throws Logs error to console if fetch fails, but returns empty array instead of throwing
 *
 * @example
 * ```typescript
 * const experience = await fetchExperience();
 * const currentJob = experience.find(e => e.isCurrent);
 * ```
 */
export async function fetchExperience() {
  try {
    const experience = await client.fetch(`
      *[_type == "experience"] | order(order asc) {
        _id,
        role,
        company,
        period,
        startDate,
        endDate,
        isCurrent,
        description,
        skills,
        achievements,
        order
      }
    `);
    return experience;
  } catch (error) {
    console.error("Error fetching experience from Sanity:", error);
    return [];
  }
}

/**
 * Fetches all awards and recognitions from Sanity CMS ordered by display order.
 *
 * @returns Promise resolving to array of award objects
 *
 * @remarks
 * Each award includes title, description, issuer, date, category, and highlight status.
 * The `isHighlighted` flag can be used to feature notable awards prominently.
 *
 * @throws Logs error to console if fetch fails, but returns empty array instead of throwing
 *
 * @example
 * ```typescript
 * const awards = await fetchAwards();
 * const highlighted = awards.filter(a => a.isHighlighted);
 * ```
 */
export async function fetchAwards() {
  try {
    const awards = await client.fetch(`
      *[_type == "award"] | order(order asc) {
        _id,
        title,
        description,
        issuer,
        date,
        year,
        category,
        order,
        isHighlighted,
        icon
      }
    `);
    return awards;
  } catch (error) {
    console.error("Error fetching awards from Sanity:", error);
    return [];
  }
}

/**
 * Fetches contact page configuration data from Sanity CMS.
 *
 * @returns Promise resolving to contact data object or null if not found
 *
 * @remarks
 * Returns a singleton document containing:
 * - Main heading text
 * - Subtext/description
 * - Location information
 * - LinkedIn profile URL
 * - Email address
 * - Resume file URL
 * - Success message image URL
 *
 * This data is typically used to populate the contact page with CMS-managed content.
 *
 * @throws Logs error to console if fetch fails, but returns null instead of throwing
 *
 * @example
 * ```typescript
 * const contactData = await fetchContact();
 * if (contactData) {
 *   console.log(`Email: ${contactData.email}`);
 *   console.log(`LinkedIn: ${contactData.linkedinUrl}`);
 * }
 * ```
 */
export async function fetchContact() {
  try {
    const contact = await client.fetch(`
      *[_type == "contact"][0] {
        _id,
        mainText,
        subtext,
        location,
        linkedinUrl,
        email,
        "resume": resume.asset->url,
        "successImage": successImage.asset->url
      }
    `);
    return contact;
  } catch (error) {
    console.error("Error fetching contact from Sanity:", error);
    return null;
  }
}
