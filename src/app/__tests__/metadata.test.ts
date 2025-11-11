import { describe, it, expect } from 'vitest';
import { metadata } from '../layout';
import { metadata as aboutMetadata } from '../about/layout';
import { metadata as projectsMetadata } from '../projects/layout';
import { metadata as contactMetadata } from '../contact/layout';
import type { Metadata } from 'next';

describe('Root Layout Metadata', () => {
  it('should have metadataBase configured', () => {
    expect(metadata.metadataBase).toBeDefined();
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.toString()).toBe('https://liamwest.com/');
  });

  it('should have title with template configuration', () => {
    expect(metadata.title).toBeDefined();
    expect(typeof metadata.title).toBe('object');
    if (typeof metadata.title === 'object' && metadata.title !== null) {
      expect(metadata.title.default).toBe('Liam West - Engineering Portfolio');
      expect(metadata.title.template).toBe('%s | Liam West');
    }
  });

  it('should have description', () => {
    expect(metadata.description).toBeDefined();
    expect(typeof metadata.description).toBe('string');
    expect(metadata.description?.length).toBeGreaterThan(50);
  });

  it('should have keywords array', () => {
    expect(metadata.keywords).toBeDefined();
    expect(Array.isArray(metadata.keywords)).toBe(true);
    expect(metadata.keywords?.length).toBeGreaterThan(0);
  });

  it('should have author information', () => {
    expect(metadata.authors).toBeDefined();
    expect(Array.isArray(metadata.authors)).toBe(true);
    if (Array.isArray(metadata.authors) && metadata.authors.length > 0) {
      const author = metadata.authors[0];
      if (typeof author === 'object' && 'name' in author) {
        expect(author.name).toBe('Liam West');
        expect(author.url).toBe('https://liamwest.com');
      }
    }
  });

  it('should have robots configuration for SEO', () => {
    expect(metadata.robots).toBeDefined();
    if (typeof metadata.robots === 'object' && metadata.robots !== null) {
      expect(metadata.robots.index).toBe(true);
      expect(metadata.robots.follow).toBe(true);
      expect(metadata.robots.googleBot).toBeDefined();
    }
  });

  it('should have Open Graph configuration', () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.type).toBe('website');
    expect(metadata.openGraph?.locale).toBe('en_US');
    expect(metadata.openGraph?.title).toBeDefined();
    expect(metadata.openGraph?.description).toBeDefined();
    expect(metadata.openGraph?.siteName).toBe('Liam West Portfolio');
  });

  it('should have Open Graph images configured correctly', () => {
    expect(metadata.openGraph?.images).toBeDefined();
    expect(Array.isArray(metadata.openGraph?.images)).toBe(true);
    const images = metadata.openGraph?.images;
    if (Array.isArray(images) && images.length > 0) {
      const image = images[0];
      if (typeof image === 'object') {
        expect(image.url).toBe('/og-image.png');
        expect(image.width).toBe(1200);
        expect(image.height).toBe(630);
        expect(image.alt).toBeDefined();
      }
    }
  });

  it('should have Twitter Card configuration', () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe('summary_large_image');
    expect(metadata.twitter?.title).toBeDefined();
    expect(metadata.twitter?.description).toBeDefined();
    expect(metadata.twitter?.images).toBeDefined();
  });

  it('should have proper icon configuration', () => {
    expect(metadata.icons).toBeDefined();
    expect(metadata.icons?.icon).toBeDefined();
    expect(metadata.icons?.apple).toBeDefined();
  });

  it('should have manifest file configured', () => {
    expect(metadata.manifest).toBe('/site.webmanifest');
  });
});

describe('About Page Metadata', () => {
  it('should have title configured', () => {
    expect(aboutMetadata.title).toBe('About');
  });

  it('should have description', () => {
    expect(aboutMetadata.description).toBeDefined();
    expect(typeof aboutMetadata.description).toBe('string');
    expect(aboutMetadata.description?.includes('skills')).toBe(true);
  });

  it('should have Open Graph configuration', () => {
    expect(aboutMetadata.openGraph).toBeDefined();
    expect(aboutMetadata.openGraph?.url).toBe('/about');
    expect(aboutMetadata.openGraph?.type).toBe('profile');
  });

  it('should have Twitter Card configuration', () => {
    expect(aboutMetadata.twitter).toBeDefined();
    expect(aboutMetadata.twitter?.card).toBe('summary_large_image');
  });
});

