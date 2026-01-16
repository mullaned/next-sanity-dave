/**
 * Utility functions for handling hierarchical page structures
 */

/**
 * Build the full URL path for a page including parent hierarchy
 * @param slug - The current page slug
 * @param parentSlug - The parent page slug (if any)
 * @returns The full path (e.g., "parent/child")
 */
export function buildPagePath(slug: string, parentSlug?: string): string {
  if (parentSlug) {
    return `${parentSlug}/${slug}`
  }
  return slug
}

/**
 * Extract the slug from a full path
 * @param path - The full path (e.g., "parent/child" or ["parent", "child"])
 * @returns The slug of the current page
 */
export function extractSlugFromPath(path: string | string[]): string {
  if (Array.isArray(path)) {
    return path.at(-1) || ''
  }
  const parts = path.split('/')
  return parts.at(-1) || ''
}
