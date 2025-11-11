import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsInfo } from '../ResultsInfo'

describe('ResultsInfo', () => {
  it('displays current count and total count', () => {
    render(<ResultsInfo currentCount={5} totalCount={10} />)
    expect(screen.getByText('Showing 5 of 10 projects')).toBeInTheDocument()
  })

  it('uses default itemName of "projects"', () => {
    render(<ResultsInfo currentCount={3} totalCount={5} />)
    expect(screen.getByText('Showing 3 of 5 projects')).toBeInTheDocument()
  })

  it('uses custom itemName when provided', () => {
    render(<ResultsInfo currentCount={2} totalCount={4} itemName="articles" />)
    expect(screen.getByText('Showing 2 of 4 articles')).toBeInTheDocument()
  })

  it('shows "All displayed" message for screen readers when all items shown', () => {
    render(<ResultsInfo currentCount={10} totalCount={10} itemName="projects" />)
    expect(screen.getByText('All 10 projects displayed')).toHaveClass('sr-only')
  })

  it('shows "Filtered to" message for screen readers when filtered', () => {
    render(<ResultsInfo currentCount={5} totalCount={10} itemName="projects" />)
    expect(screen.getByText('Filtered to 5 of 10 projects')).toHaveClass('sr-only')
  })

  it('handles zero current count', () => {
    render(<ResultsInfo currentCount={0} totalCount={10} />)
    expect(screen.getByText('Showing 0 of 10 projects')).toBeInTheDocument()
  })

  it('handles single item', () => {
    render(<ResultsInfo currentCount={1} totalCount={1} itemName="project" />)
    expect(screen.getByText('Showing 1 of 1 project')).toBeInTheDocument()
    expect(screen.getByText('All 1 project displayed')).toHaveClass('sr-only')
  })

  it('has correct styling classes', () => {
    const { container } = render(<ResultsInfo currentCount={5} totalCount={10} />)
    const paragraph = screen.getByText(/Showing/)

    expect(paragraph).toHaveClass('text-sm')
    expect(paragraph).toHaveClass('text-muted-foreground')
    expect(container.firstChild).toHaveClass('mb-6')
  })
})
