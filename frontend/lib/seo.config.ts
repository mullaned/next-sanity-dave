import type { Metadata } from 'next'

/**
 * Default SEO configuration for the application
 * This configuration is used as a base for generateMetadata functions
 */
export const defaultSEOConfig: Metadata = {
  title: {
    template: '%s | David Mullaney',
    default: 'David Mullaney - Web Developer & Designer',
  },
  description:
    'Portfolio and blog of David Mullaney, featuring web development projects, articles, and insights.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://davidmullaney.com',
    siteName: 'David Mullaney',
    images: [
      {
        url: 'https://davidmullaney.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'David Mullaney',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@davidmullaney',
    creator: '@davidmullaney',
  },
  metadataBase: new URL('https://davidmullaney.com'),
  authors: [{ name: 'David Mullaney' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
