import React from 'react';

/**
 * Props for the Section component.
 *
 * @remarks
 * Extends standard HTML section element attributes, allowing all native
 * section props like `id`, `aria-label`, etc.
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Content to be rendered inside the section */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the section */
  className?: string;
}

/**
 * Semantic section component for grouping related content.
 *
 * @param props - Component props including all HTML section attributes
 * @returns Semantic HTML section element with styling
 *
 * @remarks
 * A wrapper around the native `<section>` element that applies standard styling
 * while preserving all native HTML attributes. Useful for creating accessible,
 * semantically structured page layouts.
 *
 * @example
 * ```tsx
 * <Section className="py-16" id="about">
 *   <h2>About Me</h2>
 *   <p>Biography content...</p>
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({ children, className = '', ...props }) => {
  return (
    <section className={`section ${className}`.trim()} {...props}>
      {children}
    </section>
  );
};
