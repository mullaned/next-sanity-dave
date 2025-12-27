import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CookieConsent from './CookieConsent'
import { CookieConsentProvider } from './CookieConsentContext'

// Mock Dialog component
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogClose: ({
    children,
    asChild: _asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div data-testid="dialog-close">{children}</div>,
}))

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Banner Display', () => {
    it('shows banner on first visit', () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      expect(screen.getByText('We Value Your Privacy')).toBeTruthy()
      expect(screen.getByText('Accept All')).toBeTruthy()
      expect(screen.getByText('Reject All')).toBeTruthy()
      expect(screen.getByText('Customize')).toBeTruthy()
    })

    it('does not show banner if consent already given', () => {
      localStorage.setItem(
        'cookie-consent',
        JSON.stringify({
          necessary: true,
          analytics: false,
          media: false,
          timestamp: Date.now(),
          version: 'v1',
        }),
      )

      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      expect(screen.queryByText('We Value Your Privacy')).toBeNull()
    })

    it('has proper ARIA attributes for accessibility', () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const banner = screen.getByRole('dialog')
      expect(banner.getAttribute('aria-label')).toBe('Cookie consent banner')
      expect(banner.getAttribute('aria-describedby')).toBe('cookie-consent-description')
    })
  })

  describe('Banner Actions', () => {
    it('accepts all cookies when Accept All is clicked', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const acceptButton = screen.getByText('Accept All')
      fireEvent.click(acceptButton)

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('cookie-consent') || '{}')
        expect(stored.analytics).toBe(true)
        expect(stored.media).toBe(true)
      })

      // Banner should disappear
      await waitFor(() => {
        expect(screen.queryByText('We Value Your Privacy')).toBeNull()
      })
    })

    it('rejects all cookies when Reject All is clicked', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const rejectButton = screen.getByText('Reject All')
      fireEvent.click(rejectButton)

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('cookie-consent') || '{}')
        expect(stored.analytics).toBe(false)
        expect(stored.media).toBe(false)
      })

      // Banner should disappear
      await waitFor(() => {
        expect(screen.queryByText('We Value Your Privacy')).toBeNull()
      })
    })

    it('dismisses banner with X button and defaults to reject', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const dismissButton = screen.getByLabelText('Dismiss cookie banner')
      fireEvent.click(dismissButton)

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('cookie-consent') || '{}')
        expect(stored.analytics).toBe(false)
        expect(stored.media).toBe(false)
      })
    })

    it('opens settings dialog when Customize is clicked', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const customizeButton = screen.getByText('Customize')
      fireEvent.click(customizeButton)

      await waitFor(() => {
        expect(screen.getByText('Cookie Preferences')).toBeTruthy()
      })
    })
  })

  describe('Settings Dialog', () => {
    it('shows all cookie categories in settings', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const customizeButton = screen.getByText('Customize')
      fireEvent.click(customizeButton)

      await waitFor(() => {
        expect(screen.getByText('Necessary Cookies')).toBeTruthy()
        expect(screen.getByText('Analytics Cookies')).toBeTruthy()
        expect(screen.getByText('Media Cookies')).toBeTruthy()
        expect(screen.getByText('Always On')).toBeTruthy()
      })
    })

    it('toggles analytics consent', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const customizeButton = screen.getByText('Customize')
      fireEvent.click(customizeButton)

      await waitFor(() => {
        const analyticsToggle = screen.getByLabelText('Toggle analytics cookies')
        expect(analyticsToggle.getAttribute('aria-checked')).toBe('false')

        fireEvent.click(analyticsToggle)
        expect(analyticsToggle.getAttribute('aria-checked')).toBe('true')
      })
    })

    it('toggles media consent', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const customizeButton = screen.getByText('Customize')
      fireEvent.click(customizeButton)

      await waitFor(() => {
        const mediaToggle = screen.getByLabelText('Toggle media cookies')
        expect(mediaToggle.getAttribute('aria-checked')).toBe('false')

        fireEvent.click(mediaToggle)
        expect(mediaToggle.getAttribute('aria-checked')).toBe('true')
      })
    })

    it('saves preferences when Save Preferences is clicked', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const customizeButton = screen.getByText('Customize')
      fireEvent.click(customizeButton)

      await waitFor(() => {
        const analyticsToggle = screen.getByLabelText('Toggle analytics cookies')
        fireEvent.click(analyticsToggle)
      })

      const saveButton = screen.getByText('Save Preferences')
      fireEvent.click(saveButton)

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('cookie-consent') || '{}')
        expect(stored.analytics).toBe(true)
        expect(stored.media).toBe(false)
      })
    })
  })

  describe('Mobile Responsiveness', () => {
    it('applies bottom-16 on mobile for browser UI compatibility', () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const banner = screen.getByRole('dialog')
      expect(banner.className).toContain('bottom-16')
      expect(banner.className).toContain('sm:bottom-0')
    })
  })

  describe('Animations', () => {
    it('applies slide-in animation on mount', () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const banner = screen.getByRole('dialog')
      expect(banner.className).toContain('animate-slideInFromBottom')
    })

    it('dismisses banner when X button is clicked', async () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const dismissButton = screen.getByLabelText('Dismiss cookie banner')
      fireEvent.click(dismissButton)

      // Banner should be removed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })
    })
  })

  describe('Z-Index Layering', () => {
    it('has correct z-index to sit below dialogs', () => {
      render(
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>,
      )

      const banner = screen.getByRole('dialog')
      expect(banner.className).toContain('z-40')
    })
  })
})
