import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './atoms/card'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

interface TimelineItemProps {
  title: string
  subtitle?: string
  date: string
  description?: string
  tags?: string[]
  achievements?: string[]
  className?: string
}

/**
 * TimelineItem Component
 *
 * Displays education, experience, or award information in a timeline format.
 * Built on shadcn Card atom with Badge for tags.
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
