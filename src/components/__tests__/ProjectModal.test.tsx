import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectModal } from '@/components/ui/organisms/ProjectModal'

/**
 * Test suite for ProjectModal component
 * Validates modal behavior, accessibility, image carousel, and user interactions
 */

const mockProject = {
  _id: '1',
  title: 'Test Project',
  category: 'Digital Electronics',
  date: '2025-05-01',
  featured: true,
  image: 'https://example.com/image1.jpg',
  images: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
  description: 'Test project description',
  longDescription: 'Long description here',
  overview: 'Project overview',
  technologies: ['React', 'TypeScript', 'Vitest'],
  challenges: ['Challenge 1', 'Challenge 2'],
  outcomes: ['Outcome 1', 'Outcome 2'],
  tags: ['tag1', 'tag2'],
  pdf: '/pdfs/test.pdf',
  demo: 'https://demo.example.com',
}

describe('ProjectModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when project is null', () => {
    const { container } = render(
      <ProjectModal project={null} isOpen={false} onClose={mockOnClose} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal when project is provided and isOpen is true', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Test Project')).toBeTruthy()
    expect(screen.getByText('Digital Electronics')).toBeTruthy()
    expect(screen.getByText('Test project description')).toBeTruthy()
  })

  it('applies correct visibility classes based on isOpen prop', () => {
    const { container, rerender } = render(
      <ProjectModal project={mockProject} isOpen={false} onClose={mockOnClose} />
    )

    let backdrop = container.querySelector('[role="dialog"]')
    expect(backdrop?.className).toContain('invisible')
    expect(backdrop?.className).toContain('opacity-0')

    rerender(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    backdrop = container.querySelector('[role="dialog"]')
    expect(backdrop?.className).toContain('visible')
    expect(backdrop?.className).toContain('opacity-100')
  })

  it('has correct z-index to appear above header', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const backdrop = container.querySelector('[role="dialog"]')
    expect(backdrop?.className).toContain('z-[1040]')
  })

  it('displays project title, category, and date', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Test Project')).toBeTruthy()
    expect(screen.getByText('Digital Electronics')).toBeTruthy()
    expect(screen.getByText(/April 30, 2025|May 1, 2025/)).toBeTruthy()
  })

  it('renders all images in carousel (primary + additional)', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const images = container.querySelectorAll('img[alt*="Test Project"]')
    // Should show primary image + 2 additional images = 3 total
    expect(images.length).toBe(3)
  })

  it('shows navigation arrows when there are multiple images', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    const prevButton = screen.getByLabelText('Previous image')
    const nextButton = screen.getByLabelText('Next image')

    expect(prevButton).toBeTruthy()
    expect(nextButton).toBeTruthy()
  })

  it('hides navigation arrows when there is only one image', () => {
    const singleImageProject = {
      ...mockProject,
      images: [],
    }

    render(<ProjectModal project={singleImageProject} isOpen={true} onClose={mockOnClose} />)

    expect(screen.queryByLabelText('Previous image')).toBeNull()
    expect(screen.queryByLabelText('Next image')).toBeNull()
  })

  it('navigates through images with next button', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const nextButton = screen.getByLabelText('Next image')

    // First image should be visible
    let images = container.querySelectorAll('img[alt*="Test Project"]')
    expect(images[0].className).toContain('opacity-100')
    expect(images[1].className).toContain('opacity-0')

    // Click next
    fireEvent.click(nextButton)

    // Second image should be visible
    images = container.querySelectorAll('img[alt*="Test Project"]')
    expect(images[0].className).toContain('opacity-0')
    expect(images[1].className).toContain('opacity-100')
  })

  it('displays dot indicators for image position', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    // Should have 3 dots (3 images total)
    const dots = container.querySelectorAll('button[aria-label*="View image"]')
    expect(dots.length).toBe(3)
  })

  it('renders technologies section with badges', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Technologies Used')).toBeTruthy()
    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByText('TypeScript')).toBeTruthy()
    expect(screen.getByText('Vitest')).toBeTruthy()
  })

  it('renders challenges and outcomes sections', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Challenges & Solutions')).toBeTruthy()
    expect(screen.getByText('Challenge 1')).toBeTruthy()

    expect(screen.getByText('Outcomes & Impact')).toBeTruthy()
    expect(screen.getByText('Outcome 1')).toBeTruthy()
  })

  it('renders PDF and demo buttons when provided', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    const pdfButton = screen.getByText('View PDF')
    const demoButton = screen.getByText('Live Demo')

    expect(pdfButton).toBeTruthy()
    expect(demoButton).toBeTruthy()
    expect(pdfButton.closest('a')?.getAttribute('href')).toBe('/pdfs/test.pdf')
    expect(demoButton.closest('a')?.getAttribute('href')).toBe('https://demo.example.com')
  })

  it('calls onClose when close button is clicked', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking backdrop', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const backdrop = container.querySelector('[role="dialog"]')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('does not close when clicking modal content', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const modalContent = container.querySelector('.rounded-2xl')
    if (modalContent) {
      fireEvent.click(modalContent)
      expect(mockOnClose).not.toHaveBeenCalled()
    }
  })

  it('has proper ARIA attributes for accessibility', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('aria-labelledby')).toBe('modal-title')

    const title = screen.getByText('Test Project')
    expect(title.id).toBe('modal-title')
  })

  it('uses object-contain for images to ensure proper centering', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    const images = container.querySelectorAll('img[alt*="Test Project"]')
    images.forEach(img => {
      expect(img.className).toContain('object-contain')
    })
  })

  it('removes duplicate images from carousel', () => {
    const projectWithDuplicates = {
      ...mockProject,
      image: 'https://example.com/image1.jpg',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    }

    const { container } = render(
      <ProjectModal project={projectWithDuplicates} isOpen={true} onClose={mockOnClose} />
    )

    const images = container.querySelectorAll('img[alt*="Test Project"]')
    // Should only show 2 unique images (duplicate removed)
    expect(images.length).toBe(2)
  })

  it('resets image index when project changes', async () => {
    const { container, rerender } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    )

    // Navigate to second image
    const nextButton = screen.getByLabelText('Next image')
    fireEvent.click(nextButton)

    // Change project
    const newProject = { ...mockProject, _id: '2', title: 'New Project' }
    rerender(<ProjectModal project={newProject} isOpen={true} onClose={mockOnClose} />)

    await waitFor(() => {
      // Should reset to first image
      const images = container.querySelectorAll('img[alt*="New Project"]')
      expect(images[0].className).toContain('opacity-100')
    })
  })

  it('displays formatted date correctly', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />)

    // Should format as "Month Day, Year" - Date constructor may create different dates depending on timezone
    expect(screen.getByText(/April 30, 2025|May 1, 2025/)).toBeTruthy()
  })
})
