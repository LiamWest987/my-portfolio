import React from 'react';

/**
 * Props for the PageHeader component.
 */
interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page description (can be string or React elements) */
  description: string | React.ReactNode;
}

/**
 * PageHeader component displays the main heading and description for a page.
 * Provides consistent styling for page introductions.
 *
 * @param props - Component props
 * @param props.title - Page title
 * @param props.description - Page description (can be string or React elements)
 * @returns A styled page header with title and description
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="About Me"
 *   description="Learn about my background and experience"
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-12 text-center">
      <h1 className="mb-4 text-4xl font-bold text-foreground">{title}</h1>
      <div className="mx-auto max-w-2xl text-base text-muted-foreground">{description}</div>
    </div>
  );
};
