import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Initialize Sanity client
// NOTE: Replace 'your-project-id' with your actual Sanity project ID
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: 'production',
  useCdn: true, // Use CDN for faster response times
  apiVersion: '2024-01-01', // Use current date for API versioning
});

// Image URL builder helper
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image reference
 * @param {Object} source - Sanity image object
 * @returns {String} - Optimized image URL
 */
export function urlFor(source) {
  return builder.image(source);
}

/**
 * Fetch all projects from Sanity
 * @returns {Promise<Array>} - Array of project objects
 */
export async function fetchProjects() {
  try {
    const projects = await client.fetch(`
      *[_type == "project"] | order(date desc) {
        _id,
        title,
        category,
        date,
        "image": image.asset->url,
        description,
        longDescription,
        technologies,
        "pdf": pdf.asset->url,
        demo
      }
    `);
    return projects;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID
 * @param {String} id - Project ID
 * @returns {Promise<Object>} - Project object
 */
export async function fetchProjectById(id) {
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
        "pdf": pdf.asset->url,
        demo
      }
    `,
      { id }
    );
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
