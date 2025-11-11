import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../atoms/card'
import { Badge } from '../molecules/Badge'
import { cn } from '@/lib/utils'

/**
 * Props for the TimelineItem component.
 */
interface TimelineItemProps {
  /** Main title/heading */
  title: string
  /** Optional subtitle (e.g., job title, degree) */
  subtitle?: string
  /** Date or date range */
  date: string
  /** Optional description text */
  description?: string
  /** Optional array of tags/technologies */
  tags?: string[]
  /** Optional array of achievements or accomplishments */
  achievements?: string[]
  /** Additional CSS classes to apply */
  className?: string
}

/**
 * TimelineItem component displays education, experience, or award information.
 * Designed for timeline-style layouts with consistent formatting.
 *
 * @param props - Component props
 * @param props.title - Main title/heading
 * @param props.subtitle - Optional subtitle (e.g., job title, degree)
 * @param props.date - Date or date range
 * @param props.description - Optional description text
 * @param props.tags - Optional array of tags/technologies
 * @param props.achievements - Optional array of achievements or accomplishments
 * @param props.className - Additional CSS classes to apply
 * @returns A styled timeline item card
 *
 * @example
 * ```tsx
 * <TimelineItem
 *   title="Software Engineer"
 *   subtitle="Tech Company Inc."
 *   date="2020 - Present"
 *   description="Led development of key features"
 *   tags={['React', 'TypeScript', 'Node.js']}
 *   achievements={[
 *     'Improved performance by 40%',
 *     'Mentored 3 junior developers'
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Education entry
 * <TimelineItem
 *   title="University Name"
 *   subtitle="Bachelor of Science in Computer Science"
 *   date="2016 - 2020"
 *   tags={['GPA: 3.8', 'Dean\'s List']}
 * />
 * ```
 *
 * @remarks
 * Built using shadcn Card atoms and Badge molecules for consistent styling.
 * Includes hover effect for interactive feel.
 */
export function TimelineItem({
  title,
  subtitle,
  date,
  description,
  tags,
  achievements,
  className,
}: TimelineItemProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{title}</CardTitle>
            {subtitle && <CardDescription className="text-base">{subtitle}</CardDescription>}
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">{date}</span>
        </div>
      </CardHeader>
      {(description || tags || achievements) && (
        <CardContent>
          {description && <p className="text-muted-foreground mb-4">{description}</p>}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1.5">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  )
}
