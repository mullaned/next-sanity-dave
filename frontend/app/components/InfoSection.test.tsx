import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import InfoSection from './InfoSection'

// Mock PortableText component
vi.mock('@/app/components/PortableText', () => ({
  default: ({ value }: { value: unknown }) => (
    <div data-testid="portable-text">{JSON.stringify(value)}</div>
  ),
}))

describe('InfoSection Component', () => {
  const mockContent = [
    {
      _type: 'block' as const,
      _key: 'block1',
      children: [{ _type: 'span' as const, text: 'Test content', _key: 'span1' }],
    },
  ]

  const mockBlock = {
    _type: 'infoSection' as const,
    heading: 'About Us',
    subheading: 'Our Story',
    content: mockContent,
  }

  it('renders heading when provided', () => {
    render(<InfoSection block={mockBlock} index={0} />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('renders subheading when provided', () => {
    render(<InfoSection block={mockBlock} index={0} />)
    expect(screen.getByText('Our Story')).toBeInTheDocument()
  })

  it('renders PortableText content when provided', () => {
    render(<InfoSection block={mockBlock} index={0} />)
    expect(screen.getByTestId('portable-text')).toBeInTheDocument()
  })

  it('does not render heading when not provided', () => {
    const blockWithoutHeading = {
      ...mockBlock,
      heading: undefined,
    }
    render(<InfoSection block={blockWithoutHeading} index={0} />)
    expect(screen.queryByText('About Us')).not.toBeInTheDocument()
  })

  it('does not render subheading when not provided', () => {
    const blockWithoutSubheading = {
      ...mockBlock,
      subheading: undefined,
    }
    render(<InfoSection block={blockWithoutSubheading} index={0} />)
    expect(screen.queryByText('Our Story')).not.toBeInTheDocument()
  })

  it('does not render PortableText when content is empty', () => {
    const blockWithoutContent = {
      ...mockBlock,
      content: [],
    }
    render(<InfoSection block={blockWithoutContent} index={0} />)
    expect(screen.queryByTestId('portable-text')).not.toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<InfoSection block={mockBlock} index={0} />)
    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('.max-w-3xl')).toBeInTheDocument()
  })

  it('heading has correct font size classes', () => {
    render(<InfoSection block={mockBlock} index={0} />)
    const heading = screen.getByText('About Us')
    expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl', 'font-bold')
  })

  it('subheading has correct styling classes', () => {
    render(<InfoSection block={mockBlock} index={0} />)
    const subheading = screen.getByText('Our Story')
    expect(subheading).toHaveClass('uppercase', 'font-light', 'text-gray-900/70')
  })
})
