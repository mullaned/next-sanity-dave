import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import RawHtml from './RawHtml'
import type { RawHtml as RawHtmlType } from '@/sanity.types'

describe('RawHtml', () => {
  it('renders sanitized HTML content', () => {
    const mockBlock: RawHtmlType = {
      _type: 'rawHtml',
      html: {
        _type: 'code',
        language: 'html',
        code: '<div class="test-content"><p>Hello World</p></div>',
      },
    }

    const { container } = render(<RawHtml block={mockBlock} index={0} />)

    expect(container.querySelector('.test-content')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('sanitizes potentially dangerous HTML', () => {
    const mockBlock: RawHtmlType = {
      _type: 'rawHtml',
      html: {
        _type: 'code',
        language: 'html',
        code: '<div><script>alert("xss")</script><p>Safe content</p></div>',
      },
    }

    const { container } = render(<RawHtml block={mockBlock} index={0} />)

    // Script tags should be removed
    expect(container.querySelector('script')).not.toBeInTheDocument()
    // Safe content should still be there
    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('returns null when no HTML code is provided', () => {
    const mockBlock: RawHtmlType = {
      _type: 'rawHtml',
      html: {
        _type: 'code',
        language: 'html',
      },
    }

    const { container } = render(<RawHtml block={mockBlock} index={0} />)

    expect(container.firstChild).toBeNull()
  })

  it('preserves allowed tags like iframe', () => {
    const mockBlock: RawHtmlType = {
      _type: 'rawHtml',
      html: {
        _type: 'code',
        language: 'html',
        code: '<iframe src="https://example.com" allowfullscreen></iframe>',
      },
    }

    const { container } = render(<RawHtml block={mockBlock} index={0} />)

    expect(container.querySelector('iframe')).toBeInTheDocument()
  })
})
