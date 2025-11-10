import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Initialize Sanity client
export const client = createClient({
  projectId: process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'] || "your-project-id",
  dataset: "portfolio",
  useCdn: process.env['NODE_ENV'] === "production", // Use CDN in production for better performance
  apiVersion: "2024-01-01",
});

// Image URL builder helper
const builder = imageUrlBuilder(client);

/**
 * Generate optimized image URL from Sanity image reference
 * @param source - Sanity image object
 * @returns Optimized image URL
 */
export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Fetch all projects from Sanity
 * @returns Array of project objects
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
    return projects.map((project: any) => ({
      ...project,
      pdf: project.pdfPath ? `/pdfs/${project.pdfPath.split("/").pop()}` : null,
    }));
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return [];
  }
}

/**
 * Fetch a single project by ID
 * @param id - Project ID
 * @returns Project object
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
 * Fetch all skill categories from Sanity
 * @returns Array of skill category objects
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
 * Fetch all education entries from Sanity
 * @returns Array of education objects
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
 * Fetch all experience entries from Sanity
 * @returns Array of experience objects
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
 * Fetch all awards from Sanity
 * @returns Array of award objects
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
 * Fetch contact page data from Sanity
 * @returns Contact page data object
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
