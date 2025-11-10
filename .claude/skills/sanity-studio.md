# Sanity Studio Skill

## Description

Create and manage content models, schemas, and Studio configuration for Liam West Portfolio's project showcase using Sanity v3 with JavaScript.

## When to Use

- Creating new document types for portfolio projects
- Defining schema for project metadata (title, description, images, PDFs)
- Managing project fields (tags, dates, featured status)
- Setting up content relationships and references
- Managing schema validation
- Adding new fields to existing schemas

## Prerequisites

- Sanity v3 installed
- Sanity project initialized (Project ID: 40f0qafr, Dataset: portfolio)
- Portfolio website integrated with Sanity client

---

## Overview

Sanity Studio provides the content editing interface for managing portfolio projects. It offers:

- **Schema-driven content**: Define content structure with JavaScript
- **Real-time editing**: Changes sync immediately
- **Image optimization**: Built-in CDN with automatic transforms
- **File uploads**: Support for PDFs and documents
- **Hosted Studio**: Accessible at https://40f0qafr.sanity.studio

**Portfolio Content Strategy**:
- Single document type: `project`
- Featured project filtering for homepage
- Multiple images per project for gallery
- PDF attachments for detailed documentation
- Tag-based categorization

---

## Project Schema

### Current Schema Structure

**File**: `portfolio-website/schemaTypes/project.js`

```javascript
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'overview',
      title: 'Overview',
      type: 'text'
    },
    {
      name: 'challenges',
      title: 'Challenges',
      type: 'text'
    },
    {
      name: 'outcomes',
      title: 'Outcomes',
      type: 'text'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Toggle to mark this project as featured',
      initialValue: false
    },
    {
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'images',
      title: 'Additional Project Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ],
      description: 'Optional gallery of additional project images'
    },
    {
      name: 'pdf',
      title: 'PDF Document',
      type: 'file',
      options: {
        accept: 'application/pdf'
      }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      date: 'date',
      featured: 'featured'
    },
    prepare(selection) {
      const {title, media, date, featured} = selection
      return {
        title,
        subtitle: `${date}${featured ? ' • Featured' : ''}`,
        media
      }
    }
  }
}
```

---

## Field Types Reference

| Field Type | Use Case | Example |
|------------|----------|---------|
| `string` | Short text | Title, tag |
| `text` | Long text | Description, overview, challenges |
| `date` | Project date | Completion date |
| `boolean` | True/false | Featured flag |
| `image` | Image upload | Main image, gallery images |
| `file` | File upload | PDF documentation |
| `array` | Multiple values | Tags, images |

---

## Schema Modification Patterns

### Adding a New Field

**Example: Adding a GitHub URL field**

```javascript
{
  name: 'githubUrl',
  title: 'GitHub Repository',
  type: 'url',
  description: 'Link to the GitHub repository',
  validation: Rule => Rule.uri({
    scheme: ['http', 'https']
  })
}
```

**Steps**:
1. Open `portfolio-website/schemaTypes/project.js`
2. Add new field to `fields` array
3. Save file (Sanity Studio auto-reloads)
4. Verify field appears in Studio

### Modifying Existing Field

**Example: Adding validation to description**

```javascript
{
  name: 'description',
  title: 'Description',
  type: 'text',
  validation: Rule => Rule.required().min(50).max(500)
}
```

### Adding Field Descriptions

Always add descriptions for editor guidance:

```javascript
{
  name: 'featured',
  title: 'Featured Project',
  type: 'boolean',
  description: 'Featured projects appear on the homepage. Limit to 3-5 projects.',
  initialValue: false
}
```

---

## Validation Rules

### Common Validation Patterns

```javascript
// Required field
validation: Rule => Rule.required()

// String length constraints
validation: Rule => Rule.required().min(10).max(200)

// URL validation
validation: Rule => Rule.uri({
  scheme: ['http', 'https']
})

// Custom validation
validation: Rule => Rule.custom((value) => {
  if (!value || value.length < 10) {
    return 'Title must be at least 10 characters'
  }
  return true
})

// Array validation
validation: Rule => Rule.required().min(1).max(5)
```

---

## Preview Configuration

The preview configuration controls how projects appear in Studio's list view:

```javascript
preview: {
  select: {
    title: 'title',
    media: 'image',
    date: 'date',
    featured: 'featured'
  },
  prepare(selection) {
    const {title, media, date, featured} = selection
    return {
      title,
      subtitle: `${date}${featured ? ' • Featured' : ''}`,
      media
    }
  }
}
```

