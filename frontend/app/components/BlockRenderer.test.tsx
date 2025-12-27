import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlockRenderer from './BlockRenderer'

// Mock all the block components
vi.mock('@/app/components/Cta', () => ({
  default: ({ block }: { block: { _type: string } }) => (
    <div data-testid="cta-component">CTA: {block._type}</div>
  ),
}))

vi.mock('@/app/components/HeroSlider', () => ({
  default: ({ block }: { block: { _type: string } }) => (
    <div data-testid="hero-slider-component">HeroSlider: {block._type}</div>
  ),
}))

vi.mock('@/app/components/ImageGallery', () => ({
  default: ({ block }: { block: { _type: string } }) => (
    <div data-testid="image-gallery-component">ImageGallery: {block._type}</div>
  ),
}))

vi.mock('@/app/components/InfoSection', () => ({
  default: ({ block }: { block: { _type: string } }) => (
    <div data-testid="info-section-component">InfoSection: {block._type}</div>
  ),
}))

vi.mock('@/app/components/TextPicture', () => ({
  default: ({ block }: { block: { _type: string } }) => (
    <div data-testid="text-picture-component">TextPicture: {block._type}</div>
  ),
}))

vi.mock('@/sanity/lib/utils', () => ({
  dataAttr: vi.fn(() => ({
    toString: () => 'mocked-data-attr',
  })),
}))

describe('BlockRenderer Component', () => {
  const baseProps = {
    index: 0,
    pageId: 'page-123',
    pageType: 'page',
  }

  it('renders callToAction block', () => {
    const block = {
      _type: 'callToAction',
      _key: 'cta-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('cta-component')).toBeInTheDocument()
    expect(screen.getByText('CTA: callToAction')).toBeInTheDocument()
  })

  it('renders heroSlider block', () => {
    const block = {
      _type: 'heroSlider',
      _key: 'hero-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('hero-slider-component')).toBeInTheDocument()
    expect(screen.getByText('HeroSlider: heroSlider')).toBeInTheDocument()
  })

  it('renders imageGallery block', () => {
    const block = {
      _type: 'imageGallery',
      _key: 'gallery-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('image-gallery-component')).toBeInTheDocument()
    expect(screen.getByText('ImageGallery: imageGallery')).toBeInTheDocument()
  })

  it('renders infoSection block', () => {
    const block = {
      _type: 'infoSection',
      _key: 'info-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('info-section-component')).toBeInTheDocument()
    expect(screen.getByText('InfoSection: infoSection')).toBeInTheDocument()
  })

  it('renders textPicture block', () => {
    const block = {
      _type: 'textPicture',
      _key: 'text-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('text-picture-component')).toBeInTheDocument()
    expect(screen.getByText('TextPicture: textPicture')).toBeInTheDocument()
  })

  it('renders placeholder for unknown block type', () => {
    const block = {
      _type: 'unknownBlock',
      _key: 'unknown-1',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByText(/block hasn't been created/)).toBeInTheDocument()
    expect(screen.getByText(/unknownBlock/)).toBeInTheDocument()
  })

  it('applies correct styling to unknown block placeholder', () => {
    const block = {
      _type: 'unknownBlock',
      _key: 'unknown-1',
    }
    const { container } = render(<BlockRenderer block={block} {...baseProps} />)
    const placeholder = container.querySelector('.bg-gray-100')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveClass('text-center', 'text-gray-500', 'p-20', 'rounded')
  })

  it('renders with correct data-sanity attribute', () => {
    const block = {
      _type: 'callToAction',
      _key: 'cta-1',
    }
    const { container } = render(<BlockRenderer block={block} {...baseProps} />)
    const wrapper = container.querySelector('[data-sanity]')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('data-sanity', 'mocked-data-attr')
  })

  it('passes correct props to block component', () => {
    const block = {
      _type: 'callToAction',
      _key: 'cta-1',
      heading: 'Test Heading',
    }
    render(<BlockRenderer block={block} {...baseProps} />)
    expect(screen.getByTestId('cta-component')).toBeInTheDocument()
  })
})
