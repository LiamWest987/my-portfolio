import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', ...props }) => {
  return (
    <section className={`section ${className}`.trim()} {...props}>
      {children}
    </section>
  );
};
