import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AllPosts, MorePosts } from './Posts'

// Mock next-sanity with defineQuery
vi.mock('next-sanity', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-sanity')>()
  return {
    ...actual,
    createDataAttribute: vi.fn(() => () => 'mocked-data-attr'),
  }
})

// Mock the sanity live fetch
vi.mock('@/sanity/lib/live', () => ({
  sanityFetch: vi.fn(),
}))

// Mock the Avatar component
vi.mock('@/app/components/Avatar', () => ({
  default: ({ person }: { person: any; small: boolean }) => (
    <div data-testid="avatar">
      {person.firstName} {person.lastName}
    </div>
  ),
}))

// Mock the Date component
vi.mock('@/app/components/Date', () => ({
  default: ({ dateString }: { dateString: string }) => <span>{dateString}</span>,
}))

// Mock the Onboarding component
vi.mock('@/app/components/Onboarding', () => ({
  default: () => <div data-testid="onboarding">Onboarding</div>,
}))

describe('Posts Component - AllPosts', () => {
  it('renders onboarding when no posts exist', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    vi.mocked(sanityFetch).mockResolvedValue({ data: [], sourceMap: null, tags: [] })

    const component = await AllPosts()
    render(component)

    expect(screen.getByTestId('onboarding')).toBeInTheDocument()
  })

  it('renders posts when data exists', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        excerpt: 'This is a test excerpt',
        date: '2024-01-15',
        author: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await AllPosts()
    render(component)

    expect(screen.getByText('Recent Posts')).toBeInTheDocument()
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument()
  })

  it('renders correct subheading for single post', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '1',
        title: 'Single Post',
        slug: 'single-post',
        excerpt: 'Excerpt',
        date: '2024-01-15',
        author: { firstName: 'Jane', lastName: 'Smith' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await AllPosts()
    render(component)

    expect(
      screen.getByText('This blog post is populated from your Sanity Studio.'),
    ).toBeInTheDocument()
  })

  it('renders correct subheading for multiple posts', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '1',
        title: 'Post 1',
        slug: 'post-1',
        excerpt: 'Excerpt 1',
        date: '2024-01-15',
        author: { firstName: 'John', lastName: 'Doe' },
      },
      {
        _id: '2',
        title: 'Post 2',
        slug: 'post-2',
        excerpt: 'Excerpt 2',
        date: '2024-01-16',
        author: { firstName: 'Jane', lastName: 'Smith' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await AllPosts()
    render(component)

    expect(
      screen.getByText('These 2 blog posts are populated from your Sanity Studio.'),
    ).toBeInTheDocument()
  })

  it('renders post with author avatar', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '1',
        title: 'Post with Author',
        slug: 'post-with-author',
        excerpt: 'Excerpt',
        date: '2024-01-15',
        author: { firstName: 'John', lastName: 'Doe' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await AllPosts()
    render(component)

    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders post link with correct href', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '1',
        title: 'Linked Post',
        slug: 'linked-post',
        excerpt: 'Excerpt',
        date: '2024-01-15',
        author: { firstName: 'John', lastName: 'Doe' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await AllPosts()
    const { container } = render(component)

    const link = container.querySelector('a[href="/posts/linked-post"]')
    expect(link).toBeInTheDocument()
  })
})

describe('Posts Component - MorePosts', () => {
  it('renders null when no posts exist', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    vi.mocked(sanityFetch).mockResolvedValue({ data: [], sourceMap: null, tags: [] })

    const component = await MorePosts({ skip: '0', limit: 3 })
    const { container } = render(component)

    expect(container.firstChild).toBeNull()
  })

  it('renders more posts with count', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '3',
        title: 'More Post 1',
        slug: 'more-post-1',
        excerpt: 'More excerpt',
        date: '2024-01-17',
        author: { firstName: 'Alice', lastName: 'Johnson' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await MorePosts({ skip: '2', limit: 3 })
    render(component)

    expect(screen.getByText('Recent Posts (1)')).toBeInTheDocument()
    expect(screen.getByText('More Post 1')).toBeInTheDocument()
  })

  it('renders multiple more posts', async () => {
    const { sanityFetch } = await import('@/sanity/lib/live')
    const mockPosts = [
      {
        _id: '3',
        title: 'More Post 1',
        slug: 'more-post-1',
        excerpt: 'Excerpt 1',
        date: '2024-01-17',
        author: { firstName: 'Alice', lastName: 'Johnson' },
      },
      {
        _id: '4',
        title: 'More Post 2',
        slug: 'more-post-2',
        excerpt: 'Excerpt 2',
        date: '2024-01-18',
        author: { firstName: 'Bob', lastName: 'Williams' },
      },
    ]
    vi.mocked(sanityFetch).mockResolvedValue({ data: mockPosts, sourceMap: null, tags: [] })

    const component = await MorePosts({ skip: '2', limit: 5 })
    render(component)

    expect(screen.getByText('Recent Posts (2)')).toBeInTheDocument()
    expect(screen.getByText('More Post 1')).toBeInTheDocument()
    expect(screen.getByText('More Post 2')).toBeInTheDocument()
  })
})
