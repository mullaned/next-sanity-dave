import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ResolvedLink from './ResolvedLink'

// Mock the linkResolver utility
vi.mock('@/sanity/lib/utils', () => ({
  linkResolver: vi.fn((link) => {
    if (link?.internalLink?._type === 'page') {
      return `/page/${link.internalLink.slug?.current}`
    }
    if (link?.internalLink?._type === 'post') {
      return `/posts/${link.internalLink.slug?.current}`
    }
    if (link?.externalUrl) {
      return link.externalUrl
    }
    return null
  }),
}))

describe('ResolvedLink Component', () => {
  it('renders internal page link correctly', () => {
    const link = {
      _type: 'link' as const,
      internalLink: {
        _type: 'page' as const,
        slug: { current: 'about', _type: 'slug' as const },
      },
      openInNewTab: false,
    }
    render(
      <ResolvedLink link={link} className="test-class">
        Click here
      </ResolvedLink>,
    )
    const linkElement = screen.getByText('Click here')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement.tagName).toBe('A')
    expect(linkElement).toHaveAttribute('href', '/page/about')
    expect(linkElement).toHaveClass('test-class')
  })

  it('renders internal post link correctly', () => {
    const link = {
      _type: 'link' as const,
      internalLink: {
        _type: 'post' as const,
        slug: { current: 'my-post', _type: 'slug' as const },
      },
      openInNewTab: false,
    }
    render(<ResolvedLink link={link}>Read post</ResolvedLink>)
    const linkElement = screen.getByText('Read post')
    expect(linkElement).toHaveAttribute('href', '/posts/my-post')
  })

  it('renders external link correctly', () => {
    const link = {
      _type: 'link' as const,
      externalUrl: 'https://example.com',
      openInNewTab: false,
    }
    render(<ResolvedLink link={link}>External link</ResolvedLink>)
    const linkElement = screen.getByText('External link')
    expect(linkElement).toHaveAttribute('href', 'https://example.com')
  })

  it('opens link in new tab when openInNewTab is true', () => {
    const link = {
      _type: 'link' as const,
      externalUrl: 'https://example.com',
      openInNewTab: true,
    }
    render(<ResolvedLink link={link}>External link</ResolvedLink>)
    const linkElement = screen.getByText('External link')
    expect(linkElement).toHaveAttribute('target', '_blank')
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not add target and rel when openInNewTab is false', () => {
    const link = {
      _type: 'link' as const,
      externalUrl: 'https://example.com',
      openInNewTab: false,
    }
    render(<ResolvedLink link={link}>External link</ResolvedLink>)
    const linkElement = screen.getByText('External link')
    expect(linkElement).not.toHaveAttribute('target')
    expect(linkElement).not.toHaveAttribute('rel')
  })

  it('renders children as fragment when link resolves to null', () => {
    const link = {
      _type: 'link' as const,
    }
    const { container } = render(<ResolvedLink link={link}>Just text</ResolvedLink>)
    expect(screen.getByText('Just text')).toBeInTheDocument()
    expect(container.querySelector('a')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const link = {
      _type: 'link' as const,
      externalUrl: 'https://example.com',
      openInNewTab: false,
    }
    render(
      <ResolvedLink link={link} className="custom-class">
        Link
      </ResolvedLink>,
    )
    const linkElement = screen.getByText('Link')
    expect(linkElement).toHaveClass('custom-class')
  })
})
