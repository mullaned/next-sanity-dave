import { useEffect, useState } from 'react'
import type { DocumentActionComponent } from 'sanity'
import { useClient, useDocumentOperation } from 'sanity'

/**
 * Custom document action that auto-generates redirects when a slug changes.
 * This action monitors changes to the slug field and creates redirect documents
 * to maintain SEO when URLs change.
 *
 * Based on: https://www.sanity.io/recipes/auto-generating-redirects-on-slugs-change-e7c88bfc
 */

// Type for documents with slug field
interface DocumentWithSlug {
  slug?: {
    current?: string
  }
  [key: string]: unknown
}

export const createRedirectsAction: DocumentActionComponent = (props) => {
  const { draft, published, type, id } = props
  const { publish } = useDocumentOperation(id, type)
  const client = useClient({ apiVersion: '2024-01-01' })
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // If publish is pending, we mark the state as publishing
    if (publish.disabled) {
      setIsPublishing(false)
    }
  }, [publish.disabled])

  // Only apply to posts and pages with slugs
  if (!['post', 'page'].includes(type)) {
    return null
  }

  return {
    label: isPublishing ? 'Publishing...' : 'Publish',
    disabled: Boolean(publish.disabled) || isPublishing,
    onHandle: () => {
      setIsPublishing(true)

      // Get the slug values with proper typing
      const oldSlug = (published as DocumentWithSlug)?.slug?.current
      const newSlug = (draft as DocumentWithSlug)?.slug?.current

      // Execute the default publish operation
      publish.execute()

      // If slug has changed and there was an old slug, create a redirect
      if (oldSlug && newSlug && oldSlug !== newSlug) {
        // Determine the URL path based on document type
        const getPath = (slug: string) => {
          return type === 'post' ? `/posts/${slug}` : `/${slug}`
        }

        const fromPath = getPath(oldSlug)
        const toPath = getPath(newSlug)

        // Create the redirect document asynchronously
        client
          .create({
            _type: 'redirect',
            from: fromPath,
            to: toPath,
            permanent: true,
          })
          .then(() => {
            console.log(`✅ Created redirect from ${fromPath} to ${toPath}`)
            setIsPublishing(false)
          })
          .catch((error) => {
            console.error('❌ Error creating redirect:', error)
            setIsPublishing(false)
          })
      } else {
        setIsPublishing(false)
      }
    },
  }
}
