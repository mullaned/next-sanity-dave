'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useCallback, useEffect, useState } from 'react'

import ResolvedLink from '@/app/components/ResolvedLink'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { urlForImage } from '@/sanity/lib/utils'
import type { ImageGallery } from '@/sanity.types'

type ImageGalleryProps = {
  readonly block: ImageGallery
}

export default function ImageGalleryComponent({ block }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const images = block.images || []
  const totalImages = images.length

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSelectedImageIndex(null)
  }, [])

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) => (prev === null || prev === 0 ? totalImages - 1 : prev - 1))
  }, [selectedImageIndex, totalImages])

  const handleNext = useCallback(() => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) => (prev === null || prev === totalImages - 1 ? 0 : prev + 1))
  }, [selectedImageIndex, totalImages])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || selectedImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedImageIndex, handleClose, handleNext, handlePrevious])

  const selectedImage = selectedImageIndex === null ? null : images[selectedImageIndex]
  const selectedImageUrl = selectedImage ? urlForImage(selectedImage)?.url() : null

  return (
    <div className="container my-12">
      <div className="flex flex-col gap-8">
        {/* Title and Description */}
        <div className="flex flex-col gap-4 text-center">
          {block.title && (
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {block.title}
            </h2>
          )}
          {block.description && (
            <p className="text-lg leading-8 text-gray-600 max-w-3xl mx-auto">{block.description}</p>
          )}
        </div>

        {/* Button */}
        {block.buttonText && block.buttonLink && (
          <Suspense fallback={null}>
            <div className="flex justify-center">
              <ResolvedLink
                link={block.buttonLink}
                className="rounded-full flex gap-2 items-center bg-black hover:bg-blue focus:bg-blue py-3 px-6 text-white transition-colors duration-200"
              >
                {block.buttonText}
              </ResolvedLink>
            </div>
          </Suspense>
        )}

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {images.map((image: NonNullable<ImageGallery['images']>[number], index: number) => {
            const imageUrl = urlForImage(image)?.url()
            if (!imageUrl) return null

            const altText = image.alt || `image ${index + 1}`
            return (
              <button
                key={image._key || index}
                onClick={() => handleImageClick(index)}
                className="masonry-item group relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2"
                aria-label={`View ${altText} in full size`}
                type="button"
              >
                <Image
                  src={imageUrl}
                  alt={image.alt || ''}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={index < 3 ? undefined : 'lazy'}
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black border-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">
            {selectedImage?.alt || `Image ${(selectedImageIndex ?? 0) + 1} of ${totalImages}`}
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </DialogClose>

            {/* Image */}
            {selectedImageUrl && selectedImage && (
              <div className="relative w-full h-full flex items-center justify-center p-16">
                <Image
                  src={selectedImageUrl}
                  alt={selectedImage.alt || ''}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  priority
                />
              </div>
            )}

            {/* Navigation Buttons */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                  aria-label="Previous image"
                  type="button"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                  aria-label="Next image"
                  type="button"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Image Counter - Screen Reader Announcement */}
            {selectedImageIndex !== null && (
              <output className="sr-only" aria-live="polite" aria-atomic="true">
                Image {selectedImageIndex + 1} of {totalImages}
              </output>
            )}

            {/* Image Counter - Visual */}
            {totalImages > 1 && selectedImageIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-4 py-2 text-white text-sm">
                {selectedImageIndex + 1} / {totalImages}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
