import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Avatar from './Avatar'

// Mock urlForImage utility
vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: vi.fn(() => ({
    height: vi.fn().mockReturnThis(),
    width: vi.fn().mockReturnThis(),
    fit: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('/mock-image-url.jpg'),
  })),
}))

describe('Avatar Component', () => {
  const mockPerson = {
    firstName: 'John',
    lastName: 'Doe',
    picture: {
      asset: {
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
        _type: 'reference' as const,
      },
      alt: 'John Doe profile picture',
      _type: 'image' as const,
    },
  }

  it('renders person name correctly', () => {
    render(<Avatar person={mockPerson} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders without picture', () => {
    const personWithoutPicture = {
      firstName: 'Jane',
      lastName: 'Smith',
      picture: null,
    }
    render(<Avatar person={personWithoutPicture} />)
    expect(screen.getByText('By')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders with date', () => {
    const date = '2024-01-15T00:00:00.000Z'
    render(<Avatar person={mockPerson} date={date} />)
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
  })

  it('applies small size styling when small prop is true', () => {
    const { container } = render(<Avatar person={mockPerson} small />)
    const imageWrapper = container.querySelector('.h-6')
    expect(imageWrapper).toBeInTheDocument()
  })

  it('applies default size styling when small prop is false', () => {
    const { container } = render(<Avatar person={mockPerson} small={false} />)
    const imageWrapper = container.querySelector('.h-9')
    expect(imageWrapper).toBeInTheDocument()
  })

  it('renders image with correct alt text', () => {
    render(<Avatar person={mockPerson} />)
    const image = screen.getByAltText('John Doe profile picture')
    expect(image).toBeInTheDocument()
  })

  it('does not render name when firstName or lastName is missing', () => {
    const personWithoutName = {
      firstName: null,
      lastName: null,
      picture: null,
    }
    const { container } = render(<Avatar person={personWithoutName} />)
    expect(container.querySelector('.font-bold')).not.toBeInTheDocument()
  })
})
