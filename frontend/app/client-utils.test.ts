import { isCorsOriginError } from 'next-sanity'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleError } from './client-utils'

// Mock next-sanity
vi.mock('next-sanity', () => ({
  isCorsOriginError: vi.fn(),
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('handles CORS origin error with addOriginUrl', () => {
    const addOriginUrl = new URL('https://example.com/cors-settings')
    const corsError = {
      addOriginUrl,
    }

    vi.mocked(isCorsOriginError).mockReturnValue(true)
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    handleError(corsError)

    expect(toast.error).toHaveBeenCalledWith(
      `Sanity Live couldn't connect`,
      expect.objectContaining({
        description: `Your origin is blocked by CORS policy`,
        duration: Infinity,
        action: expect.objectContaining({
          label: 'Manage',
        }),
      }),
    )

    // Test the action callback
    const callArgs = vi.mocked(toast.error).mock.calls[0][1]
    if (
      callArgs &&
      typeof callArgs === 'object' &&
      'action' in callArgs &&
      callArgs.action &&
      typeof callArgs.action === 'object' &&
      'onClick' in callArgs.action
    ) {
      const actionCallback = callArgs.action.onClick as () => void
      actionCallback()
      expect(openSpy).toHaveBeenCalledWith(addOriginUrl.toString(), '_blank')
    }

    openSpy.mockRestore()
  })

  it('handles CORS origin error without addOriginUrl', () => {
    const corsError = {}

    vi.mocked(isCorsOriginError).mockReturnValue(true)

    handleError(corsError)

    expect(toast.error).toHaveBeenCalledWith(
      `Sanity Live couldn't connect`,
      expect.objectContaining({
        description: `Your origin is blocked by CORS policy`,
        duration: Infinity,
        action: undefined,
      }),
    )
  })

  it('handles Error instance', () => {
    const error = new Error('Test error message')
    error.name = 'TestError'

    vi.mocked(isCorsOriginError).mockReturnValue(false)

    handleError(error)

    expect(console.error).toHaveBeenCalledWith(error)
    expect(toast.error).toHaveBeenCalledWith('TestError', {
      description: 'Test error message',
      duration: Infinity,
    })
  })

  it('handles unknown error type', () => {
    const unknownError = { something: 'unknown' }

    vi.mocked(isCorsOriginError).mockReturnValue(false)

    handleError(unknownError)

    expect(console.error).toHaveBeenCalledWith(unknownError)
    expect(toast.error).toHaveBeenCalledWith('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  })

  it('handles string error', () => {
    const stringError = 'Something went wrong'

    vi.mocked(isCorsOriginError).mockReturnValue(false)

    handleError(stringError)

    expect(console.error).toHaveBeenCalledWith(stringError)
    expect(toast.error).toHaveBeenCalledWith('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  })
})
