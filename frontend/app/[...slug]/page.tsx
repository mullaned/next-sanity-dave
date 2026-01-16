import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbJsonLd } from 'next-seo'
import CoverImage from '@/app/components/CoverImage'
import { PageOnboarding } from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import { sanityFetch } from '@/sanity/lib/live'
import { extractSlugFromPath } from '@/sanity/lib/page-utils'
import { getPageQuery, pagesSlugs } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/utils'
import type { GetPageQueryResult } from '@/sanity.types'

type Props = {
  params: Promise<{ slug: string[] }>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })

  // Build slug arrays from fullPath
  return data.map((page) => ({
    slug: page.fullPath?.split('/') || [page.slug],
  }))
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const slug = extractSlugFromPath(params.slug)
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
    // Metadata should never contain stega
    stega: false,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://next-sanity-dave-frontend.vercel.app'
  const pagePath = page?.fullPath || `/${slug}`
  const pageUrl = `${baseUrl}${pagePath}`

  // Get SEO data with fallbacks
  const metaTitle = page?.seo?.metaTitle || page?.name
  const metaDescription = page?.seo?.metaDescription || page?.heading
  const ogTitle = page?.seo?.ogTitle || metaTitle
  const ogDescription = page?.seo?.ogDescription || metaDescription || undefined

  // Get OG image URL
  const ogImage = page?.seo?.ogImage || page?.coverImage
  const imageBuilder = ogImage ? urlForImage(ogImage)?.width(1200).height(630) : null
  const ogImageUrl = imageBuilder ? imageBuilder.fit('crop').url() : undefined

  return {
    title: metaTitle,
    description: metaDescription,
    ...(page?.seo?.canonical && { alternates: { canonical: page.seo.canonical } }),
    ...(page?.seo?.noIndex && { robots: { index: false, follow: false } }),
    ...(page?.seo?.keywords &&
      page.seo.keywords.length > 0 && {
        keywords: page.seo.keywords,
      }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: pageUrl,
      type: 'website',
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogImage?.alt || metaTitle,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl && {
        images: [ogImageUrl],
      }),
    },
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params
  const slug = extractSlugFromPath(params.slug)
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  })

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://next-sanity-dave-frontend.vercel.app'
  const pagePath = page.fullPath || `/${slug}`
  const pageUrl = `${baseUrl}${pagePath}`

  // Build breadcrumb items for JSON-LD
  const breadcrumbItems = page.parent
    ? [
        {
          name: page.parent.name,
          item: `${baseUrl}/${page.parent.slug}`,
        },
        {
          name: page.name,
          item: pageUrl,
        },
      ]
    : []

  return (
    <div className="">
      {/* Breadcrumb JSON-LD for hierarchical pages */}
      {breadcrumbItems.length > 0 && <BreadcrumbJsonLd items={breadcrumbItems} />}

      <Head>
        <title>{page.heading}</title>
      </Head>
      {page.heading && !page.coverImage && (
        <div className="container">
          <div className="pb-6 border-b border-gray-100">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                {page.heading}
              </h2>
              <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-600 uppercase font-light">
                {page.subheading}
              </p>
            </div>
          </div>
        </div>
      )}
      {page?.coverImage && (
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 bg-waw-100">
            <div className="order-2 md:order-1 flex items-center justify-center flex-1 pb-4">
              <div className="prose lg:w-1/2">
                <Image
                  src="/images/logo.png"
                  alt="WAW Farm"
                  width={100}
                  height={80}
                  style={{ height: 'auto' }}
                />
                <h2 className="mt-0">{page.heading}</h2>
                <p>{page.subheading}</p>
                <Link
                  href="https://airbnb.com/h/wawfarm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md flex gap-2 mr-6 items-center justify-center bg-waw-btn hover:bg-waw-btn-hov focus:bg-waw-btn-foc py-3 px-6 text-white transition-colors duration-200"
                  aria-label="Book Now on Airbnb (opens in new tab)"
                >
                  Book Now <span className="sr-only">(opens in new tab)</span>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex-1">
              <CoverImage image={page.coverImage} priority />
            </div>
          </div>
        </div>
      )}

      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  )
}
