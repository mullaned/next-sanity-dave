/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import { assist } from '@sanity/assist'
import { codeInput } from '@sanity/code-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import {
  type DocumentLocation,
  defineDocuments,
  defineLocations,
  presentationTool,
} from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { createRedirectsAction } from './src/lib/actions/createRedirectsAction'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '5f5fcp3b'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality
// On Vercel, this will be set via environment variable
// Locally, it defaults to localhost:3000
const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://next-sanity-dave-frontend.vercel.app/') // Replace with your Next.js Vercel URL

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(
  documentType?: string,
  slug?: string,
  parentSlug?: string,
): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      if (!slug) return undefined
      return parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Dave Test Project - Sanity Studio',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "settings" && _id == "siteSettings"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/:parent/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/posts/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
              parentSlug: 'parent.slug.current',
            },
            resolve: (doc) => {
              // Build full path: if parent exists, combine parent/child, else just slug
              const fullPath = doc?.parentSlug ? `${doc.parentSlug}/${doc.slug}` : doc?.slug

              return {
                locations: [
                  {
                    title: doc?.name || 'Untitled',
                    href: `/${fullPath}`,
                  },
                ],
              }
            },
          }),
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href: '/',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    codeInput(),
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },

  // Document actions configuration
  document: {
    actions: (prev, context) => {
      // Replace the default publish action with our custom one for posts and pages
      if (['post', 'page'].includes(context.schemaType)) {
        return prev.map((originalAction) =>
          originalAction.action === 'publish' ? createRedirectsAction : originalAction,
        )
      }
      return prev
    },
  },

  basePath: '/studio', // Make sure this matches your deployment path
})
