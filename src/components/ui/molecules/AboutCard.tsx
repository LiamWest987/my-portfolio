import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

/**
 * Props for the AboutCard component.
 */
interface AboutCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  items?: string[];
  tags?: string[];
  achievements?: string[];
  variant?: 'default' | 'timeline';
  className?: string;
  /** Heading level for the title (2-6, or 'div' for no semantic heading). Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | 'div';
}

/**
 * AboutCard component displays information cards in the About page.
 * Supports two variants: default and timeline, with different layouts.
 *
 * @param props - Component props
 * @param props.icon - Optional icon to display (default variant only)
 * @param props.title - Card title/heading
 * @param props.subtitle - Optional subtitle text
 * @param props.date - Optional date text (timeline variant)
 * @param props.description - Main descriptive text
 * @param props.items - Optional list of items to display
 * @param props.tags - Optional array of tags to display as badges
 * @param props.achievements - Optional array of achievements (timeline variant)
 * @param props.variant - Card style variant (default or timeline)
 * @param props.className - Additional CSS classes to apply
 * @returns A styled card displaying about information
 *
 * @example
 * ```tsx
 * // Default variant with icon
 * <AboutCard
 *   icon={<Icon />}
 *   title="Values"
 *   description="What I believe in"
 *   items={['Innovation', 'Quality', 'Collaboration']}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Timeline variant for education/experience
 * <AboutCard
 *   variant="timeline"
 *   title="University Name"
 *   subtitle="Degree Program"
 *   date="2020 - 2024"
 *   tags={['Computer Science', 'Engineering']}
 *   achievements={['Dean\'s List', 'Research Award']}
 * />
 * ```
 */
export const AboutCard: React.FC<AboutCardProps> = ({
  icon,
  title,
  subtitle,
  date,
  description,
  items,
  tags,
  achievements,
  variant = 'default',
  className,
  headingLevel = 3
}) => {
  const HeadingTag = headingLevel === 'div' ? 'div' : (`h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
  const headingClass = variant === 'timeline'
    ? "mb-1 text-xl font-semibold leading-tight"
    : "mb-2 text-lg font-semibold text-foreground";

  if (variant === 'timeline') {
    return (
      <Card className={cn(
        'transition-all duration-300 hover:shadow-lg hover:border-accent',
        className
      )}>
        <div className="flex flex-col gap-1.5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <HeadingTag className={headingClass}>{title}</HeadingTag>
              {subtitle && (
                <div className="text-base text-muted-foreground">{subtitle}</div>
              )}
            </div>
            {date && (
              <span className="whitespace-nowrap text-sm text-muted-foreground">{date}</span>
            )}
          </div>
        </div>
        <div className="px-6 pb-6">
          {description && (
            <p className="mb-4 text-muted-foreground">{description}</p>
          )}
          {tags && tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {achievements && achievements.length > 0 && (
            <ul className="m-0 list-none p-0">
              {achievements.map((achievement, index) => (
                <li key={index} className="mb-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {achievement}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'p-6 transition-all duration-300 hover:border-accent hover:shadow-lg md:p-8',
      className
    )}>
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <HeadingTag className={headingClass}>{title}</HeadingTag>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {items && items.length > 0 && (
        <ul className="m-0 list-none p-0">
          {items.map((item, index) => (
            <li key={index} className="mb-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
