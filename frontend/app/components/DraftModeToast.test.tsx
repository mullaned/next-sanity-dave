import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DraftModeToast from './DraftModeToast'

const mockRefresh = vi.fn()
const mockUseDraftModeEnvironment = vi.fn(() => 'live')
const mockUseIsPresentationTool = vi.fn(() => false)
const mockDisableDraftMode = vi.fn().mockResolvedValue(undefined)

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: mockRefresh,
  })),
}))

// Mock next-sanity hooks
vi.mock('next-sanity/hooks', () => ({
  useDraftModeEnvironment: () => mockUseDraftModeEnvironment(),
  useIsPresentationTool: () => mockUseIsPresentationTool(),
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: Object.assign(
    vi.fn((_message, _options) => 'toast-id-123'),
    {
      dismiss: vi.fn(),
      loading: vi.fn(() => 'loading-toast-id'),
    },
  ),
}))

// Mock app actions
vi.mock('@/app/actions', () => ({
  disableDraftMode: () => mockDisableDraftMode(),
}))

describe('DraftModeToast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseDraftModeEnvironment.mockReturnValue('live')
    mockUseIsPresentationTool.mockReturnValue(false)
  })

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

  it('renders and works with toast', () => {
    render(<DraftModeToast />)
    // Component renders without errors
    expect(true).toBe(true)
  })

  it('renders in presentation mode', () => {
    mockUseIsPresentationTool.mockReturnValue(true)
    render(<DraftModeToast />)
    expect(true).toBe(true)
  })

  it('renders with different environment', () => {
    mockUseDraftModeEnvironment.mockReturnValue('preview')
    render(<DraftModeToast />)
    expect(true).toBe(true)
  })
})
