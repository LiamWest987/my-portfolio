import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '../TimelineItem'

describe('TimelineItem (Organism)', () => {
  describe('Basic Rendering', () => {
    it('renders title', () => {
      render(<TimelineItem title="Software Engineer" date="2020 - Present" />)

      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    it('renders date', () => {
      render(<TimelineItem title="Title" date="2020 - 2024" />)

      expect(screen.getByText('2020 - 2024')).toBeInTheDocument()
    })

    it('renders subtitle when provided', () => {
      render(<TimelineItem title="Title" subtitle="Tech Company Inc." date="2020" />)

      expect(screen.getByText('Tech Company Inc.')).toBeInTheDocument()
    })

    it('does not render subtitle when not provided', () => {
      const { container } = render(<TimelineItem title="Title" date="2020" />)

      const subtitle = container.querySelector('.text-base')
      expect(subtitle).not.toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(<TimelineItem title="Title" date="2020" description="This is a description" />)

      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })

    it('does not render CardContent when no description, tags, or achievements', () => {
      const { container } = render(<TimelineItem title="Title" date="2020" />)

      // CardContent should not be rendered
      expect(container.querySelector('.text-muted-foreground.mb-4')).not.toBeInTheDocument()
    })
  })

  describe('Tags Rendering', () => {
    it('renders tags when provided', () => {
      render(<TimelineItem title="Title" date="2020" tags={['React', 'TypeScript', 'Node.js']} />)

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    it('does not render tags section when empty array', () => {
      const { container } = render(<TimelineItem title="Title" date="2020" tags={[]} />)

      const tagsContainer = container.querySelector('.flex.flex-wrap.gap-2.mb-4')
      expect(tagsContainer).not.toBeInTheDocument()
    })

    it('renders multiple tags', () => {
      const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']
      render(<TimelineItem title="Title" date="2020" tags={tags} />)

      tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument()
      })
    })
  })

  describe('Achievements Rendering', () => {
    it('renders achievements when provided', () => {
      const achievements = ['Improved performance by 40%', 'Mentored 3 junior developers']
      render(<TimelineItem title="Title" date="2020" achievements={achievements} />)

      expect(screen.getByText('Improved performance by 40%')).toBeInTheDocument()
      expect(screen.getByText('Mentored 3 junior developers')).toBeInTheDocument()
    })

    it('does not render achievements section when empty array', () => {
      const { container } = render(<TimelineItem title="Title" date="2020" achievements={[]} />)

      const achievementsList = container.querySelector('ul.space-y-2')
      expect(achievementsList).not.toBeInTheDocument()
    })

    it('renders achievements with bullet points', () => {
      const { container } = render(
        <TimelineItem title="Title" date="2020" achievements={['Achievement 1']} />
      )

      const bullets = container.querySelectorAll('.text-primary')
      expect(bullets.length).toBeGreaterThan(0)
    })

    it('renders multiple achievements', () => {
      const achievements = ['Achievement 1', 'Achievement 2', 'Achievement 3']
      render(<TimelineItem title="Title" date="2020" achievements={achievements} />)

      achievements.forEach(achievement => {
        expect(screen.getByText(achievement)).toBeInTheDocument()
      })
    })
  })

  describe('Combined Props', () => {
    it('renders all props together', () => {
      render(
        <TimelineItem
          title="Software Engineer"
          subtitle="Tech Company Inc."
          date="2020 - Present"
          description="Led development of key features"
          tags={['React', 'TypeScript']}
          achievements={['Improved performance by 40%']}
        />
      )

      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
      expect(screen.getByText('Tech Company Inc.')).toBeInTheDocument()
      expect(screen.getByText('2020 - Present')).toBeInTheDocument()
      expect(screen.getByText('Led development of key features')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Improved performance by 40%')).toBeInTheDocument()
    })

    it('renders with description and tags but no achievements', () => {
      render(
        <TimelineItem
          title="Title"
          date="2020"
          description="Description"
          tags={['Tag1', 'Tag2']}
        />
      )

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Tag1')).toBeInTheDocument()
      expect(screen.getByText('Tag2')).toBeInTheDocument()
    })

    it('renders with description and achievements but no tags', () => {
      render(
        <TimelineItem
          title="Title"
          date="2020"
          description="Description"
          achievements={['Achievement 1']}
        />
      )

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Achievement 1')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TimelineItem title="Title" date="2020" className="custom-class" />
      )

      const card = container.firstChild
      expect(card).toHaveClass('custom-class')
    })

    it('applies hover shadow classes', () => {
      const { container } = render(<TimelineItem title="Title" date="2020" />)

      const card = container.firstChild
      expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow')
    })
  })
})
