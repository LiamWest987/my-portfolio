# Sanity Query Builder Skill

## Description

Write type-safe GROQ queries to fetch portfolio projects from Sanity CMS with proper field selection, filtering, and sorting patterns.

## When to Use

- Fetching all projects for projects page
- Filtering featured projects for homepage
- Querying projects by tag or category
- Fetching single project by ID
- Sorting projects by date

## Prerequisites

- Sanity client configured in `src/js/sanity.js`
- Project schema defined (see sanity-studio.md)
- Understanding of GROQ query language basics

---

## GROQ Query Basics

### Query Structure

```groq
*[filter] | order(field direction) {
  fieldSelection
}
```

**Components**:
- `*`: All documents
- `[filter]`: Filter criteria
- `| order()`: Sorting
- `{}`: Field selection (projection)

---

## Common Query Patterns

### Fetch All Projects

```javascript
const query = `*[_type == "project"] | order(date desc) {
  _id,
  title,
  description,
  "image": image.asset->url,
  date,
  tags
}`;
```

### Fetch Featured Projects Only

```javascript
const query = `*[_type == "project" && featured == true] | order(date desc) {
  _id,
  title,
  description,
  "image": image.asset->url,
  "images": images[].asset->url,
  date,
  featured
}`;
```

### Fetch Single Project by ID

```javascript
const query = `*[_type == "project" && _id == $id][0] {
  _id,
  title,
  description,
  overview,
  challenges,
  outcomes,
  "image": image.asset->url,
  "images": images[].asset->url,
  "pdf": pdf.asset->url,
  date,
  tags
}`;

const project = await client.fetch(query, { id: projectId });
```

### Fetch Projects with Specific Tag

```javascript
const query = `*[_type == "project" && $tag in tags] | order(date desc) {
  _id,
  title,
  description,
  "image": image.asset->url,
  date,
  tags
}`;

const projects = await client.fetch(query, { tag: 'Python' });
```

---

## Field Selection Patterns

### Image Asset URLs

```groq
// Single image
"image": image.asset->url

// Array of images
"images": images[].asset->url

// Image with metadata
"image": {
  "url": image.asset->url,
  "alt": image.alt,
  "hotspot": image.hotspot
}
```

### File Asset URLs

```groq
// PDF URL
"pdf": pdf.asset->url

// PDF with metadata
"pdf": {
  "url": pdf.asset->url,
  "name": pdf.asset->originalFilename,
  "size": pdf.asset->size
}
```

### All Fields

```groq
{
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
}
```

---

## Filtering

### Basic Filters

```groq
// Type filter
*[_type == "project"]

// Boolean filter
*[_type == "project" && featured == true]

// Multiple conditions (AND)
*[_type == "project" && featured == true && defined(pdf)]

// Multiple conditions (OR)
*[_type == "project" && (featured == true || defined(pdf))]
```

### Array Filters

```groq
// Has specific tag
*[_type == "project" && "Python" in tags]

// Has any of these tags
*[_type == "project" && count((tags[])[@ in ["Python", "JavaScript"]]) > 0]

// Has images array
*[_type == "project" && count(images) > 0]
```

### Date Filters

```groq
// After specific date
*[_type == "project" && date > "2024-01-01"]

// Between dates
*[_type == "project" && date >= "2024-01-01" && date <= "2024-12-31"]

// Recent projects (last 6 months)
*[_type == "project" && dateTime(date) > dateTime(now()) - 60*60*24*180]
```

---

## Sorting

### Basic Sorting

```groq
// Descending (newest first)
*[_type == "project"] | order(date desc)

// Ascending (oldest first)
*[_type == "project"] | order(date asc)

// Multiple sort fields
*[_type == "project"] | order(featured desc, date desc)

// Title alphabetically
*[_type == "project"] | order(title asc)
```

---

## Pagination

### Limit Results

```groq
// First 10 projects
*[_type == "project"] | order(date desc) [0...10]

// Projects 10-20
*[_type == "project"] | order(date desc) [10...20]

// Last 5 projects
*[_type == "project"] | order(date desc) [-5..-1]
```

---

## Complete Examples

### Homepage Featured Projects

```javascript
// src/js/home.js
import { client } from './sanity.js';

export async function fetchFeaturedProjects() {
  const query = `*[_type == "project" && featured == true] | order(date desc) [0...5] {
    _id,
    title,
    description,
    "image": image.asset->url,
    "images": images[].asset->url,
    date,
    tags
  }`;
  
  return await client.fetch(query);
}
```

### All Projects Page

```javascript
// src/js/projects.js
import { client } from './sanity.js';

export async function fetchAllProjects() {
  const query = `*[_type == "project"] | order(date desc) {
    _id,
    title,
    description,
    "image": image.asset->url,
    "pdf": pdf.asset->url,
    date,
    tags,
    featured
  }`;
  
  return await client.fetch(query);
}
```

