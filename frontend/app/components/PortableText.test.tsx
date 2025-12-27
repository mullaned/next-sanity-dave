import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CustomPortableText from './PortableText'

// Mock the PortableText component from next-sanity
vi.mock('next-sanity', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-sanity')>()
  return {
    ...actual,
    PortableText: ({ components, value }: any) => {
      // Render a simplified version that tests our custom components
      return (
        <div data-testid="portable-text">
          {value.map((block: any) => {
            if (block._type === 'block') {
              if (block.style === 'h1' && components?.block?.h1) {
                return (
                  <div key={block._key || block._id} data-testid="h1-block">
                    {components.block.h1({
                      children: block.children?.[0]?.text || 'H1',
                      value: block,
                    })}
                  </div>
                )
              }
              if (block.style === 'h2' && components?.block?.h2) {
                return (
                  <div key={block._key || block._id} data-testid="h2-block">
                    {components.block.h2({
                      children: block.children?.[0]?.text || 'H2',
                      value: block,
                    })}
                  </div>
                )
              }
              return <p key={block._key || block._id}>{block.children?.[0]?.text || 'Text'}</p>
            }
            return null
          })}
        </div>
      )
    },
  }
})

// Mock ResolvedLink
vi.mock('@/app/components/ResolvedLink', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <a href="https://example.com">{children}</a>
  ),
}))

describe('CustomPortableText Component', () => {
  const mockValue = [
    {
      _type: 'block',
      _key: 'block1',
      children: [{ _type: 'span', text: 'Regular text' }],
    },
  ]

  it('renders portable text content', () => {
    render(<CustomPortableText value={mockValue} />)
    expect(screen.getByTestId('portable-text')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CustomPortableText value={mockValue} className="custom-class" />)
    const wrapper = container.querySelector('.custom-class')
    expect(wrapper).toBeInTheDocument()
  })

  it('applies prose classes by default', () => {
    const { container } = render(<CustomPortableText value={mockValue} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('prose', 'prose-a:text-brand')
  })

  it('combines custom className with default prose classes', () => {
    const { container } = render(<CustomPortableText value={mockValue} className="my-custom" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('prose', 'prose-a:text-brand', 'my-custom')
  })

  it('renders h1 with anchor link', () => {
    const h1Value = [
      {
        _type: 'block',
        _key: 'h1-key',
        style: 'h1',
        children: [{ _type: 'span', text: 'Heading 1' }],
      },
    ]
    render(<CustomPortableText value={h1Value} />)

    const h1Block = screen.getByTestId('h1-block')
    expect(h1Block).toBeInTheDocument()

    const h1 = h1Block.querySelector('h1')
    expect(h1).toBeInTheDocument()
    expect(h1).toHaveClass('group', 'relative')

    const anchor = h1Block.querySelector('a')
    expect(anchor).toHaveAttribute('href', '#h1-key')
    expect(anchor).toHaveAttribute('aria-label', 'Link to section')
  })

  it('renders h2 with anchor link', () => {
    const h2Value = [
      {
        _type: 'block',
        _key: 'h2-key',
        style: 'h2',
        children: [{ _type: 'span', text: 'Heading 2' }],
      },
    ]
    render(<CustomPortableText value={h2Value} />)

    const h2Block = screen.getByTestId('h2-block')
    expect(h2Block).toBeInTheDocument()

    const h2 = h2Block.querySelector('h2')
    expect(h2).toBeInTheDocument()
    expect(h2).toHaveClass('group', 'relative')

    const anchor = h2Block.querySelector('a')
    expect(anchor).toHaveAttribute('href', '#h2-key')
    expect(anchor).toHaveAttribute('aria-label', 'Link to section')
  })

  it('h1 anchor contains SVG icon', () => {
    const h1Value = [
      {
        _type: 'block',
        _key: 'h1-svg',
        style: 'h1',
        children: [{ _type: 'span', text: 'Test' }],
      },
    ]
    const { container } = render(<CustomPortableText value={h1Value} />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('h-4', 'w-4')
  })

  it('h2 anchor contains SVG icon', () => {
    const h2Value = [
      {
        _type: 'block',
        _key: 'h2-svg',
        style: 'h2',
        children: [{ _type: 'span', text: 'Test' }],
      },
    ]
    const { container } = render(<CustomPortableText value={h2Value} />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('anchor link has hover opacity transition classes', () => {
    const h1Value = [
      {
        _type: 'block',
        _key: 'h1-hover',
        style: 'h1',
        children: [{ _type: 'span', text: 'Test' }],
      },
    ]
    const { container } = render(<CustomPortableText value={h1Value} />)

    const anchor = container.querySelector('a')
    expect(anchor).toHaveClass('opacity-0', 'group-hover:opacity-100', 'transition-opacity')
  })

  it('renders empty array value', () => {
    const { container } = render(<CustomPortableText value={[]} />)
    expect(container.querySelector('.prose')).toBeInTheDocument()
  })

  it('filters out falsy classNames', () => {
    const { container } = render(<CustomPortableText value={mockValue} className={undefined} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).not.toContain('undefined')
  })
})
