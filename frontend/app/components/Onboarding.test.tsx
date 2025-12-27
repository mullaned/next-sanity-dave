import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Onboarding, { PageOnboarding } from './Onboarding'

const mockUseIsPresentationTool = vi.fn(() => false)

// Mock next-sanity
vi.mock('next-sanity', () => ({
  createDataAttribute: vi.fn(() => ({
    toString: () => 'data-sanity-mock',
  })),
}))

// Mock next-sanity hooks
vi.mock('next-sanity/hooks', () => ({
  useIsPresentationTool: () => mockUseIsPresentationTool(),
}))

// Mock sanity/lib/api
vi.mock('@/sanity/lib/api', () => ({
  studioUrl: 'https://studio.example.com',
}))

// Mock uuid
vi.mock('@sanity/uuid', () => ({
  uuid: vi.fn(() => 'mock-uuid-12345'),
}))

describe('Onboarding Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsPresentationTool.mockReturnValue(false)
  })

  it('renders without crashing', () => {
    render(<Onboarding />)
    expect(screen.getByText('No posts yet')).toBeInTheDocument()
  })

  it('displays the correct title and description', () => {
    render(<Onboarding />)
    expect(screen.getByText('No posts yet')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating a new post.')).toBeInTheDocument()
  })

  it('renders the Sanity logo SVG', () => {
    const { container } = render(<Onboarding />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('mx-auto')
  })

  it('renders "Create Post" link with correct href', () => {
    render(<Onboarding />)
    const link = screen.getByRole('link', { name: /Create Post/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://studio.example.com/structure/intent/create/template=post;type=post;path=title',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders link with icon', () => {
    render(<Onboarding />)
    const link = screen.getByRole('link', { name: /Create Post/i })
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<Onboarding />)
    const mainDiv = container.querySelector('.bg-brand')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('rounded-lg', 'p-8', 'text-white')
  })

  describe('when in presentation tool', () => {
    beforeEach(() => {
      mockUseIsPresentationTool.mockReturnValue(true)
    })

    it('renders button instead of link', () => {
      render(<Onboarding />)
      const button = screen.getByRole('button', { name: /Create Post/i })
      expect(button).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Create Post/i })).not.toBeInTheDocument()
    })

    it('button has data-sanity attribute', () => {
      render(<Onboarding />)
      const button = screen.getByRole('button', { name: /Create Post/i })
      expect(button).toHaveAttribute('data-sanity', 'data-sanity-mock')
    })

    it('button has correct styling', () => {
      render(<Onboarding />)
      const button = screen.getByRole('button', { name: /Create Post/i })
      expect(button).toHaveClass('bg-white', 'text-brand', 'hover:bg-blue')
    })
  })
})

describe('PageOnboarding Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsPresentationTool.mockReturnValue(false)
  })

  it('renders without crashing', () => {
    render(<PageOnboarding />)
    expect(screen.getByText('About Page (/about) does not exist yet')).toBeInTheDocument()
  })

  it('displays the correct title and description', () => {
    render(<PageOnboarding />)
    expect(screen.getByText('About Page (/about) does not exist yet')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating an about page.')).toBeInTheDocument()
  })

  it('renders the Sanity logo SVG', () => {
    const { container } = render(<PageOnboarding />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('mx-auto')
  })

  it('renders "Create Page" link with correct href', () => {
    render(<PageOnboarding />)
    const link = screen.getByRole('link', { name: /Create Page/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://studio.example.com/structure/intent/create/template=page;type=page;path=name',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders link with icon', () => {
    render(<PageOnboarding />)
    const link = screen.getByRole('link', { name: /Create Page/i })
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<PageOnboarding />)
    const mainDiv = container.querySelector('.bg-brand')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('rounded-lg', 'p-8', 'text-white')
  })

  describe('when in presentation tool', () => {
    beforeEach(() => {
      mockUseIsPresentationTool.mockReturnValue(true)
    })

    it('renders button instead of link', () => {
      render(<PageOnboarding />)
      const button = screen.getByRole('button', { name: /Create Page/i })
      expect(button).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Create Page/i })).not.toBeInTheDocument()
    })

    it('button has data-sanity attribute', () => {
      render(<PageOnboarding />)
      const button = screen.getByRole('button', { name: /Create Page/i })
      expect(button).toHaveAttribute('data-sanity', 'data-sanity-mock')
    })
  })
})
