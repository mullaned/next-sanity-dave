import './globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { draftMode } from 'next/headers'
import { toPlainText, VisualEditing } from 'next-sanity'
import { Toaster } from 'sonner'
import CookieConsent from '@/app/components/CookieConsent'
import { CookieConsentProvider } from '@/app/components/CookieConsentContext'
import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import * as demo from '@/sanity/lib/demo'
import { SanityLive, sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { handleError } from './client-utils'

// Generate CSP nonce
function generateNonce() {
  const crypto = require('node:crypto')
  return crypto.randomBytes(16).toString('base64')
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    other: {
      'csp-nonce': generateNonce(),
    },
  }
}

const f37Ginger = localFont({
  src: './fonts/F37Ginger-Bold.woff',
  variable: '--font-ginger',
  weight: '700',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  const nonce = generateNonce()
  const isDev = process.env.NODE_ENV === 'development'

  // Build CSP - relaxed in dev, strict in production
  const cspHeader = isDev
    ? [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://vercel.live https://va.vercel-scripts.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.sanity.io https://*.vercel.app https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com wss://*.sanity.io ws://localhost:* http://localhost:*",
        "frame-src 'self' https://www.youtube.com",
        "media-src 'self' https:",
        "object-src 'none'",
      ].join('; ')
    : [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://cdn.sanity.io https://vercel.live https://va.vercel-scripts.com`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.sanity.io https://*.vercel.app https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com wss://*.sanity.io",
        "frame-src 'self' https://www.youtube.com",
        "media-src 'self' https:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        'upgrade-insecure-requests',
        "require-trusted-types-for 'script'",
        "trusted-types next.js nextjs#bundler react#innerHTML default 'allow-duplicates'",
      ].join('; ')

  return (
    <html lang="en" className={f37Ginger.variable}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={cspHeader} />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={f37Ginger.className} nonce={isDev ? undefined : nonce}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          Skip to main content
        </a>
        <CookieConsentProvider>
          <section className="min-h-screen pt-24">
            {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
            <Toaster />
            <CookieConsent />
            {isDraftMode && (
              <>
                <DraftModeToast />
                {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
                <VisualEditing />
              </>
            )}
            {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
            <SanityLive onError={handleError} />
            <Header />
            <main id="main-content" className="">
              {children}
            </main>
            <Footer />
          </section>
          <SpeedInsights />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
