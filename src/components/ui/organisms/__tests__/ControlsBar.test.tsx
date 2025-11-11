import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ControlsBar } from '../ControlsBar'

/**
 * Test suite for ControlsBar component
 * Validates container layout and child rendering
 */
describe('ControlsBar', () => {
  it('renders children correctly', () => {
    render(
      <ControlsBar>
        <div>Test Child 1</div>
        <div>Test Child 2</div>
      </ControlsBar>
    )

    expect(screen.getByText('Test Child 1')).toBeInTheDocument()
    expect(screen.getByText('Test Child 2')).toBeInTheDocument()
  })

  it('renders without children', () => {
    const { container } = render(<ControlsBar>{null}</ControlsBar>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has correct flex layout classes', () => {
    const { container } = render(<ControlsBar><div>Test</div></ControlsBar>)
    const controlsBar = container.firstChild as HTMLElement

    expect(controlsBar).toHaveClass('flex')
    expect(controlsBar).toHaveClass('flex-wrap')
    expect(controlsBar).toHaveClass('items-center')
  })

  it('has responsive mobile classes', () => {
    const { container } = render(<ControlsBar><div>Test</div></ControlsBar>)
    const controlsBar = container.firstChild as HTMLElement

    expect(controlsBar).toHaveClass('max-md:flex-col')
    expect(controlsBar).toHaveClass('max-md:items-stretch')
  })

  it('has correct spacing', () => {
    const { container } = render(<ControlsBar><div>Test</div></ControlsBar>)
    const controlsBar = container.firstChild as HTMLElement

    expect(controlsBar).toHaveClass('gap-4')
    expect(controlsBar).toHaveClass('mb-6')
  })

  it('renders multiple children in correct order', () => {
    render(
      <ControlsBar>
        <button>First</button>
        <input placeholder="Second" />
        <select><option>Third</option></select>
      </ControlsBar>
    )

    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })
})