### Project Modal Detail

```javascript
// src/js/modal.js
import { client } from './sanity.js';

export async function fetchProjectById(id) {
  const query = `*[_type == "project" && _id == $id][0] {
    _id,
    title,
    description,
    overview,
    challenges,
    outcomes,
    "image": image.asset->url,
    "images": images[].asset->url,
    "pdf": {
      "url": pdf.asset->url,
      "name": pdf.asset->originalFilename
    },
    date,
    tags
  }`;
  
  return await client.fetch(query, { id });
}
```

### Filter by Tag

```javascript
// src/js/filter.js
import { client } from './sanity.js';

export async function fetchProjectsByTag(tag) {
  const query = `*[_type == "project" && $tag in tags] | order(date desc) {
    _id,
    title,
    description,
    "image": image.asset->url,
    date,
    tags
  }`;
  
  return await client.fetch(query, { tag });
}
```

---

## Current Implementation

**File**: `src/js/sanity.js`

```javascript
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '40f0qafr',
  dataset: 'portfolio',
  useCdn: import.meta.env.PROD, // Use CDN in production only
  apiVersion: '2024-01-01',
});

export async function fetchProjects() {
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

  try {
    const projects = await client.fetch(query);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
```

---

## Best Practices

### 1. Always Filter by Type

```groq
// ✅ Good
*[_type == "project"]

// ❌ Bad (returns all documents)
*[]
```

### 2. Use Projections

Only fetch fields you need:

```groq
// ✅ Good - specific fields
{
  _id,
  title,
  description,
  "image": image.asset->url
}

// ❌ Bad - fetches everything
*
```

### 3. Handle Missing Fields

```groq
// Use defined() to check existence
*[_type == "project" && defined(pdf)]

// Provide fallback
"image": coalesce(image.asset->url, "default-image.jpg")
```

### 4. Optimize Asset References

```groq
// ✅ Good - direct URL resolution
"image": image.asset->url

// ❌ Bad - fetches entire asset object
"image": image.asset->
```

### 5. Use Parameters

```javascript
// ✅ Good - parameterized query
const query = `*[_type == "project" && _id == $id][0]`;
await client.fetch(query, { id: projectId });

// ❌ Bad - string interpolation (injection risk)
const query = `*[_type == "project" && _id == "${projectId}"][0]`;
```

---

## Performance Tips

### 1. Enable CDN in Production

```javascript
export const client = createClient({
  projectId: '40f0qafr',
  dataset: 'portfolio',
  useCdn: import.meta.env.PROD, // ✅ CDN in prod, fresh in dev
  apiVersion: '2024-01-01',
});
```

### 2. Limit Results

```groq
// Only fetch what you need
*[_type == "project"] | order(date desc) [0...10]
```

### 3. Avoid Over-fetching

```groq
// ✅ Good - only needed fields
{
  _id,
  title,
  "image": image.asset->url
}

// ❌ Bad - all fields
{
  *,
  "image": image.asset->url,
  "images": images[]
}
```

---

## Testing Queries

### Use Sanity Vision

1. Go to https://40f0qafr.sanity.studio
2. Open Vision tool (eye icon in sidebar)
3. Test queries in the playground
4. View results in real-time
5. Copy working query to code

### Example Test Queries

```groq
// Count total projects
count(*[_type == "project"])

// List all project titles
*[_type == "project"].title

// Check for projects with images
*[_type == "project" && defined(images)] {
  title,
  "imageCount": count(images)
}

// Find projects missing PDFs
*[_type == "project" && !defined(pdf)] {
  title,
  date
}
```

---

## Common Patterns

### Get Unique Tags

```javascript
export async function fetchAllTags() {
  const query = `array::unique(*[_type == "project"].tags[])`;
  return await client.fetch(query);
}
```

### Count Projects

```javascript
export async function countProjects() {
  const query = `count(*[_type == "project"])`;
  return await client.fetch(query);
}
```

### Check if Featured Projects Exist

```javascript
export async function hasFeaturedProjects() {
  const query = `count(*[_type == "project" && featured == true]) > 0`;
  return await client.fetch(query);
}
```

---

## Related Skills

- [Sanity Studio](./sanity-studio.md) - Schema and content management
- [Theme & Brand](./theme-and-brand.md) - Styling fetched content

---

## Resources

- [GROQ Documentation](https://www.sanity.io/docs/groq)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Vision Tool](https://www.sanity.io/docs/the-vision-plugin)

---

## Version History

- **v1.1.0** (2025-01): Updated for portfolio project schema with featured/images
- **v1.0.0** (2024): Initial GROQ query patterns for portfolio
