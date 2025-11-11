import React from 'react';

/**
 * Props for the Container component.
 */
interface ContainerProps {
  /** Content to be rendered inside the container */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * Container component that wraps content with responsive max-width constraints.
 *
 * @param props - Component props
 * @returns Wrapped content in a responsive container
 *
 * @remarks
 * Applies the standard `container` class which typically includes:
 * - Responsive max-width constraints
 * - Horizontal padding
 * - Automatic horizontal centering
 *
 * @example
 * ```tsx
 * <Container className="py-8">
 *   <h1>Page Title</h1>
 *   <p>Content goes here</p>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container ${className}`.trim()}>
      {children}
    </div>
  );
};
