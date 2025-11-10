import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './atoms/card'
import { cn } from '@/lib/utils'

interface SkillCategoryCardProps {
  icon: React.ReactNode
  title: string
  skills: string[]
  className?: string
}

/**
 * SkillCategoryCard Component
 *
 * Displays a category of skills with an icon, title, and list of skills.
 * Built on shadcn Card atom for consistency.
 */
export function SkillCategoryCard({ icon, title, skills, className }: SkillCategoryCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {skills.map((skill, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {skill}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
