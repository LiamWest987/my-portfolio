# Sanity Schema Files

These schema files define the structure of your content in Sanity CMS.

## Installation Instructions

1. **Copy schema files to your Sanity Studio:**
   ```bash
   cp sanity-schemas/project.js studio/schemas/
   ```

2. **Update your Sanity Studio's schema configuration:**

   Open `studio/sanity.config.js` (or `studio/schemas/index.js` depending on your Sanity version) and import the project schema:

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

4. **Add your projects:**
   - Open Sanity Studio in your browser (usually http://localhost:3333)
   - Click "Project" in the sidebar
   - Add your 15 projects with all their details

## Schema Structure

### Project
- **title** (string, required): Project name
- **category** (string, required): One of: Digital Electronics, Unity VR, PLTW POE, PLTW Aerospace
- **date** (date, required): Project completion date
- **image** (image, required): Main project image
- **description** (text, required): Short description (max 300 chars)
- **longDescription** (text, required): Detailed description
- **technologies** (array of strings): Tech stack used
- **pdf** (file): Optional PDF documentation
- **demo** (url): Optional demo link
