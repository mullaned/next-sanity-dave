import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { HeroSlider } from '@/sanity.types'
import HeroSliderComponent from './HeroSlider'

// Mock the urlForImage function to avoid Sanity client issues in tests
vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: vi.fn(() => ({
    url: () => '/test-image.jpg',
  })),
  dataAttr: vi.fn(),
  linkResolver: vi.fn(() => '/test-link'),
}))

// Mock ResolvedLink component
vi.mock('@/app/components/ResolvedLink', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <a data-testid="resolved-link" href="/test-link">
      {children}
    </a>
  ),
}))

describe('HeroSliderComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const createMockBlock = (overrides?: Partial<HeroSlider>): HeroSlider => ({
    _type: 'heroSlider',
    slides: [
      {
        _key: 'slide1',
        _type: 'slide',
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-abc123-512x512-jpg',
            _type: 'reference',
          },
          alt: 'Test slide 1',
        },
      },
      {
        _key: 'slide2',
        _type: 'slide',
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-def456-512x512-jpg',
            _type: 'reference',
          },
          alt: 'Test slide 2',
        },
      },
    ],
    heading: 'Test Hero Heading',
    subheading: 'Test Hero Subheading',
    buttonText: 'Click Here',
    buttonLink: {
      _type: 'link',
      linkType: 'href',
      href: 'https://example.com',
    },
    autoplay: true,
    autoplayInterval: 5,
    showDots: true,
    showArrows: true,
    height: 'large',
    ...overrides,
  })

  describe('Rendering', () => {
    it('renders the hero slider with heading and subheading', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Test Hero Heading')).toBeTruthy()
      expect(screen.getByText('Test Hero Subheading')).toBeTruthy()
    })

    it('renders the button with correct text', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Click Here')).toBeTruthy()
      expect(screen.getByTestId('resolved-link')).toBeTruthy()
    })

    it('renders all slides with correct alt text', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByAltText('Test slide 1')).toBeTruthy()
      expect(screen.getByAltText('Test slide 2')).toBeTruthy()
    })

    it('renders slide counter for screen readers', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      const counter = screen.getByText('Slide 1 of 2')
      expect(counter).toBeTruthy()
      expect(counter.tagName).toBe('OUTPUT')
    })

    it('does not render navigation controls for single slide', () => {
      const mockBlock = createMockBlock({
        slides: [
          {
            _key: 'slide1',
            _type: 'slide',
            image: {
              _type: 'image',
              asset: {
                _ref: 'image-abc123-512x512-jpg',
                _type: 'reference',
              },
              alt: 'Single slide',
            },
          },
        ],
      })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.queryByLabelText('Previous slide')).toBeFalsy()
      expect(screen.queryByLabelText('Next slide')).toBeFalsy()
      expect(screen.queryByLabelText('Go to slide 1')).toBeFalsy()
    })

    it('does not render content when no heading, subheading, or button', () => {
      const mockBlock = createMockBlock({
        heading: undefined,
        subheading: undefined,
        buttonText: undefined,
        buttonLink: undefined,
      })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.querySelector('h1')).toBeFalsy()
      expect(container.querySelector('p')).toBeFalsy()
      expect(screen.queryByTestId('resolved-link')).toBeFalsy()
    })

    it('returns null when no slides provided', () => {
      const mockBlock = createMockBlock({ slides: [] })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toBeFalsy()
    })
  })

  describe('Navigation Controls', () => {
    it('renders navigation arrows when showArrows is true', () => {
      const mockBlock = createMockBlock({ showArrows: true })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByLabelText('Previous slide')).toBeTruthy()
      expect(screen.getByLabelText('Next slide')).toBeTruthy()
    })

    it('does not render navigation arrows when showArrows is false', () => {
      const mockBlock = createMockBlock({ showArrows: false })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.queryByLabelText('Previous slide')).toBeFalsy()
      expect(screen.queryByLabelText('Next slide')).toBeFalsy()
    })

    it('renders navigation dots when showDots is true', () => {
      const mockBlock = createMockBlock({ showDots: true })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByLabelText('Go to slide 1')).toBeTruthy()
      expect(screen.getByLabelText('Go to slide 2')).toBeTruthy()
    })

    it('does not render navigation dots when showDots is false', () => {
      const mockBlock = createMockBlock({ showDots: false })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.queryByLabelText('Go to slide 1')).toBeFalsy()
      expect(screen.queryByLabelText('Go to slide 2')).toBeFalsy()
    })

    it('navigates to next slide when next button is clicked', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      const nextButton = screen.getByLabelText('Next slide')
      fireEvent.click(nextButton)

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it('navigates to previous slide when prev button is clicked', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      const prevButton = screen.getByLabelText('Previous slide')
      fireEvent.click(prevButton)

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it.skip('wraps to first slide when clicking next on last slide', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      const nextButton = screen.getByLabelText('Next slide')
      fireEvent.click(nextButton) // Go to slide 2
      vi.advanceTimersByTime(500) // Wait for animation
      fireEvent.click(nextButton) // Wrap to slide 1
      vi.advanceTimersByTime(500) // Wait for animation

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()
    })

    it('wraps to last slide when clicking prev on first slide', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      const prevButton = screen.getByLabelText('Previous slide')
      fireEvent.click(prevButton) // Wrap to slide 2

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it('navigates to specific slide when dot is clicked', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      const dot2 = screen.getByLabelText('Go to slide 2')
      fireEvent.click(dot2)

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates to next slide on ArrowRight key', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      fireEvent.keyDown(document, { key: 'ArrowRight' })

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it('navigates to previous slide on ArrowLeft key', () => {
      const mockBlock = createMockBlock()
      render(<HeroSliderComponent block={mockBlock} />)

      fireEvent.keyDown(document, { key: 'ArrowLeft' })

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it('does not respond to keyboard navigation with single slide', () => {
      const mockBlock = createMockBlock({
        slides: [
          {
            _key: 'slide1',
            _type: 'slide',
            image: {
              _type: 'image',
              asset: {
                _ref: 'image-abc123-512x512-jpg',
                _type: 'reference',
              },
              alt: 'Single slide',
            },
          },
        ],
      })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 1')).toBeTruthy()

      fireEvent.keyDown(document, { key: 'ArrowRight' })

      expect(screen.getByText('Slide 1 of 1')).toBeTruthy()
    })
  })

  describe('Autoplay', () => {
    it.skip('automatically advances to next slide after interval', () => {
      const mockBlock = createMockBlock({ autoplay: true, autoplayInterval: 5 })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      vi.advanceTimersByTime(5500) // Advance past interval + animation time

      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })

    it('does not autoplay when autoplay is false', () => {
      const mockBlock = createMockBlock({ autoplay: false })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      vi.advanceTimersByTime(10000)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()
    })

    it('does not autoplay with single slide', () => {
      const mockBlock = createMockBlock({
        autoplay: true,
        slides: [
          {
            _key: 'slide1',
            _type: 'slide',
            image: {
              _type: 'image',
              asset: {
                _ref: 'image-abc123-512x512-jpg',
                _type: 'reference',
              },
              alt: 'Single slide',
            },
          },
        ],
      })
      render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 1')).toBeTruthy()

      vi.advanceTimersByTime(10000)

      expect(screen.getByText('Slide 1 of 1')).toBeTruthy()
    })

    it('pauses autoplay on mouse enter', () => {
      const mockBlock = createMockBlock({ autoplay: true, autoplayInterval: 5 })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      // Hover over the hero slider
      const slider = container.firstChild as Element
      fireEvent.mouseEnter(slider)

      vi.advanceTimersByTime(5000)

      // Should still be on slide 1 because autoplay is paused
      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()
    })

    it.skip('resumes autoplay on mouse leave', () => {
      const mockBlock = createMockBlock({ autoplay: true, autoplayInterval: 5 })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      // Hover over the hero slider
      const slider = container.firstChild as Element
      fireEvent.mouseEnter(slider)

      vi.advanceTimersByTime(5000)
      expect(screen.getByText('Slide 1 of 2')).toBeTruthy()

      // Mouse leave should resume autoplay
      fireEvent.mouseLeave(slider)

      vi.advanceTimersByTime(5500) // Advance past interval + animation time

      // Now it should advance to slide 2
      expect(screen.getByText('Slide 2 of 2')).toBeTruthy()
    })
  })

  describe('Height Classes', () => {
    it('applies small height class', () => {
      const mockBlock = createMockBlock({ height: 'small' })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toHaveClass('h-[400px]')
    })

    it('applies medium height class', () => {
      const mockBlock = createMockBlock({ height: 'medium' })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toHaveClass('h-[600px]')
    })

    it('applies large height class', () => {
      const mockBlock = createMockBlock({ height: 'large' })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toHaveClass('h-[800px]')
    })

    it('applies full screen height class', () => {
      const mockBlock = createMockBlock({ height: 'full' })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toHaveClass('h-screen')
    })

    it('defaults to large height when not specified', () => {
      const mockBlock = createMockBlock({ height: undefined })
      const { container } = render(<HeroSliderComponent block={mockBlock} />)

      expect(container.firstChild).toHaveClass('h-[800px]')
    })
  })
})
