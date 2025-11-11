import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutCard } from '../AboutCard'

describe('AboutCard', () => {
  describe('Default Variant', () => {
    it('renders with required props', () => {
      render(<AboutCard title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('renders icon when provided', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>
      render(<AboutCard title="Test" icon={<TestIcon />} />)
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('does not render icon when not provided', () => {
      const { container } = render(<AboutCard title="Test" />)
      expect(container.querySelector('[data-testid="test-icon"]')).not.toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(<AboutCard title="Test" description="This is a test description" />)
      expect(screen.getByText('This is a test description')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      render(<AboutCard title="Test" />)
      const paragraphs = screen.queryAllByRole('paragraph')
      expect(paragraphs).toHaveLength(0)
    })

    it('renders items list when provided', () => {
      const items = ['Item 1', 'Item 2', 'Item 3']
      render(<AboutCard title="Test" items={items} />)
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('does not render items list when not provided', () => {
      const { container } = render(<AboutCard title="Test" />)
      const lists = container.querySelectorAll('ul')
      expect(lists).toHaveLength(0)
    })

    it('does not render items list when empty array provided', () => {
      const { container } = render(<AboutCard title="Test" items={[]} />)
      const lists = container.querySelectorAll('ul')
      expect(lists).toHaveLength(0)
    })

    it('renders bullet points for each item', () => {
      const items = ['Item 1', 'Item 2']
      const { container } = render(<AboutCard title="Test" items={items} />)
      const bullets = container.querySelectorAll('.bg-primary')
      expect(bullets.length).toBeGreaterThanOrEqual(2)
    })

    it('applies custom className', () => {
      const { container } = render(<AboutCard title="Test" className="custom-class" />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('has hover effects (transition classes)', () => {
      const { container } = render(<AboutCard title="Test" />)
      const card = container.querySelector('.hover\\:border-accent')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Timeline Variant', () => {
    it('renders with timeline variant', () => {
      render(<AboutCard title="University" variant="timeline" />)
      expect(screen.getByText('University')).toBeInTheDocument()
    })

    it('renders subtitle in timeline variant', () => {
      render(<AboutCard title="University" subtitle="Bachelor of Science" variant="timeline" />)
      expect(screen.getByText('Bachelor of Science')).toBeInTheDocument()
    })

    it('does not render subtitle when not provided', () => {
      render(<AboutCard title="University" variant="timeline" />)
      expect(screen.queryByText('Bachelor of Science')).not.toBeInTheDocument()
    })

    it('renders date in timeline variant', () => {
      render(<AboutCard title="University" date="2020 - 2024" variant="timeline" />)
      expect(screen.getByText('2020 - 2024')).toBeInTheDocument()
    })

    it('does not render date when not provided', () => {
      render(<AboutCard title="University" variant="timeline" />)
      expect(screen.queryByText('2020 - 2024')).not.toBeInTheDocument()
    })

    it('renders description in timeline variant', () => {
      render(
        <AboutCard
          title="University"
          description="A great education"
          variant="timeline"
        />
      )
      expect(screen.getByText('A great education')).toBeInTheDocument()
    })

    it('renders tags as badges in timeline variant', () => {
      const tags = ['Computer Science', 'Engineering']
      render(<AboutCard title="University" tags={tags} variant="timeline" />)
      expect(screen.getByText('Computer Science')).toBeInTheDocument()
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })

    it('does not render tags when not provided', () => {
      render(<AboutCard title="University" variant="timeline" />)
      expect(screen.queryByText('Computer Science')).not.toBeInTheDocument()
    })

    it('does not render tags when empty array provided', () => {
      render(<AboutCard title="University" tags={[]} variant="timeline" />)
      const badges = screen.queryAllByRole('status')
      expect(badges).toHaveLength(0)
    })

    it('renders achievements list in timeline variant', () => {
      const achievements = ["Dean's List", 'Research Award']
      render(<AboutCard title="University" achievements={achievements} variant="timeline" />)
      expect(screen.getByText("Dean's List")).toBeInTheDocument()
      expect(screen.getByText('Research Award')).toBeInTheDocument()
    })

    it('does not render achievements when not provided', () => {
      render(<AboutCard title="University" variant="timeline" />)
      expect(screen.queryByText("Dean's List")).not.toBeInTheDocument()
    })

    it('does not render achievements when empty array provided', () => {
      const { container } = render(<AboutCard title="University" achievements={[]} variant="timeline" />)
      const lists = container.querySelectorAll('ul')
      expect(lists).toHaveLength(0)
    })

    it('renders bullet points for each achievement', () => {
      const achievements = ['Achievement 1', 'Achievement 2']
      const { container } = render(
        <AboutCard title="Test" achievements={achievements} variant="timeline" />
      )
      const bullets = container.querySelectorAll('.bg-primary')
      expect(bullets.length).toBeGreaterThanOrEqual(2)
    })

    it('does not render icon in timeline variant', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>
      render(<AboutCard title="Test" icon={<TestIcon />} variant="timeline" />)
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })

    it('applies different styles than default variant', () => {
      const { container: defaultContainer } = render(<AboutCard title="Default" />)
      const { container: timelineContainer } = render(
        <AboutCard title="Timeline" variant="timeline" />
      )

      const defaultTitle = defaultContainer.querySelector('h3')
      const timelineTitle = timelineContainer.querySelector('h3')

      expect(defaultTitle).toHaveClass('mb-2')
      expect(timelineTitle).toHaveClass('mb-1')
    })
  })

  describe('Heading Levels', () => {
    it('renders h3 by default', () => {
      render(<AboutCard title="Test Title" />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders h2 when headingLevel is 2', () => {
      render(<AboutCard title="Test Title" headingLevel={2} />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders h4 when headingLevel is 4', () => {
      render(<AboutCard title="Test Title" headingLevel={4} />)
      const heading = screen.getByRole('heading', { level: 4 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders h5 when headingLevel is 5', () => {
      render(<AboutCard title="Test Title" headingLevel={5} />)
      const heading = screen.getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders h6 when headingLevel is 6', () => {
      render(<AboutCard title="Test Title" headingLevel={6} />)
      const heading = screen.getByRole('heading', { level: 6 })
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders div when headingLevel is "div"', () => {
      const { container } = render(<AboutCard title="Test Title" headingLevel="div" />)
      const divHeading = container.querySelector('div[class*="font-semibold"]')
      expect(divHeading).toHaveTextContent('Test Title')
    })

    it('applies correct heading class based on variant', () => {
      const { container } = render(<AboutCard title="Default" />)
      const defaultHeading = container.querySelector('h3')
      expect(defaultHeading).toHaveClass('text-lg')

      const { container: timelineContainer } = render(
        <AboutCard title="Timeline" variant="timeline" />
      )
      const timelineHeading = timelineContainer.querySelector('h3')
      expect(timelineHeading).toHaveClass('text-xl')
    })
  })

  describe('Edge Cases', () => {
    it('renders with all props combined', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>
      render(
        <AboutCard
          icon={<TestIcon />}
          title="Complete Test"
          description="Full description"
          items={['Item 1', 'Item 2']}
          className="custom-class"
          headingLevel={2}
        />
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('Complete Test')).toBeInTheDocument()
      expect(screen.getByText('Full description')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('renders timeline variant with all props', () => {
      render(
        <AboutCard
          title="Complete Timeline"
          subtitle="Subtitle"
          date="2020 - 2024"
          description="Description"
          tags={['Tag1', 'Tag2']}
          achievements={['Achievement 1']}
          variant="timeline"
          className="custom-class"
          headingLevel={2}
        />
      )
      expect(screen.getByText('Complete Timeline')).toBeInTheDocument()
      expect(screen.getByText('Subtitle')).toBeInTheDocument()
      expect(screen.getByText('2020 - 2024')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Tag1')).toBeInTheDocument()
      expect(screen.getByText('Achievement 1')).toBeInTheDocument()
    })

    it('handles empty string title', () => {
      render(<AboutCard title="" />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeEmptyDOMElement()
    })

    it('handles very long titles', () => {
      const longTitle = 'A'.repeat(200)
      render(<AboutCard title={longTitle} />)
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('handles single item in items array', () => {
      render(<AboutCard title="Test" items={['Single Item']} />)
      expect(screen.getByText('Single Item')).toBeInTheDocument()
    })

    it('handles single tag in tags array', () => {
      render(<AboutCard title="Test" tags={['Single Tag']} variant="timeline" />)
      expect(screen.getByText('Single Tag')).toBeInTheDocument()
    })

    it('handles single achievement in achievements array', () => {
      render(
        <AboutCard title="Test" achievements={['Single Achievement']} variant="timeline" />
      )
      expect(screen.getByText('Single Achievement')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic heading elements', () => {
      render(<AboutCard title="Test" />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('uses semantic list elements for items', () => {
      render(<AboutCard title="Test" items={['Item 1']} />)
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('uses semantic list elements for achievements', () => {
      render(<AboutCard title="Test" achievements={['Achievement 1']} variant="timeline" />)
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('maintains proper heading hierarchy', () => {
      render(
        <>
          <AboutCard title="First" headingLevel={2} />
          <AboutCard title="Second" headingLevel={3} />
        </>
      )
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('has transition classes for animations', () => {
      const { container } = render(<AboutCard title="Test" />)
      const card = container.querySelector('.transition-all')
      expect(card).toBeInTheDocument()
    })

    it('has hover classes', () => {
      const { container } = render(<AboutCard title="Test" />)
      const card = container.querySelector('.hover\\:border-accent')
      expect(card).toBeInTheDocument()
    })

    it('applies padding classes', () => {
      const { container } = render(<AboutCard title="Test" />)
      const card = container.querySelector('.p-6')
      expect(card).toBeInTheDocument()
    })
  })
})
