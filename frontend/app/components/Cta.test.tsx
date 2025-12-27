import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Cta from './Cta'

// Mock ResolvedLink component
vi.mock('@/app/components/ResolvedLink', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <a href="https://example.com" className={className}>
      {children}
    </a>
  ),
}))

describe('Cta Component', () => {
  const mockBlock = {
    _type: 'callToAction' as const,
    heading: 'Get Started Today',
    text: 'Join thousands of satisfied customers',
    buttonText: 'Sign Up Now',
    link: {
      _type: 'link' as const,
      externalUrl: 'https://example.com/signup',
      openInNewTab: false,
    },
  }

  it('renders heading correctly', () => {
    render(<Cta block={mockBlock} index={0} />)
    expect(screen.getByText('Get Started Today')).toBeInTheDocument()
  })

  it('renders text content correctly', () => {
    render(<Cta block={mockBlock} index={0} />)
    expect(screen.getByText('Join thousands of satisfied customers')).toBeInTheDocument()
  })

  it('renders button with correct text', () => {
    render(<Cta block={mockBlock} index={0} />)
    expect(screen.getByText('Sign Up Now')).toBeInTheDocument()
  })

  it('renders button when link is provided', () => {
    render(<Cta block={mockBlock} index={0} />)
    const button = screen.getByText('Sign Up Now')
    expect(button).toBeInTheDocument()
    expect(button.closest('a')).toHaveClass('rounded-full')
  })

  it('does not render button when link is missing', () => {
    const blockWithoutLink = {
      ...mockBlock,
      link: undefined,
    }
    render(<Cta block={blockWithoutLink} index={0} />)
    expect(screen.queryByText('Sign Up Now')).not.toBeInTheDocument()
  })

  it('applies correct container styling', () => {
    const { container } = render(<Cta block={mockBlock} index={0} />)
    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('.bg-gray-50')).toBeInTheDocument()
    expect(container.querySelector('.rounded-2xl')).toBeInTheDocument()
  })

  it('renders with different content', () => {
    const differentBlock = {
      ...mockBlock,
      heading: 'Special Offer',
      text: 'Limited time only',
      buttonText: 'Learn More',
    }
    render(<Cta block={differentBlock} index={0} />)
    expect(screen.getByText('Special Offer')).toBeInTheDocument()
    expect(screen.getByText('Limited time only')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })
})
