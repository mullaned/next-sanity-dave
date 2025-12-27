'use client'

import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Cookie Consent Types
 *
 * @property necessary - Always true, required for basic site functionality
 * @property analytics - Controls Google Analytics and other tracking scripts
 *   Example: Load gtag.js script only when analytics consent is true
 * @property media - Controls embedded media (YouTube, Vimeo, etc.)
 *   Used by VideoPlayerNative component to conditionally show video embeds
 *
 * Future i18n integration points:
 * - Replace hardcoded text strings with translation function calls
 * - Add locale detection and text key lookups
 * - Example: toast(t('consent.analytics.disabled'))
 */
export interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  media: boolean
}

interface ConsentState extends ConsentPreferences {
  timestamp: number
  version: string
}

interface CookieConsentContextType {
  consent: ConsentPreferences
  updateConsent: (preferences: Partial<ConsentPreferences>) => void
  openSettings: () => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (open: boolean) => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const CONSENT_VERSION = 'v1'
const CONSENT_EXPIRY_DAYS = 365
const STORAGE_KEY = 'cookie-consent'
const COOKIE_NAME = '__consent'

/**
 * Check if Do Not Track is enabled in browser
 */
function isDNTEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  // @ts-expect-error - doNotTrack is not in TS types but exists in browsers
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || window.doNotTrack === '1'
}

/**
 * Get cross-domain consent sync enabled from environment
 */
function isCrossDomainEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_CROSS_DOMAIN_CONSENT === 'true'
}

/**
 * Read consent from cross-domain cookie
 */
function readConsentCookie(): ConsentState | null {
  if (typeof document === 'undefined' || !isCrossDomainEnabled()) return null

  const cookies = document.cookie.split(';')
  const consentCookie = cookies.find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))

  if (!consentCookie) return null

  try {
    const value = consentCookie.split('=')[1]
    const decoded = decodeURIComponent(value)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Write consent to cross-domain cookie
 */
function writeConsentCookie(state: ConsentState): void {
  if (typeof document === 'undefined' || !isCrossDomainEnabled()) return

  const encoded = encodeURIComponent(JSON.stringify(state))
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

  // SameSite=None; Secure for cross-domain
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported, needed for cross-domain consent
  document.cookie = `${COOKIE_NAME}=${encoded}; expires=${expiryDate.toUTCString()}; path=/; SameSite=None; Secure`
}

/**
 * Check if consent has expired or version changed
 */
function isConsentExpired(state: ConsentState): boolean {
  if (state.version !== CONSENT_VERSION) return true

  const now = Date.now()
  const expiryMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  return now - state.timestamp > expiryMs
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    media: false,
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize consent from localStorage or cookie
  useEffect(() => {
    try {
      // Try cross-domain cookie first
      let storedState: ConsentState | null = readConsentCookie()

      // Fallback to localStorage
      if (!storedState) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          storedState = JSON.parse(stored)
        }
      }

      if (storedState && !isConsentExpired(storedState)) {
        // Check DNT - if enabled, force reject analytics
        const dntEnabled = isDNTEnabled()
        setConsent({
          necessary: true,
          analytics: dntEnabled ? false : storedState.analytics,
          media: storedState.media,
        })

        if (dntEnabled && storedState.analytics) {
          // DNT was enabled after consent was given, update stored state
          const newState: ConsentState = {
            ...storedState,
            analytics: false,
            timestamp: Date.now(),
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
          writeConsentCookie(newState)
        }
      }
    } catch (error) {
      console.error('Failed to load consent preferences:', error)
    }
    setIsInitialized(true)
  }, [])

  /**
   * Update consent preferences
   */
  const updateConsent = useCallback((preferences: Partial<ConsentPreferences>) => {
    setConsent((prev) => {
      const now = Date.now()
      const dntEnabled = isDNTEnabled()
      const newConsent: ConsentPreferences = {
        necessary: true, // Always true
        analytics: dntEnabled ? false : (preferences.analytics ?? prev.analytics),
        media: preferences.media ?? prev.media,
      }

      // Save to localStorage
      const state: ConsentState = {
        ...newConsent,
        timestamp: now,
        version: CONSENT_VERSION,
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        writeConsentCookie(state)
      } catch (error) {
        console.error('Failed to save consent preferences:', error)
      }

      // Log consent events (only when analytics consent is given)
      if (newConsent.analytics) {
        if (preferences.analytics !== undefined && preferences.analytics !== prev.analytics) {
          console.log('[Consent] Analytics:', preferences.analytics ? 'enabled' : 'disabled')
          // Future: Send to analytics
          // gtag('event', 'consent_update', { analytics: preferences.analytics })
        }
        if (preferences.media !== undefined && preferences.media !== prev.media) {
          console.log('[Consent] Media:', preferences.media ? 'enabled' : 'disabled')
          // Future: Send to analytics
          // gtag('event', 'consent_update', { media: preferences.media })
        }
      }

      // Show toast notifications for consent withdrawal
      if (preferences.analytics === false && prev.analytics === true) {
        toast.info('Analytics cookies disabled')
      }
      if (preferences.media === false && prev.media === true) {
        toast.info('Media cookies disabled')
      }

      return newConsent
    })
  }, [])

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true)
  }, [])

  /**
   * Example: Load Google Analytics when analytics consent is given
   *
   * To implement:
   * 1. Uncomment the useEffect below
   * 2. Add your GA_MEASUREMENT_ID to environment variables
   * 3. Script will be loaded at end of body for better performance
   */
  // useEffect(() => {
  //   if (consent.analytics && typeof window !== 'undefined') {
  //     const script = document.createElement('script')
  //     script.async = true
  //     script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`
  //     document.body.appendChild(script)
  //
  //     window.dataLayer = window.dataLayer || []
  //     function gtag(...args: any[]) {
  //       window.dataLayer.push(args)
  //     }
  //     gtag('js', new Date())
  //     gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
  //   }
  // }, [consent.analytics])

  // Don't render children until initialized to prevent flash
  if (!isInitialized) {
    return null
  }

  return (
    <CookieConsentContext.Provider
      value={{ consent, updateConsent, openSettings, isSettingsOpen, setIsSettingsOpen }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}
