import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DraftModeToast from './DraftModeToast'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

// Mock next-sanity hooks
vi.mock('next-sanity/hooks', () => ({
  useDraftModeEnvironment: vi.fn(() => 'live'),
  useIsPresentationTool: vi.fn(() => false),
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: Object.assign(
    vi.fn((_message, _options) => {
      return 'toast-id-123'
    }),
    {
      dismiss: vi.fn(),
      loading: vi.fn(() => 'loading-toast-id'),
    },
  ),
}))

// Mock app actions
vi.mock('@/app/actions', () => ({
  disableDraftMode: vi.fn().mockResolvedValue(undefined),
}))

describe('DraftModeToast Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<DraftModeToast />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null (no visual output)', () => {
    const { container } = render(<DraftModeToast />)
    expect(container.firstChild).toBeNull()
  })

  it('component mounts successfully', () => {
    expect(() => render(<DraftModeToast />)).not.toThrow()
  })
})
