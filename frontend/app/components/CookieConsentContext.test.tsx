import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CookieConsentProvider, useCookieConsent } from './CookieConsentContext'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
  },
}))

// Test component to access context
function TestComponent() {
  const { consent, updateConsent, openSettings, isSettingsOpen, setIsSettingsOpen } =
    useCookieConsent()
  return (
    <div>
      <div data-testid="necessary">{consent.necessary ? 'true' : 'false'}</div>
      <div data-testid="analytics">{consent.analytics ? 'true' : 'false'}</div>
      <div data-testid="media">{consent.media ? 'true' : 'false'}</div>
      <div data-testid="settings-open">{isSettingsOpen ? 'true' : 'false'}</div>
      <button type="button" onClick={() => updateConsent({ analytics: true })}>
        Enable Analytics
      </button>
      <button type="button" onClick={() => updateConsent({ media: true })}>
        Enable Media
      </button>
      <button type="button" onClick={() => updateConsent({ analytics: false })}>
        Disable Analytics
      </button>
      <button type="button" onClick={openSettings}>
        Open Settings
      </button>
      <button type="button" onClick={() => setIsSettingsOpen(false)}>
        Close Settings
      </button>
    </div>
  )
}

describe('CookieConsentContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear all mocks
    vi.clearAllMocks()
    // Mock DNT as disabled
    Object.defineProperty(navigator, 'doNotTrack', {
      value: '0',
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'doNotTrack', {
      value: '0',
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('initializes with default consent values', () => {
      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      expect(screen.getByTestId('necessary').textContent).toBe('true')
      expect(screen.getByTestId('analytics').textContent).toBe('false')
      expect(screen.getByTestId('media').textContent).toBe('false')
    })

    it('loads consent from localStorage if present and not expired', () => {
      const now = Date.now()
      const storedConsent = {
        necessary: true,
        analytics: true,
        media: true,
        timestamp: now,
        version: 'v1',
      }
      localStorage.setItem('cookie-consent', JSON.stringify(storedConsent))

      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      expect(screen.getByTestId('analytics').textContent).toBe('true')
      expect(screen.getByTestId('media').textContent).toBe('true')
    })

    it('ignores expired consent', () => {
      const now = Date.now()
      const expiredConsent = {
        necessary: true,
        analytics: true,
        media: true,
        timestamp: now - 366 * 24 * 60 * 60 * 1000, // 366 days ago
        version: 'v1',
      }
      localStorage.setItem('cookie-consent', JSON.stringify(expiredConsent))

      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      // Should use default values
      expect(screen.getByTestId('analytics').textContent).toBe('false')
      expect(screen.getByTestId('media').textContent).toBe('false')
    })

    it('ignores consent with different version', () => {
      const now = Date.now()
      const oldVersionConsent = {
        necessary: true,
        analytics: true,
        media: true,
        timestamp: now,
        version: 'v0',
      }
      localStorage.setItem('cookie-consent', JSON.stringify(oldVersionConsent))

      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      // Should use default values
      expect(screen.getByTestId('analytics').textContent).toBe('false')
      expect(screen.getByTestId('media').textContent).toBe('false')
    })
  })

  describe('DNT (Do Not Track)', () => {
    it('respects DNT header and disables analytics', () => {
      const now = Date.now()
      // Mock DNT enabled
      Object.defineProperty(navigator, 'doNotTrack', {
        value: '1',
        writable: true,
        configurable: true,
      })

      const storedConsent = {
        necessary: true,
        analytics: true,
        media: true,
        timestamp: now,
        version: 'v1',
      }
      localStorage.setItem('cookie-consent', JSON.stringify(storedConsent))

      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      // Analytics should be forced to false
      expect(screen.getByTestId('analytics').textContent).toBe('false')
      // Media should still be true
      expect(screen.getByTestId('media').textContent).toBe('true')
    })
  })

  describe('Update Consent', () => {
    it('updates consent preferences and saves to localStorage', async () => {
      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      // Wait for component to initialize
      await waitFor(() => {
        expect(screen.getByTestId('necessary').textContent).toBe('true')
      })

      // Verify analytics starts as false
      expect(screen.getByTestId('analytics').textContent).toBe('false')

      const enableAnalytics = screen.getByText('Enable Analytics')
      enableAnalytics.click()

      // Check localStorage was updated (updateConsent saves immediately)
      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('cookie-consent') || '{}')
        expect(stored.analytics).toBe(true)
      })

      // Verify state updated
      expect(screen.getByTestId('analytics').textContent).toBe('true')
    })

    it('shows toast notification when consent is withdrawn', async () => {
      const now = Date.now()
      const { toast } = await import('sonner')

      // Enable analytics first
      const storedConsent = {
        necessary: true,
        analytics: true,
        media: true,
        timestamp: now,
        version: 'v1',
      }
      localStorage.setItem('cookie-consent', JSON.stringify(storedConsent))

      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      // Wait for component to initialize with stored consent
      await waitFor(
        () => {
          const analytics = screen.getByTestId('analytics')
          expect(analytics.textContent).toBe('true')
        },
        { timeout: 2000 },
      )

      const disableAnalytics = screen.getByText('Disable Analytics')
      disableAnalytics.click()

      await waitFor(
        () => {
          expect(toast.info).toHaveBeenCalledWith('Analytics cookies disabled')
        },
        { timeout: 3000 },
      )
    })
  })

  describe('Settings Management', () => {
    it('opens and closes settings', async () => {
      render(
        <CookieConsentProvider>
          <TestComponent />
        </CookieConsentProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('settings-open')).toBeTruthy()
      })

      expect(screen.getByTestId('settings-open').textContent).toBe('false')

      const openButton = screen.getByText('Open Settings')
      openButton.click()

      await waitFor(() => {
        expect(screen.getByTestId('settings-open').textContent).toBe('true')
      })

      const closeButton = screen.getByText('Close Settings')
      closeButton.click()

      await waitFor(() => {
        expect(screen.getByTestId('settings-open').textContent).toBe('false')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles invalid localStorage data gracefully', () => {
      localStorage.setItem('cookie-consent', 'invalid-json')

      expect(() => {
        render(
          <CookieConsentProvider>
            <TestComponent />
          </CookieConsentProvider>,
        )
      }).not.toThrow()

      expect(screen.getByTestId('analytics').textContent).toBe('false')
    })

    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => render(<TestComponent />)).toThrow(
        'useCookieConsent must be used within a CookieConsentProvider',
      )

      spy.mockRestore()
    })
  })
})
