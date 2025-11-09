# Sanity Schema Files

These schema files define the structure of your content in Sanity CMS.

## Available Schemas

1. **Project** - Portfolio projects
2. **Skill Category** - Technical skills organized by category
3. **Education** - Educational background and certifications
4. **Experience** - Work experience and roles
5. **Award** - Awards, achievements, and recognitions

## Installation Instructions

1. **Copy all schema files to your Sanity Studio:**
   ```bash
   cp sanity-schemas/*.js studio/schemas/
   ```

2. **Update your Sanity Studio's schema configuration:**

   Open `studio/sanity.config.js` (or `studio/schemas/index.js` depending on your Sanity version) and import all schemas:

   ```javascript
   import { defineConfig } from 'sanity'
   import { deskTool } from 'sanity/desk'
   import { schemaTypes } from './schemas'

   export default defineConfig({
     name: 'default',
     title: 'Portfolio Website',
     projectId: 'your-project-id',
     dataset: 'production',
     plugins: [deskTool()],
     schema: {
       types: schemaTypes,
     },
   })
   ```

3. **Start your Sanity Studio:**
   ```bash
   cd studio
   npm run dev
   ```

4. **Add your content:**
   - Open Sanity Studio in your browser (usually http://localhost:3333)
   - You'll see all 5 content types in the sidebar
   - Add projects, skills, education, experience, and awards

## Schema Details

### 1. Project
Defines portfolio projects with all details.

**Fields:**
- **title** (string, required): Project name
- **category** (string, required): One of: Digital Electronics, Unity VR, PLTW POE, PLTW Aerospace
- **date** (date, required): Project completion date
- **image** (image, required): Main project image
- **description** (text, required): Short description (max 300 chars)
- **longDescription** (text, required): Detailed description
- **technologies** (array of strings): Tech stack used
- **pdf** (file): Optional PDF documentation
- **demo** (url): Optional demo link

### 2. Skill Category
Organizes technical skills into categories (e.g., "Digital Electronics", "VR Development").

**Fields:**
- **title** (string, required): Category name
- **order** (number, required): Display order (1, 2, 3...)
- **skills** (array of strings, required): List of skills in this category
- **icon** (string): Optional icon identifier

**Example Categories:**
- Digital Electronics
- VR Development
- Aerospace Engineering
- Robotics & Automation
- Engineering Tools
- Soft Skills

### 3. Education
Educational background entries including degrees and certifications.

**Fields:**
- **degree** (string, required): Degree/certification name
- **school** (string, required): Institution name
- **year** (string, required): Year or period (e.g., "Expected 2026", "Current")
- **startDate** (date): For sorting
- **endDate** (date): Leave blank if current
- **isCurrent** (boolean): Check if currently enrolled
- **description** (text, required): Details about coursework, GPA, achievements
- **order** (number, required): Display order

### 4. Experience
Work experience, internships, and project roles.

**Fields:**
- **role** (string, required): Job title/position
- **company** (string, required): Company/organization name
- **period** (string, required): Time period (e.g., "Summer 2024", "2023-Present")
- **startDate** (date, required): For sorting
- **endDate** (date): Leave blank if current
- **isCurrent** (boolean): Check if current position
- **description** (text, required): Brief description of role
- **skills** (array of strings): Skills used in this role
- **achievements** (array of strings): Key accomplishments
- **order** (number, required): Display order

### 5. Award
Awards, achievements, certifications, and recognitions.

**Fields:**
- **title** (string, required): Award/achievement name
- **description** (text, required): Brief description
- **issuer** (string): Issuing organization
- **date** (date): Date received
- **year** (string, required): Year/period
- **category** (string): Type (certification, academic, competition, leadership, project, other)
- **order** (number, required): Display order
- **isHighlighted** (boolean): Feature as top achievement
- **icon** (string): Icon style (medal, trophy, certificate, star, badge)

## Content Organization Tips

### Display Order
All schemas include an `order` field. Use it to control display order:
- Lower numbers appear first (1, 2, 3...)
- Most important items should have order = 1

### Current vs. Past
For Education and Experience:
- Check `isCurrent` for ongoing items
- Leave `endDate` blank for current items
- Period text will show "Current" automatically

### Highlighting Achievements
For Awards:
- Check `isHighlighted` for your top 3-5 achievements
- These will be visually emphasized in the UI

## Querying Content in Your App

Update your `sanity.js` to query all content types:

```javascript
// Fetch skills
export async function fetchSkills() {
  return client.fetch(`
    *[_type == "skillCategory"] | order(order asc) {
      _id,
      title,
      skills,
      icon
    }
  `);
}

// Fetch education
export async function fetchEducation() {
  return client.fetch(`
    *[_type == "education"] | order(order asc) {
      _id,
      degree,
      school,
      year,
      isCurrent,
      description
    }
  `);
}

// Fetch experience
export async function fetchExperience() {
  return client.fetch(`
    *[_type == "experience"] | order(order asc) {
      _id,
      role,
      company,
      period,
      isCurrent,
      description,
      skills,
      achievements
    }
  `);
}

// Fetch awards
export async function fetchAwards() {
  return client.fetch(`
    *[_type == "award"] | order(order asc) {
      _id,
      title,
      description,
      issuer,
      year,
      category,
      isHighlighted,
      icon
    }
  `);
}
```
