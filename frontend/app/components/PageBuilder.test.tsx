import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PageBuilder from './PageBuilder'

// Mock the BlockRenderer component
vi.mock('@/app/components/BlockRenderer', () => ({
  default: ({ block }: { block: { _type: string; _key: string } }) => (
    <div data-testid={`block-${block._type}`}>Block: {block._type}</div>
  ),
}))

let mockUseOptimistic: any
// Mock next-sanity hooks
vi.mock('next-sanity/hooks', () => ({
  useOptimistic: (...args: any[]) => mockUseOptimistic(...args),
}))

// Mock sanity utils
vi.mock('@/sanity/lib/utils', () => ({
  dataAttr: vi.fn(() => ({
    toString: () => 'mocked-data-attr',
  })),
}))

// Mock sanity api
vi.mock('@/sanity/lib/api', () => ({
  studioUrl: 'https://studio.example.com',
}))

describe('PageBuilder Component', () => {
  const mockPage: any = {
    _id: 'page-123',
    _type: 'page' as const,
    name: 'Test Page',
    title: 'Test Page',
    slug: { current: 'test-page', _type: 'slug' as const },
    heading: 'Test Heading',
    subheading: 'Test Subheading',
    coverImage: {
      asset: {
        _ref: 'image-123',
        _type: 'reference' as const,
      },
      _type: 'image' as const,
    },
    pageBuilder: [
      {
        _key: 'block-1',
        _type: 'heroSlider',
      },
      {
        _key: 'block-2',
        _type: 'textPicture',
      },
    ],
  }

  beforeEach(() => {
    // Default mock returns the initial value
    mockUseOptimistic = vi.fn((initial) => initial)
  })

  it('renders page builder sections when content exists', () => {
    render(<PageBuilder page={mockPage} />)

    expect(screen.getByTestId('block-heroSlider')).toBeInTheDocument()
    expect(screen.getByTestId('block-textPicture')).toBeInTheDocument()
  })

  it('renders multiple blocks in correct order', () => {
    render(<PageBuilder page={mockPage} />)

    const blocks = screen.getAllByTestId(/^block-/)
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toHaveTextContent('Block: heroSlider')
    expect(blocks[1]).toHaveTextContent('Block: textPicture')
  })

  it('renders empty state when no pageBuilder content exists', () => {
    const emptyPage = {
      ...mockPage,
      pageBuilder: [],
    }
    render(<PageBuilder page={emptyPage} />)

    expect(screen.getByText('This page has no content!')).toBeInTheDocument()
    expect(screen.getByText('Open the page in Sanity Studio to add content.')).toBeInTheDocument()
  })

  it('renders empty state when pageBuilder is undefined', () => {
    const emptyPage = {
      ...mockPage,
      pageBuilder: undefined,
    }
    render(<PageBuilder page={emptyPage} />)

    expect(screen.getByText('This page has no content!')).toBeInTheDocument()
  })

  it('renders link to Sanity Studio in empty state', () => {
    const emptyPage = {
      ...mockPage,
      pageBuilder: [],
    }
    render(<PageBuilder page={emptyPage} />)

    const studioLink = screen.getByRole('link', { name: 'Add content to this page' })
    expect(studioLink).toBeInTheDocument()
    expect(studioLink).toHaveAttribute('target', '_blank')
    expect(studioLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(studioLink.getAttribute('href')).toContain('https://studio.example.com')
    expect(studioLink.getAttribute('href')).toContain('page-123')
  })

  it('applies correct styling to empty state link', () => {
    const emptyPage = {
      ...mockPage,
      pageBuilder: [],
    }
    render(<PageBuilder page={emptyPage} />)

    const studioLink = screen.getByRole('link', { name: 'Add content to this page' })
    expect(studioLink).toHaveClass('rounded-full', 'bg-black')
  })

  it('renders data-sanity attribute on sections container', () => {
    const { container } = render(<PageBuilder page={mockPage} />)

    const sectionsContainer = container.querySelector('[data-sanity]')
    expect(sectionsContainer).toBeInTheDocument()
    expect(sectionsContainer).toHaveAttribute('data-sanity', 'mocked-data-attr')
  })

  it('renders single block correctly', () => {
    const singleBlockPage = {
      ...mockPage,
      pageBuilder: [
        {
          _key: 'block-1',
          _type: 'callToAction',
        },
      ],
    }
    render(<PageBuilder page={singleBlockPage} />)

    expect(screen.getByTestId('block-callToAction')).toBeInTheDocument()
    expect(screen.getAllByTestId(/^block-/)).toHaveLength(1)
  })

  it('renders with different block types', () => {
    const diversePage = {
      ...mockPage,
      pageBuilder: [
        { _key: 'b1', _type: 'heroSlider' },
        { _key: 'b2', _type: 'imageGallery' },
        { _key: 'b3', _type: 'infoSection' },
        { _key: 'b4', _type: 'callToAction' },
      ],
    }
    render(<PageBuilder page={diversePage} />)

    expect(screen.getByTestId('block-heroSlider')).toBeInTheDocument()
    expect(screen.getByTestId('block-imageGallery')).toBeInTheDocument()
    expect(screen.getByTestId('block-infoSection')).toBeInTheDocument()
    expect(screen.getByTestId('block-callToAction')).toBeInTheDocument()
  })

  it('handles null page gracefully', () => {
    const { container } = render(<PageBuilder page={null as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('handles useOptimistic with updated document data', () => {
    const reducerFn = vi.fn()
    mockUseOptimistic = vi.fn((initial, reducer) => {
      reducerFn.mockImplementation(reducer)
      return initial
    })

    render(<PageBuilder page={mockPage} />)

    // Get the reducer function
    expect(mockUseOptimistic).toHaveBeenCalled()
    const [_initial, reducer] = mockUseOptimistic.mock.calls[0]

    // Test reducer with matching document ID
    const currentSections = mockPage.pageBuilder
    const action = {
      id: 'page-123',
      document: {
        _id: 'page-123',
        _type: 'page',
        pageBuilder: [
          { _key: 'block-1', _type: 'heroSlider' },
          { _key: 'block-3', _type: 'newBlock' },
        ],
      },
    } as any

    const result = reducer(currentSections, action)
    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
  })

  it('useOptimistic ignores updates for different document IDs', () => {
    mockUseOptimistic = vi.fn((initial, _reducer) => {
      return initial
    })

    render(<PageBuilder page={mockPage} />)

    const [_initial, reducer] = mockUseOptimistic.mock.calls[0]

    const currentSections = mockPage.pageBuilder
    const action = {
      id: 'different-page-id',
      document: {
        _id: 'different-page-id',
        _type: 'page',
        pageBuilder: [{ _key: 'new-block', _type: 'newType' }],
      },
    } as any

    const result = reducer(currentSections, action)
    expect(result).toEqual(currentSections)
  })

  it('useOptimistic returns current sections when no pageBuilder in update', () => {
    mockUseOptimistic = vi.fn((initial, _reducer) => {
      return initial
    })

    render(<PageBuilder page={mockPage} />)

    const [_initial, reducer] = mockUseOptimistic.mock.calls[0]

    const currentSections = mockPage.pageBuilder
    const action = {
      id: 'page-123',
      document: {
        _id: 'page-123',
        _type: 'page',
        // No pageBuilder field
      },
    } as any

    const result = reducer(currentSections, action)
    expect(result).toEqual(currentSections)
  })
})