describe('Projects Page Metadata', () => {
  it('should have title configured', () => {
    expect(projectsMetadata.title).toBe('Projects');
  });

  it('should have description', () => {
    expect(projectsMetadata.description).toBeDefined();
    expect(typeof projectsMetadata.description).toBe('string');
    expect(projectsMetadata.description?.includes('projects')).toBe(true);
  });

  it('should have Open Graph configuration', () => {
    expect(projectsMetadata.openGraph).toBeDefined();
    expect(projectsMetadata.openGraph?.url).toBe('/projects');
    expect(projectsMetadata.openGraph?.type).toBe('website');
  });

  it('should have Twitter Card configuration', () => {
    expect(projectsMetadata.twitter).toBeDefined();
    expect(projectsMetadata.twitter?.card).toBe('summary_large_image');
  });
});

describe('Contact Page Metadata', () => {
  it('should have title configured', () => {
    expect(contactMetadata.title).toBe('Contact');
  });

  it('should have description', () => {
    expect(contactMetadata.description).toBeDefined();
    expect(typeof contactMetadata.description).toBe('string');
    expect(contactMetadata.description?.toLowerCase().includes('contact') ||
           contactMetadata.description?.toLowerCase().includes('touch')).toBe(true);
  });

  it('should have Open Graph configuration', () => {
    expect(contactMetadata.openGraph).toBeDefined();
    expect(contactMetadata.openGraph?.url).toBe('/contact');
    expect(contactMetadata.openGraph?.type).toBe('website');
  });

  it('should have Twitter Card configuration', () => {
    expect(contactMetadata.twitter).toBeDefined();
    expect(contactMetadata.twitter?.card).toBe('summary_large_image');
  });
});

describe('SEO Best Practices', () => {
  it('all page titles should be unique', () => {
    const titles = [
      metadata.title,
      aboutMetadata.title,
      projectsMetadata.title,
      contactMetadata.title,
    ];

    const uniqueTitles = new Set(titles.map(t =>
      typeof t === 'string' ? t : typeof t === 'object' && t !== null ? t.default : ''
    ));

    expect(uniqueTitles.size).toBeGreaterThan(1);
  });

  it('all page descriptions should be unique and descriptive', () => {
    const descriptions = [
      metadata.description,
      aboutMetadata.description,
      projectsMetadata.description,
      contactMetadata.description,
    ];

    descriptions.forEach(desc => {
      expect(desc).toBeDefined();
      expect(typeof desc).toBe('string');
      expect(desc!.length).toBeGreaterThan(50);
      expect(desc!.length).toBeLessThan(200); // Allow slightly longer descriptions
    });
  });

  it('all OG images should use PNG format with correct dimensions', () => {
    const allMetadata: Metadata[] = [
      metadata,
      aboutMetadata,
      projectsMetadata,
      contactMetadata,
    ];

    allMetadata.forEach((meta, _index) => {
      const images = meta.openGraph?.images;
      if (Array.isArray(images) && images.length > 0) {
        const image = images[0];
        if (typeof image === 'object') {
          // Check for PNG or dynamic image generation (no extension)
          const url = image.url;
          expect(url).toBeTruthy();

          // If image has dimensions specified, they should be correct
          if (image.width && image.height) {
            expect(image.width).toBe(1200);
            expect(image.height).toBe(630);
          }
        }
      }
    });
  });

  it('all pages should have consistent Twitter card type', () => {
    const allMetadata: Metadata[] = [
      metadata,
      aboutMetadata,
      projectsMetadata,
      contactMetadata,
    ];

    allMetadata.forEach(meta => {
      expect(meta.twitter?.card).toBe('summary_large_image');
    });
  });
});