**Customization options**:
- `title`: Main text in list view
- `subtitle`: Secondary text below title
- `media`: Thumbnail image
- `description`: Additional context (shows on hover)

---

## Image Handling

### Main Image

```javascript
{
  name: 'image',
  title: 'Main Image',
  type: 'image',
  options: {
    hotspot: true  // Enables focal point selection
  }
}
```

### Image Gallery (Array of Images)

```javascript
{
  name: 'images',
  title: 'Additional Project Images',
  type: 'array',
  of: [
    {
      type: 'image',
      options: {
        hotspot: true
      }
    }
  ],
  description: 'Optional gallery of additional project images'
}
```

**Best practices**:
- Always enable `hotspot: true` for better cropping
- Add descriptions to guide editors
- Limit gallery size if needed: `validation: Rule => Rule.max(10)`

---

## File Uploads

### PDF Documents

```javascript
{
  name: 'pdf',
  title: 'PDF Document',
  type: 'file',
  options: {
    accept: 'application/pdf'
  }
}
```

### Multiple File Types

```javascript
{
  name: 'attachments',
  title: 'Project Attachments',
  type: 'array',
  of: [
    {
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.zip'
      }
    }
  ]
}
```

---

## Studio Workflow

### Creating a New Project

**Step-by-step**:

1. **Access Studio**: Navigate to https://40f0qafr.sanity.studio
2. **Create Project**: Click "Create" → "Project"
3. **Fill Required Fields**:
   - Title (project name)
   - Description (summary)
   - Date (completion date)
   - Main Image (primary screenshot)
4. **Optional Fields**:
   - Overview (detailed description)
   - Challenges (technical challenges faced)
   - Outcomes (results and impact)
   - Featured (checkbox for homepage)
   - Images (additional screenshots for gallery)
   - PDF (detailed documentation)
   - Tags (technology stack, categories)
5. **Publish**: Click "Publish" to make live
6. **Verify**: Check project appears on website

### Editing Existing Projects

1. **Find Project**: Use search or browse list
2. **Make Changes**: Update any fields
3. **Publish**: Click "Publish" to save changes
4. **Verify**: Confirm changes appear on site (may need cache refresh)

### Uploading Images

1. **Click image field** → "Select" or drag & drop
2. **Upload image** from computer
3. **Set hotspot** (optional): Click image → drag focal point
4. **Save**: Studio auto-saves after upload

### Managing Featured Projects

**Best practices**:
- Limit to 3-5 featured projects on homepage
- Review featured projects regularly
- Feature your best/most recent work

**Query on frontend**:
```javascript
const featuredProjects = projects
  .filter(p => p.featured === true)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
```

---

## Integration with Frontend

### GROQ Query (in src/js/sanity.js)

```javascript
const query = `*[_type == "project"] | order(date desc) {
  _id,
  title,
  description,
  overview,
  challenges,
  outcomes,
  date,
  featured,
  "image": image.asset->url,
  "images": images[].asset->url,
  "pdf": pdf.asset->url,
  tags
}`;
```

### Fetching Projects

```javascript
import { client } from './sanity.js';

export async function fetchProjects() {
  const query = `*[_type == "project"] | order(date desc) {
    _id,
    title,
    description,
    featured,
    "image": image.asset->url,
    "images": images[].asset->url,
    date,
    tags
  }`;

  return await client.fetch(query);
}
```

### Image URL Transforms

Sanity provides automatic image optimization:

```javascript
// Original
"image": image.asset->url

// With transforms (via @sanity/image-url)
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

// Usage
urlFor(project.image)
  .width(800)
  .height(600)
  .fit('crop')
  .url()
```

---

## Common Schema Patterns for Portfolio

### Adding Technology Stack

```javascript
{
  name: 'technologies',
  title: 'Technologies Used',
  type: 'array',
  of: [{type: 'string'}],
  options: {
    list: [
      {title: 'Python', value: 'python'},
      {title: 'JavaScript', value: 'javascript'},
      {title: 'React', value: 'react'},
      {title: 'Node.js', value: 'nodejs'},
      {title: 'PostgreSQL', value: 'postgresql'},
      {title: 'AWS', value: 'aws'}
    ]
  }
}
```

### Adding External Links

