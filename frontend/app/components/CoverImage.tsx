import { getImageDimensions } from '@sanity/asset-utils'
import { stegaClean } from '@sanity/client/stega'
import { Image } from 'next-sanity/image'
import { urlForImage } from '@/sanity/lib/utils'
import type { Post } from '@/sanity.types'

interface CoverImageProps {
  image: Post['coverImage']
  priority?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority } = props
  const image = source?.asset?._ref ? (
    <Image
      className="object-cover"
      width={getImageDimensions(source as Parameters<typeof getImageDimensions>[0]).width}
      height={getImageDimensions(source as Parameters<typeof getImageDimensions>[0]).height}
      alt={stegaClean(source?.alt) || 'Cover image'}
      src={urlForImage(source)?.url() as string}
      priority={priority}
    />
  ) : null

  return <div className="relative">{image}</div>
}
