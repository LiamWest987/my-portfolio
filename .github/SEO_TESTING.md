# SEO Metadata Testing

This document describes the automated tests for SEO metadata across the portfolio site.

## Test Coverage

### Metadata Tests (`src/app/__tests__/metadata.test.ts`)

Tests verify that all pages have proper SEO configuration:

#### Root Layout Tests (11 tests)
- ✅ MetadataBase URL configuration
- ✅ Title with template (`%s | Liam West`)
- ✅ Description (50+ characters)
- ✅ Keywords array
- ✅ Author information with URL
- ✅ Robots directives for search engines
- ✅ Open Graph configuration (type, locale, title, description, siteName)
- ✅ Open Graph images (1200x630px PNG)
- ✅ Twitter Card configuration
- ✅ Icon configuration (favicon, apple-touch-icon)
- ✅ Web manifest file

#### Page-Specific Metadata Tests (16 tests)
Each page (About, Projects, Contact) is tested for:
- ✅ Unique page title
- ✅ Descriptive content
- ✅ Open Graph URL and type
- ✅ Twitter Card configuration

#### SEO Best Practices Tests (4 tests)
- ✅ All page titles are unique
- ✅ All descriptions are 50-200 characters
- ✅ All OG images use PNG format with correct dimensions
- ✅ Consistent Twitter Card type across all pages

### Open Graph Image Tests (`src/app/__tests__/opengraph-image.test.ts`)

Tests verify dynamic OG image generation:

#### Image Configuration Tests (20 tests)
For each page (Home, About, Projects, Contact):
- ✅ Required exports (alt, size, contentType, default function)
- ✅ Correct dimensions (1200x630px)
- ✅ PNG content type
- ✅ Descriptive alt text

#### Image Best Practices Tests (4 tests)
- ✅ Consistent dimensions across all images
- ✅ All images use PNG format
- ✅ All images have unique alt text
- ✅ All images export a render function

## Running Tests

```bash
# Run all SEO tests
npm test -- src/app/__tests__/

# Run only metadata tests
npm test -- src/app/__tests__/metadata.test.ts

# Run only OG image tests
npm test -- src/app/__tests__/opengraph-image.test.ts

# Watch mode
npm test -- src/app/__tests__/ --watch
```

## Test Results

**Total Tests:** 47
**Status:** ✅ All Passing

- Metadata Tests: 27/27 ✅
- OG Image Tests: 20/20 ✅

## What's Being Tested

### 1. SEO Fundamentals
- Proper title tags with templates
- Meta descriptions within optimal length
- Keywords configuration
- Author attribution

### 2. Search Engine Optimization
- Robots meta tags for indexing
- MetadataBase for canonical URLs
- Unique, descriptive content per page
- Proper sitemap and manifest configuration

### 3. Social Media Sharing
- Open Graph tags for Facebook, LinkedIn
- Twitter Card configuration
- Custom OG images for each page (1200x630px)
- Proper image formats (PNG, not SVG)

### 4. Technical SEO
- Correct image dimensions
- Consistent metadata structure
- Valid content types
- Accessible alt text

## Continuous Integration

These tests run:
- On every commit (pre-commit hook)
- In CI/CD pipeline
- Before production deployments

## Validating in Production

After deployment, verify SEO with these tools:

1. **Open Graph Preview:**
   - [OpenGraph.xyz](https://www.opengraph.xyz/)
   - Test: `https://liamwest.com`

2. **Twitter Card Validator:**
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

3. **LinkedIn Post Inspector:**
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

4. **Google Rich Results:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)

## OG Image URLs

Dynamic OG images are generated at:
- `/opengraph-image` - Homepage
- `/about/opengraph-image` - About page
- `/projects/opengraph-image` - Projects page
- `/contact/opengraph-image` - Contact page

## Maintenance

When adding new pages:
1. Create `layout.tsx` with metadata export
2. Create `opengraph-image.tsx` for custom OG image
3. Add tests to `metadata.test.ts`
4. Add tests to `opengraph-image.test.ts`
5. Run tests to verify

## Troubleshooting

### Tests Failing After Adding New Page

```bash
# Make sure metadata is properly exported
export const metadata: Metadata = { ... }

# Verify OG image exports
export const alt = '...'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default async function Image() { ... }
```

### OG Images Not Showing

1. Check image dimensions (must be 1200x630)
2. Verify PNG format (not SVG)
3. Ensure metadataBase is set in root layout
4. Clear CDN cache after deployment