```javascript
{
  name: 'links',
  title: 'Project Links',
  type: 'object',
  fields: [
    {
      name: 'live',
      title: 'Live Demo',
      type: 'url'
    },
    {
      name: 'github',
      title: 'GitHub Repository',
      type: 'url'
    },
    {
      name: 'documentation',
      title: 'Documentation',
      type: 'url'
    }
  ]
}
```

### Adding Project Categories

```javascript
{
  name: 'category',
  title: 'Project Category',
  type: 'string',
  options: {
    list: [
      {title: 'Web Development', value: 'web'},
      {title: 'Data Engineering', value: 'data-engineering'},
      {title: 'Machine Learning', value: 'ml'},
      {title: 'Mobile Development', value: 'mobile'},
      {title: 'DevOps', value: 'devops'}
    ],
    layout: 'radio'
  },
  validation: Rule => Rule.required()
}
```

---

## Migration Scripts

### Bulk Update Featured Status

```javascript
// scripts/set-featured.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '40f0qafr',
  dataset: 'portfolio',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function setFeatured(projectIds) {
  for (const id of projectIds) {
    await client
      .patch(id)
      .set({ featured: true })
      .commit()
    console.log(`Set ${id} as featured`)
  }
}

// Usage
setFeatured(['project-id-1', 'project-id-2', 'project-id-3'])
```

### Import Projects from JSON

```javascript
// scripts/import-projects.mjs
import { createClient } from '@sanity/client'
import fs from 'fs'

const client = createClient({
  projectId: '40f0qafr',
  dataset: 'portfolio',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function importProjects(jsonFile) {
  const projects = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))

  for (const project of projects) {
    // Upload images
    const imageAsset = await uploadImage(project.imagePath)
    const pdfAsset = project.pdfPath ? await uploadPDF(project.pdfPath) : null

    // Create project document
    await client.create({
      _type: 'project',
      title: project.title,
      description: project.description,
      date: project.date,
      featured: project.featured || false,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        }
      },
      pdf: pdfAsset ? {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: pdfAsset._id
        }
      } : undefined,
      tags: project.tags
    })

    console.log(`Imported: ${project.title}`)
  }
}
```

---

## Best Practices

### 1. Schema Organization

- Keep project schema in `portfolio-website/schemaTypes/project.js`
- Export schema in `portfolio-website/schemaTypes/index.ts`
- Use descriptive field names and titles
- Add helpful descriptions for editors

### 2. Validation Strategy

- Require essential fields (title, description, date)
- Add length constraints for text fields
- Validate URLs with proper schemes
- Use `initialValue` for boolean fields

### 3. Image Management

- Always enable hotspot for responsive cropping
- Use descriptive titles for image fields
- Consider file size when uploading (optimize before upload)
- Use Sanity's image transforms on frontend

### 4. Featured Projects

- Limit to 3-5 featured projects
- Review and update regularly
- Use preview configuration to show featured badge
- Sort by date on frontend

### 5. Content Guidelines

- Write clear, concise descriptions
- Include technical challenges and outcomes
- Tag projects consistently
- Keep PDFs under 5MB when possible

---

## Related Skills

- [Sanity Query Builder](./sanity-query.md) - GROQ query patterns
- [Theme & Brand](./theme-and-brand.md) - Styling project cards
- [Deployment](./deployment.md) - Deploying Studio to Sanity hosting

---

## Common Issues

### Studio Not Updating

**Solution**: Restart Sanity Studio dev server
```bash
cd portfolio-website
npm run dev
```

### Images Not Displaying

**Check**:
1. Image is uploaded in Studio
2. Query includes `"image": image.asset->url`
3. URL is not null/undefined
4. CORS is configured (should be automatic)

### Changes Not Appearing on Site

**Solutions**:
1. Verify project is published (not draft)
2. Check CDN cache (disable CDN in dev: `useCdn: false`)
3. Refresh frontend query
4. Check browser cache

---

## Checklist

When modifying the schema:

- [ ] Update field in `schemaTypes/project.js`
- [ ] Add validation if field is required
- [ ] Add description for editors
- [ ] Test in Studio interface
- [ ] Update GROQ query in `src/js/sanity.js` if needed
- [ ] Update frontend components if new field
- [ ] Test with existing projects
- [ ] Document changes

---

## Version History

- **v1.1.0** (2025-01): Added featured and images fields
- **v1.0.0** (2024): Initial portfolio project schema
