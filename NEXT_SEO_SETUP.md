# Next-SEO Setup Guide

This project uses [next-seo](https://github.com/garmeeh/next-seo) for JSON-LD structured data and Next.js's built-in Metadata API for SEO meta tags.

## Important Note for Next.js App Router

This project uses the Next.js 13+ App Router. The `<DefaultSeo>` and `<NextSeo>` components from next-seo **do not work** with the App Router. Instead:
- Use Next.js's built-in `Metadata` API for meta tags (already configured)
- Use next-seo's JSON-LD components for structured data (recommended)

## Configuration

The default SEO configuration is located in `/frontend/lib/seo.config.ts` and uses Next.js's `Metadata` type for consistency.

## Usage

### Page-Level SEO with Metadata API

For App Router pages, export a `generateMetadata` function:

```tsx
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us',
    description: 'Learn more about our company and mission',
    openGraph: {
      title: 'About Us',
      description: 'Learn more about our company and mission',
      images: [
        {
          url: 'https://yoursite.com/images/about-og.jpg',
          width: 1200,
          height: 630,
          alt: 'About Us',
        },
      ],
    },
  }
}

export default function AboutPage() {
  return (
    <main>
      {/* Your page content */}
    </main>
  )
}
```

### JSON-LD Structured Data (Recommended Use of next-seo)

For blog posts, use the `<ArticleJsonLd>` component:

```tsx
import { ArticleJsonLd } from 'next-seo'

export default function BlogPost({ post }) {
  return (
    <>
      <ArticleJsonLd
        type="BlogPosting"
        url={`https://yoursite.com/posts/${post.slug}`}
        title={post.title}
        images={[post.coverImage.url]}
        datePublished={post.publishedAt}
        authorName={post.author.name}
        description={post.excerpt}
      />
      <article>
        {/* Your article content */}
      </article>
    </>
  )
}
```

### Organization Schema

Add organization schema markup:

```tsx
import { OrganizationJsonLd } from 'next-seo'

export default function Layout({ children }) {
  return (
    <>
      <OrganizationJsonLd
        type="Organization"
        id="https://yoursite.com"
        name="Your Organization"
        url="https://yoursite.com"
        logo="https://yoursite.com/logo.png"
        sameAs={[
          'https://twitter.com/yourhandle',
          'https://github.com/yourusername',
        ]}
      />
      {children}
    </>
  )
}
```

## Available JSON-LD Components

Use these next-seo components for structured data:

- `<ArticleJsonLd>` - Article/blog schema
- `<BreadcrumbJsonLd>` - Breadcrumb schema
- `<BlogJsonLd>` - Blog schema
- `<CourseJsonLd>` - Course schema
- `<FAQJsonLd>` - FAQ schema
- `<JobPostingJsonLd>` - Job posting schema
- `<LocalBusinessJsonLd>` - Local business schema
- `<LogoJsonLd>` - Logo schema
- `<ProductJsonLd>` - Product schema
- `<SocialProfileJsonLd>` - Social profile schema
- `<VideoJsonLd>` - Video schema
- `<OrganizationJsonLd>` - Organization schema
- `<EventJsonLd>` - Event schema
- `<RecipeJsonLd>` - Recipe schema

## Updating the Configuration

Edit `/frontend/lib/seo.config.ts` to update:
- Default title and description
- Social media handles
- Open Graph images
- Site URL
- Metadata base URL

## Resources

- [next-seo Documentation](https://github.com/garmeeh/next-seo)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)

## Integration with Sanity

You can dynamically populate SEO metadata from Sanity CMS:

```tsx
import type { Metadata } from 'next'
import { ArticleJsonLd } from 'next-seo'
import { sanityFetch } from '@/sanity/lib/live'
import { postQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { data: post } = await sanityFetch({ 
    query: postQuery, 
    params 
  })
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [
        {
          url: urlFor(post.coverImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

export default async function PostPage({ params }) {
  const { data: post } = await sanityFetch({ 
    query: postQuery, 
    params 
  })
  
  return (
    <>
      <ArticleJsonLd
        type="BlogPosting"
        url={`https://yoursite.com/posts/${post.slug}`}
        title={post.title}
        images={[urlFor(post.coverImage).width(1200).height(630).url()]}
        datePublished={post.publishedAt}
        authorName={post.author.name}
        description={post.excerpt}
      />
      <article>
        {/* Your post content */}
      </article>
    </>
  )
}
```

