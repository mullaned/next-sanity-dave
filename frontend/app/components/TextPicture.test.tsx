import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { TextPicture } from '@/sanity.types'
import TextPictureComponent from './TextPicture'

// Mock the urlForImage function to avoid Sanity client issues in tests
vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: vi.fn(() => ({
    url: () => '/test-image.jpg',
  })),
  dataAttr: vi.fn(),
  linkResolver: vi.fn(() => '/test-link'),
}))

describe('TextPictureComponent', () => {
  const mockBlock: TextPicture = {
    _type: 'textPicture',
    title: 'Test Title',
    description: 'Test Description',
    image: {
      _type: 'image',
      asset: {
        _ref: 'image-abc123def456ghi789jkl012-512x512-jpg',
        _type: 'reference',
      },
      alt: 'Test Alt Text',
    },
    buttonText: 'Click Me',
    buttonLink: {
      _type: 'link',
      linkType: 'page',
      page: {
        _type: 'reference',
        _ref: 'page-123',
      },
    },
    imagePosition: 'left',
    backgroundColor: 'primary',
  }

  it('renders the title', () => {
    render(<TextPictureComponent block={mockBlock} />)
    expect(screen.getByText('Test Title')).toBeTruthy()
  })

  it('renders the description', () => {
    render(<TextPictureComponent block={mockBlock} />)
    expect(screen.getByText('Test Description')).toBeTruthy()
  })

  it('renders the button text', () => {
    render(<TextPictureComponent block={mockBlock} />)
    expect(screen.getByText('Click Me')).toBeTruthy()
  })

  it('applies correct background color for primary', () => {
    const { container } = render(<TextPictureComponent block={mockBlock} />)
    const bgElement = container.querySelector('.bg-white')
    expect(bgElement).toBeTruthy()
  })

  it('applies correct background color for secondary', () => {
    const secondaryBlock = { ...mockBlock, backgroundColor: 'secondary' as const }
    const { container } = render(<TextPictureComponent block={secondaryBlock} />)
    const bgElement = container.querySelector('.bg-gray-50')
    expect(bgElement).toBeTruthy()
  })

  it('applies correct layout for left image position', () => {
    const { container } = render(<TextPictureComponent block={mockBlock} />)
    const layoutElement = container.querySelector(String.raw`.lg\:flex-row`)
    expect(layoutElement).toBeTruthy()
  })

  it('applies correct layout for right image position', () => {
    const rightBlock = { ...mockBlock, imagePosition: 'right' as const }
    const { container } = render(<TextPictureComponent block={rightBlock} />)
    const layoutElement = container.querySelector(String.raw`.lg\:flex-row-reverse`)
    expect(layoutElement).toBeTruthy()
  })
})
