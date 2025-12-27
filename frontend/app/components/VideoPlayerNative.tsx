'use client'

import Image from 'next/image'
import { useState } from 'react'
import { urlForImage } from '@/sanity/lib/utils'
import type { VideoPlayer } from '@/sanity.types'
import { useCookieConsent } from './CookieConsentContext'

type VideoPlayerProps = {
  block: VideoPlayer
  index?: number
}

export default function VideoPlayerNative({ block, index = 0 }: VideoPlayerProps) {
  const { consent, openSettings } = useCookieConsent()
  const [showVideo, setShowVideo] = useState(false)

  const isAboveFold = index < 2

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null

    // Handle youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&]+)/)
    if (watchMatch) return watchMatch[1]

    // Handle youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/)
    if (shortMatch) return shortMatch[1]

    // Handle youtube.com/embed/ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/)
    if (embedMatch) return embedMatch[1]

    return null
  }

  // Get Vimeo video ID
  const getVimeoId = (url: string): string | null => {
    if (!url) return null
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  const videoUrl = block.videoUrl || ''
  const youtubeId = getYouTubeId(videoUrl)
  const vimeoId = getVimeoId(videoUrl)

  // Clean aspect ratio string (remove any invisible Unicode characters)
  const aspectRatio = (block.aspectRatio || '16/9').replace(/[^\d/]/g, '')

  // Calculate padding-bottom percentage from aspect ratio
  const [width, height] = aspectRatio.split('/').map(Number)
  const paddingBottom = `${(height / width) * 100}%`

  // Get custom thumbnail URL if provided
  const customThumbnailUrl = block.thumbnail
    ? urlForImage(block.thumbnail)?.height(600).width(1067).url()
    : null

  // Get auto-generated YouTube thumbnail
  const youtubeThumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : null

  const thumbnailUrl = customThumbnailUrl || youtubeThumbnail

  // Build iframe src with autoplay params
  const getIframeSrc = (): string => {
    if (youtubeId) {
      const params = new URLSearchParams({
        autoplay: block.autoplay ? '1' : '0',
        mute: block.muted ? '1' : '0',
        loop: block.loop ? '1' : '0',
        controls: block.showControls !== false ? '1' : '0',
        rel: '0', // Don't show related videos
        modestbranding: '1', // Minimal YouTube branding
      })
      return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`
    }

    if (vimeoId) {
      const params = new URLSearchParams({
        autoplay: block.autoplay ? '1' : '0',
        muted: block.muted ? '1' : '0',
        loop: block.loop ? '1' : '0',
        controls: block.showControls !== false ? '1' : '0',
      })
      return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`
    }

    return ''
  }

  // If no consent, show overlay
  if (!consent.media) {
    return (
      <div className="container my-12">
        <div className="max-w-4xl mx-auto">
          {block.title && <h2 className="text-3xl font-bold mb-6">{block.title}</h2>}
          <div
            className="relative w-full overflow-hidden rounded-lg bg-gray-900"
            style={{ paddingBottom }}
          >
            {/* Show thumbnail */}
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt={block.thumbnail?.alt || block.title || 'Video thumbnail'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={isAboveFold}
              />
            )}

            {/* Consent overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-6 text-center">
              <svg
                className="mb-4 h-16 w-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Play video"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mb-4 text-lg font-medium text-white">
                Video content requires your consent
              </p>
              <p className="mb-6 max-w-md text-sm text-gray-200">
                To view this video, please accept media cookies in your privacy settings.
              </p>
              <button
                onClick={openSettings}
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                type="button"
              >
                Update Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no valid video URL
  if (!youtubeId && !vimeoId) {
    return (
      <div className="container my-12">
        <div className="max-w-4xl mx-auto">
          {block.title && <h2 className="text-3xl font-bold mb-6">{block.title}</h2>}
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <p className="text-red-800">
              Invalid video URL. Please provide a valid YouTube or Vimeo URL.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const iframeSrc = getIframeSrc()

  // Show with thumbnail and play button (click to load)
  if (thumbnailUrl && !showVideo && !block.autoplay) {
    return (
      <div className="container my-12">
        <div className="max-w-4xl mx-auto">
          {block.title && <h2 className="text-3xl font-bold mb-6">{block.title}</h2>}
          <button
            type="button"
            className="relative w-full overflow-hidden rounded-lg bg-gray-900 cursor-pointer group border-0 p-0"
            style={{ paddingBottom }}
            onClick={() => setShowVideo(true)}
            aria-label="Play video"
          >
            <Image
              src={thumbnailUrl}
              alt={block.thumbnail?.alt || block.title || 'Video thumbnail'}
              fill
              className="object-cover transition-opacity group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority={isAboveFold}
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-red-600 p-6 transition-transform group-hover:scale-110">
                <svg
                  className="h-12 w-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Show iframe
  return (
    <div className="container my-12">
      <div className="max-w-4xl mx-auto">
        {block.title && <h2 className="text-3xl font-bold mb-6">{block.title}</h2>}
        <div
          className="relative w-full overflow-hidden rounded-lg bg-black"
          style={{ paddingBottom }}
        >
          <iframe
            src={iframeSrc}
            title={block.title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading={isAboveFold ? 'eager' : 'lazy'}
          />
        </div>
      </div>
    </div>
  )
}
