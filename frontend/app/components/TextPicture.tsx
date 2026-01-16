import Image from 'next/image'
import { Suspense } from 'react'

import ResolvedLink from '@/app/components/ResolvedLink'
import { urlForImage } from '@/sanity/lib/utils'
import type { TextPicture } from '@/sanity.types'

type TextPictureProps = {
  block: TextPicture
}

export default function TextPictureComponent({ block }: TextPictureProps) {
  const imageUrl = block.image ? urlForImage(block.image)?.url() : null
  const imagePosition = block.imagePosition || 'left'
  const backgroundColor = block.backgroundColor || 'primary'

  // Background color classes
  const bgColorClass =
    backgroundColor === 'primary' ? 'bg-white' : 'bg-gray-50 border border-gray-100'

  // Layout classes based on image position
  const containerOrderClass = imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'

  return (
    <div className="my-12">
      <div className={`${bgColorClass} overflow-hidden`}>
        <div
          className={`flex flex-col ${containerOrderClass} items-center gap-8 lg:gap-12 p-8 lg:p-12`}
        >
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            {imageUrl && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={imageUrl}
                  alt={block.image?.alt || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-6">
            <div className="max-w-[500px]">
              {block.title && (
                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl mb-3">
                  {block.title}
                </h2>
              )}

              {block.description && (
                <p className="text-lg leading-8 text-gray-600 mb-4">{block.description}</p>
              )}

              {block.buttonText && block.buttonLink && (
                <Suspense fallback={null}>
                  <div className="flex items-center gap-x-6">
                    <ResolvedLink
                      link={block.buttonLink}
                      className="rounded-full flex gap-2 items-center bg-black hover:bg-blue focus:bg-blue py-3 px-6 text-white transition-colors duration-200"
                    >
                      {block.buttonText}
                    </ResolvedLink>
                  </div>
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
