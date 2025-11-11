import { describe, it, expect } from 'vitest';

/**
 * Tests for Open Graph image configuration
 *
 * Note: These tests verify the exported constants from opengraph-image files.
 * The actual ImageResponse rendering is handled by Next.js at build time and
 * would require integration tests with a running Next.js server to fully test.
 */
describe('Open Graph Images Configuration', () => {
  describe('Root Page OG Image', () => {
    it('should export required image metadata', async () => {
      const module = await import('../opengraph-image');

      expect(module.alt).toBeDefined();
      expect(module.size).toBeDefined();
      expect(module.contentType).toBeDefined();
      expect(module.default).toBeDefined();
    });

    it('should have correct dimensions', async () => {
      const { size } = await import('../opengraph-image');

      expect(size.width).toBe(1200);
      expect(size.height).toBe(630);
    });

    it('should use PNG format', async () => {
      const { contentType } = await import('../opengraph-image');

      expect(contentType).toBe('image/png');
    });

    it('should have descriptive alt text', async () => {
      const { alt } = await import('../opengraph-image');

      expect(alt).toBeDefined();
      expect(typeof alt).toBe('string');
      expect(alt.length).toBeGreaterThan(0);
      expect(alt).toContain('Liam West');
    });
  });

  describe('About Page OG Image', () => {
    it('should export required image metadata', async () => {
      const module = await import('../about/opengraph-image');

      expect(module.alt).toBeDefined();
      expect(module.size).toBeDefined();
      expect(module.contentType).toBeDefined();
      expect(module.default).toBeDefined();
    });

    it('should have correct dimensions', async () => {
      const { size } = await import('../about/opengraph-image');

      expect(size.width).toBe(1200);
      expect(size.height).toBe(630);
    });

    it('should use PNG format', async () => {
      const { contentType } = await import('../about/opengraph-image');

      expect(contentType).toBe('image/png');
    });

    it('should have descriptive alt text', async () => {
      const { alt } = await import('../about/opengraph-image');

      expect(alt).toBeDefined();
      expect(alt).toContain('About');
    });
  });

  describe('Projects Page OG Image', () => {
    it('should export required image metadata', async () => {
      const module = await import('../projects/opengraph-image');

      expect(module.alt).toBeDefined();
      expect(module.size).toBeDefined();
      expect(module.contentType).toBeDefined();
      expect(module.default).toBeDefined();
    });

    it('should have correct dimensions', async () => {
      const { size } = await import('../projects/opengraph-image');

      expect(size.width).toBe(1200);
      expect(size.height).toBe(630);
    });

    it('should use PNG format', async () => {
      const { contentType } = await import('../projects/opengraph-image');

      expect(contentType).toBe('image/png');
    });

    it('should have descriptive alt text', async () => {
      const { alt } = await import('../projects/opengraph-image');

      expect(alt).toBeDefined();
      expect(alt).toContain('Projects');
    });
  });

  describe('Contact Page OG Image', () => {
    it('should export required image metadata', async () => {
      const module = await import('../contact/opengraph-image');

      expect(module.alt).toBeDefined();
      expect(module.size).toBeDefined();
      expect(module.contentType).toBeDefined();
      expect(module.default).toBeDefined();
    });

    it('should have correct dimensions', async () => {
      const { size } = await import('../contact/opengraph-image');

      expect(size.width).toBe(1200);
      expect(size.height).toBe(630);
    });

    it('should use PNG format', async () => {
      const { contentType } = await import('../contact/opengraph-image');

      expect(contentType).toBe('image/png');
    });

    it('should have descriptive alt text', async () => {
      const { alt } = await import('../contact/opengraph-image');

      expect(alt).toBeDefined();
      expect(alt).toContain('Contact');
    });
  });

  describe('OG Image Best Practices', () => {
    it('all OG images should have consistent dimensions', async () => {
      const [root, about, projects, contact] = await Promise.all([
        import('../opengraph-image'),
        import('../about/opengraph-image'),
        import('../projects/opengraph-image'),
        import('../contact/opengraph-image'),
      ]);

      const sizes = [root.size, about.size, projects.size, contact.size];

      sizes.forEach(size => {
        expect(size.width).toBe(1200);
        expect(size.height).toBe(630);
      });
    });

    it('all OG images should use PNG format', async () => {
      const [root, about, projects, contact] = await Promise.all([
        import('../opengraph-image'),
        import('../about/opengraph-image'),
        import('../projects/opengraph-image'),
        import('../contact/opengraph-image'),
      ]);

      const contentTypes = [
        root.contentType,
        about.contentType,
        projects.contentType,
        contact.contentType,
      ];

      contentTypes.forEach(contentType => {
        expect(contentType).toBe('image/png');
      });
    });

    it('all OG images should have unique alt text', async () => {
      const [root, about, projects, contact] = await Promise.all([
        import('../opengraph-image'),
        import('../about/opengraph-image'),
        import('../projects/opengraph-image'),
        import('../contact/opengraph-image'),
      ]);

      const altTexts = [root.alt, about.alt, projects.alt, contact.alt];
      const uniqueAlts = new Set(altTexts);

      expect(uniqueAlts.size).toBe(4); // All should be unique
    });

    it('all OG images should export a default function', async () => {
      const [root, about, projects, contact] = await Promise.all([
        import('../opengraph-image'),
        import('../about/opengraph-image'),
        import('../projects/opengraph-image'),
        import('../contact/opengraph-image'),
      ]);

      const defaults = [
        root.default,
        about.default,
        projects.default,
        contact.default,
      ];

      defaults.forEach(defaultExport => {
        expect(typeof defaultExport).toBe('function');
      });
    });
  });
});
