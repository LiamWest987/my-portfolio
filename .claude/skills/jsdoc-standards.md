# JSDoc Standards - The Mordecai Collective

## Overview

All public functions and types in The Mordecai Collective project should have JSDoc comments. This improves IDE intellisense and serves as inline documentation.

## Basic Function Documentation

```typescript
/**
 * Brief description of what the function does
 *
 * More detailed explanation if needed. Can span multiple lines
 * and provide context about when and how to use this function.
 *
 * @param paramName - Description of the parameter
 * @param anotherParam - Description of another parameter
 * @returns Description of what the function returns
 *
 * @example
 * const result = myFunction('hello', 42)
 * console.log(result) // "hello: 42"
 */
export function myFunction(paramName: string, anotherParam: number): string {
  return `${paramName}: ${anotherParam}`;
}
```

## Type/Interface Documentation

```typescript
/**
 * Represents a localized content object from Sanity CMS
 *
 * This type uses explicit language fields (titleEn, titleFr) rather than
 * nested locale objects. Index signature allows for TypeScript strict mode
 * compatibility when working with dynamic Sanity fields.
 */
export interface SanityVenture {
  /** Unique identifier for the venture */
  _id: string;

  /** English name of the venture */
  nameEn: string;

  /** French name of the venture */
  nameFr: string;

  /** URL-friendly slug for routing */
  slug: SanitySlug;

  /** Index signature for strict TypeScript compatibility */
  [key: string]: unknown;
}
```

## Real Examples from The Mordecai Collective

### Sanity Article Query Function

```typescript
/**
 * Fetches published articles from Sanity CMS with full content and metadata
 *
 * Retrieves articles targeted to specific audiences (Givers/Builders) with
 * all required fields for rendering article pages and listings.
 *
 * @param audience - Target audience filter ('giver' | 'builder' | 'both')
 * @param limit - Maximum number of articles to return (default: 10)
 * @returns Promise resolving to array of article objects with content and metadata
 *
 * @example
 * const giverArticles = await getArticles('giver', 5)
 * console.log(giverArticles[0].title) // "Releasing Your Storehouse"
 *
 * const allArticles = await getArticles('both')
 * console.log(allArticles.length) // Returns up to 10 articles
 */
export async function getArticles(
  audience: 'giver' | 'builder' | 'both',
  limit: number = 10
) {
  // implementation
}
```

### Newsletter Integration Function

```typescript
/**
 * Tags a newsletter subscriber in Brevo based on their audience preference
 *
 * Automatically assigns appropriate tags ('Giver' or 'Builder') when users
 * subscribe through newsletter CTAs, enabling targeted email sequences.
 *
 * @param email - Subscriber's email address
 * @param audience - Audience type ('giver' | 'builder')
 * @returns Promise resolving to Brevo API response
 *
 * @example
 * await tagSubscriber('user@example.com', 'giver')
 * // Subscriber now receives Giver-focused email sequence
 */
export async function tagSubscriber(
  email: string,
  audience: 'giver' | 'builder'
) {
  // implementation
}
```

## Required Tags

### For Functions

- `@param` - For each parameter (include type if not obvious from TypeScript)
- `@returns` - What the function returns
- `@example` - At least one usage example for complex functions
- `@throws` (optional) - If function can throw specific errors

### For Types/Interfaces

- Description of what the type represents
- Individual field descriptions for important/non-obvious fields
- Notes about special considerations (e.g., index signatures)

## Style Guidelines

1. **First Line**: Brief one-line summary
2. **Detailed Description**: Additional context if needed (separated by blank line)
3. **Tags**: All @param, @returns, @example tags
4. **Examples**: Show realistic usage with expected output
5. **Clarity**: Write for developers unfamiliar with the code
6. **Consistency**: Follow existing patterns in the codebase

## When to Add JSDoc

### Always Document

- Public functions exported from modules
- All types and interfaces
- Complex helper functions
- API routes and server actions

### Optional (but recommended)

- Simple type aliases
- Internal utility functions
- React components (props interfaces should be documented)

### Not Required

- Private functions (not exported)
- Obvious getters/setters
- Test files

## Tools and Validation

JSDoc comments improve:

- VS Code IntelliSense
- TypeScript type checking
- Automated documentation generation
- Code review understanding

## Bad Examples (Don't Do This)

```typescript
// Too brief, no context
/**
 * Gets field
 */
export function getField(obj, name) {}

// Missing @example
/**
 * Complex transformation function
 * @param data - The data
 * @returns The result
 */
export function transform(data) {}

// Redundant with TypeScript
/**
 * @param name - string
 * @param age - number
 * @returns string
 */
export function greet(name: string, age: number): string {}
```

## Good Examples (Do This)

```typescript
/**
 * Transforms raw Sanity data into a display-ready format
 *
 * Handles missing fields gracefully and applies default values
 * for optional properties.
 *
 * @param data - Raw Sanity document
 * @returns Formatted data ready for rendering
 *
 * @example
 * const raw = await client.fetch(query)
 * const formatted = transform(raw)
 * // formatted has all required fields with defaults applied
 */
export function transform(data: SanityDocument): FormattedData {}
```

## Current Coverage

- lib/sanity/client.ts: Needs documentation
- lib/sanity/queries.ts: Needs documentation
- types/articles.ts: Needs documentation for article interfaces
- types/studies.ts: Needs documentation for study interfaces
- components/marketing/: Minimal documentation
- app/(marketing)/: Route handlers need documentation

## Next Steps

Priority for JSDoc additions:

1. All article and study type interfaces
2. Sanity query functions (articles, studies, resources)
3. Newsletter integration functions (Phase 7)
4. Shared component prop interfaces
5. Form validation schemas
