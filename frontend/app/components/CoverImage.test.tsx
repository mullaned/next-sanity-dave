import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CoverImage from './CoverImage'

// Mock urlForImage utility
vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: vi.fn(() => ({
    url: vi.fn().mockReturnValue('/mock-image-url.jpg'),
  })),
}))

// Mock getImageDimensions from @sanity/asset-utils
vi.mock('@sanity/asset-utils', () => ({
  getImageDimensions: vi.fn(() => ({
    width: 1920,
    height: 1080,
    aspectRatio: 16 / 9,
  })),
}))

describe('CoverImage Component', () => {
  const mockImage = {
    asset: {
      _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
      _type: 'reference' as const,
    },
    alt: 'Test cover image',
    _type: 'image' as const,
  }

  it('renders image with correct alt text', () => {
    render(<CoverImage image={mockImage} />)
    const image = screen.getByAltText('Test cover image')
    expect(image).toBeInTheDocument()
  })

  it('renders image with priority prop', () => {
    render(<CoverImage image={mockImage} priority />)
    const image = screen.getByAltText('Test cover image')
    expect(image).toBeInTheDocument()
  })

  it('renders nothing when image asset is missing', () => {
    const imageWithoutAsset = {
      ...mockImage,
      asset: undefined,
    }
    const { container } = render(<CoverImage image={imageWithoutAsset} />)
    const image = container.querySelector('img')
    expect(image).not.toBeInTheDocument()
  })

  it('renders fallback alt text when alt text is missing', () => {
    const imageWithoutAlt = {
      ...mockImage,
      alt: undefined,
    }
    render(<CoverImage image={imageWithoutAlt} />)
    const image = screen.getByAltText('Cover image')
    expect(image).toBeInTheDocument()
  })

  it('renders wrapper div with relative class', () => {
    const { container } = render(<CoverImage image={mockImage} />)
    const wrapper = container.querySelector('.relative')
    expect(wrapper).toBeInTheDocument()
  })

  it('applies object-cover class to image', () => {
    render(<CoverImage image={mockImage} />)
    const image = screen.getByAltText('Test cover image')
    expect(image).toHaveClass('object-cover')
  })
})
