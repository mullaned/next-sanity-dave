import { getImageDimensions } from '@sanity/asset-utils'
import createImageUrlBuilder from '@sanity/image-url'
import { type CreateDataAttributeProps, createDataAttribute } from 'next-sanity'
import { dataset, projectId, studioUrl } from '@/sanity/lib/api'
import type { Link, Post } from '@/sanity.types'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Post['coverImage']) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  const imageRef = source?.asset?._ref
  const crop = source.crop

  // get the image's og dimensions
  const { width, height } = getImageDimensions(imageRef)

  if (
    crop &&
    crop.right !== undefined &&
    crop.left !== undefined &&
    crop.top !== undefined &&
    crop.bottom !== undefined
  ) {
    // compute the cropped image's area
    const croppedWidth = Math.floor(width * (1 - (crop.right + crop.left)))

    const croppedHeight = Math.floor(height * (1 - (crop.top + crop.bottom)))

    // compute the cropped image's position
    const left = Math.floor(width * crop.left)
    const top = Math.floor(height * crop.top)

    // gather into a url
    return imageBuilder?.image(source).rect(left, top, croppedWidth, croppedHeight).auto('format')
  }

  return imageBuilder?.image(source).auto('format')
}

export function resolveOpenGraphImage(image: Post['coverImage'], width = 1200, height = 627) {
  if (!image) return
  // biome-ignore lint/suspicious/noFocusedTests: This is Sanity's image builder .fit() method, not a test
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return { url, alt: image?.alt as string, width, height }
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | undefined) {
  if (!link) return null

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = 'href'
  }

  switch (link.linkType) {
    case 'href':
      return link.href || null
    case 'page':
      if (link?.page && typeof link.page === 'string') {
        return `/${link.page}`
      }
      return null
    case 'post':
      if (link?.post && typeof link.post === 'string') {
        return `/posts/${link.post}`
      }
      return null
    default:
      return null
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}
