'use client'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import ResolvedLink from '@/app/components/ResolvedLink'
import type { HeroSlider } from '@/sanity.types'

type HeroSliderProps = {
  readonly block: HeroSlider
}

// Utility to clean invisible Unicode characters from Sanity strings
const cleanString = (str: string | null | undefined): string => {
  if (!str) return ''
  return str.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
}

export default function HeroSliderComponent({ block }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const slides = block.slides || []
  const totalSlides = slides.length
  const autoplay = block.autoplay ?? true
  const autoplayInterval = (block.autoplayInterval || 5) * 1000
  const showDots = block.showDots ?? true
  const showArrows = block.showArrows ?? true

  const heightClasses: Record<string, string> = {
    small: 'h-[400px]',
    medium: 'h-[600px]',
    large: 'h-[800px]',
    full: 'h-screen',
  }
  const heightClass = heightClasses[cleanString(block.height)] || heightClasses.large

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrentSlide(index)
      setTimeout(() => setIsAnimating(false), 500)
    },
    [isAnimating],
  )

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % totalSlides)
  }, [currentSlide, totalSlides, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides)
  }, [currentSlide, totalSlides, goToSlide])

  // Autoplay
  useEffect(() => {
    if (!autoplay || totalSlides <= 1 || isPaused) return

    const interval = setInterval(nextSlide, autoplayInterval)
    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, nextSlide, totalSlides, isPaused])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (totalSlides <= 1) return

      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    },
    [totalSlides, prevSlide, nextSlide],
  )

  if (totalSlides === 0) {
    return (
      <section className="relative w-full h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">Hero Slider</p>
          <p className="text-sm">No slides added yet. Add slides in Sanity Studio.</p>
        </div>
      </section>
    )
  }

  const hasContent = block.heading || block.subheading || (block.buttonText && block.buttonLink)

  return (
    <section
      aria-label="Hero slider"
      className={`relative w-full ${heightClass} overflow-hidden`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard navigation for slider
      tabIndex={0}
    >
      {/* Slides */}
      {slides.map((slide: any, index: number) => {
        const slideImageUrl = slide.image?.asset?.url
        const imageAlt = cleanString(slide.image?.alt)
        const isActive = index === currentSlide

        return (
          <div
            key={slide._key || index}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-500 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            {slideImageUrl ? (
              <>
                <Image
                  src={slideImageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-10" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image URL for slide {index + 1}</p>
              </div>
            )}
          </div>
        )
      })}

      {/* Content Layer - Centered text that persists across all slides */}
      {hasContent && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container">
            <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
              <Image
                src="/images/logo-white.png"
                alt="WAW Farm"
                width={250}
                height={250}
                style={{ height: 'auto' }}
              />
              {block.heading && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {block.heading}
                </h1>
              )}
              {block.subheading && (
                <p className="text-xl md:text-2xl text-white/90">{block.subheading}</p>
              )}
              {block.buttonText && block.buttonLink && (
                <ResolvedLink
                  link={block.buttonLink}
                  className="rounded-full inline-flex gap-2 items-center bg-white hover:bg-gray-100 focus:bg-gray-100 py-4 px-8 text-black font-semibold transition-colors duration-200"
                >
                  {block.buttonText}
                </ResolvedLink>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Navigation Dots and Autoplay Control */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          <div className="flex gap-3">
            {slides.map((slide: any, index: number) => (
              <button
                key={slide._key || `dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
                type="button"
              />
            ))}
          </div>

          {autoplay && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white hover:text-white/90 bg-black/50 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-full p-1.5 transition-colors"
              aria-label={isPaused ? 'Start autoplay' : 'Pause autoplay'}
              type="button"
            >
              {isPaused ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Pause className="w-4 h-4 fill-current" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Slide Counter - Screen Reader */}
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {totalSlides}
      </output>
    </section>
  )
}
