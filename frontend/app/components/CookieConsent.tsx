'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCookieConsent } from './CookieConsentContext'

export default function CookieConsent() {
  const { consent, updateConsent, isSettingsOpen, setIsSettingsOpen } = useCookieConsent()
  const [showBanner, setShowBanner] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [localAnalytics, setLocalAnalytics] = useState(consent.analytics)
  const [localMedia, setLocalMedia] = useState(consent.media)

  // Check if user has made a choice
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      setShowBanner(true)
    }
  }, [])

  // Update local state when consent changes
  useEffect(() => {
    setLocalAnalytics(consent.analytics)
    setLocalMedia(consent.media)
  }, [consent])

  const handleAcceptAll = () => {
    updateConsent({ analytics: true, media: true })
    dismissBanner()
  }

  const handleRejectAll = () => {
    updateConsent({ analytics: false, media: false })
    dismissBanner()
  }

  const handleDismiss = () => {
    // X button defaults to reject all non-essential
    updateConsent({ analytics: false, media: false })
    dismissBanner()
  }

  const dismissBanner = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setShowBanner(false)
      setIsAnimatingOut(false)
    }, 300) // Match animation duration
  }

  const handleOpenSettings = () => {
    setIsSettingsOpen(true)
  }

  const handleSaveSettings = () => {
    updateConsent({ analytics: localAnalytics, media: localMedia })
    setIsSettingsOpen(false)
  }

  // Re-open banner when settings is triggered
  useEffect(() => {
    if (isSettingsOpen) {
      setLocalAnalytics(consent.analytics)
      setLocalMedia(consent.media)
    }
  }, [isSettingsOpen, consent])

  if (!showBanner && !isSettingsOpen) {
    return null
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div
          className={`fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 ${
            isAnimatingOut ? 'animate-slideOutToBottom' : 'animate-slideInFromBottom'
          }`}
          role="dialog"
          aria-label="Cookie consent banner"
          aria-describedby="cookie-consent-description"
        >
          <div className="bg-white text-gray-900 border-t border-gray-200 shadow-layer">
            <div className="container mx-auto px-4 py-6 sm:py-8">
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Dismiss cookie banner"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="max-w-4xl">
                {/* i18n: Replace with t('consent.banner.title') */}
                <h2 className="text-lg sm:text-xl font-bold mb-2">We Value Your Privacy</h2>

                {/* i18n: Replace with t('consent.banner.description') */}
                <p
                  id="cookie-consent-description"
                  className="text-sm sm:text-base text-gray-600 mb-6 pr-8"
                >
                  We use cookies to enhance your browsing experience, serve personalized content,
                  and analyze our traffic. By clicking "Accept All", you consent to our use of
                  cookies.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* i18n: Replace with t('consent.banner.acceptAll') */}
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    aria-label="Accept all cookies"
                  >
                    Accept All
                  </button>

                  {/* i18n: Replace with t('consent.banner.rejectAll') */}
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Reject all non-essential cookies"
                  >
                    Reject All
                  </button>

                  {/* i18n: Replace with t('consent.banner.customize') */}
                  <button
                    type="button"
                    onClick={handleOpenSettings}
                    className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-900 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Customize cookie preferences"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            {/* i18n: Replace with t('consent.settings.title') */}
            <DialogTitle>Cookie Preferences</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies - Always On */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* i18n: Replace with t('consent.settings.necessary.title') */}
                <label htmlFor="necessary" className="font-medium">
                  Necessary Cookies
                </label>
                <div className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded">
                  Always On
                </div>
              </div>
              {/* i18n: Replace with t('consent.settings.necessary.description') */}
              <p className="text-sm text-gray-600">
                Essential for the website to function properly. These cannot be disabled.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* i18n: Replace with t('consent.settings.analytics.title') */}
                <label htmlFor="analytics" className="font-medium">
                  Analytics Cookies
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localAnalytics}
                  onClick={() => setLocalAnalytics(!localAnalytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    localAnalytics ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle analytics cookies"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localAnalytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {/* i18n: Replace with t('consent.settings.analytics.description') */}
              <p className="text-sm text-gray-600">
                Help us understand how visitors interact with our website by collecting and
                reporting information anonymously.
              </p>
            </div>

            {/* Media Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* i18n: Replace with t('consent.settings.media.title') */}
                <label htmlFor="media" className="font-medium">
                  Media Cookies
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localMedia}
                  onClick={() => setLocalMedia(!localMedia)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    localMedia ? 'bg-cyan-500' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle media cookies"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localMedia ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {/* i18n: Replace with t('consent.settings.media.description') */}
              <p className="text-sm text-gray-600">
                Enable embedded content from video platforms like YouTube and Vimeo.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {/* i18n: Replace with t('consent.settings.save') */}
            <button
              type="button"
              onClick={handleSaveSettings}
              className="flex-1 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Save cookie preferences"
            >
              Save Preferences
            </button>
            <DialogClose asChild>
              {/* i18n: Replace with t('consent.settings.cancel') */}
              <button
                type="button"
                className="flex-1 px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Cancel and close settings"
              >
                Cancel
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
