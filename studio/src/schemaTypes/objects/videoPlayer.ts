import { PlayIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const videoPlayer = defineType({
  name: 'videoPlayer',
  title: 'Video Player',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'Supports YouTube and Vimeo. Future support planned for: Twitch, SoundCloud, Streamable, Wistia, Facebook, DailyMotion',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true

          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
          const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/

          if (youtubeRegex.test(url) || vimeoRegex.test(url)) {
            return true
          }

          return 'Please enter a valid YouTube or Vimeo URL'
        }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail (Optional)',
      type: 'image',
      description:
        'Override the default video thumbnail. If not provided, the platform thumbnail will be used.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Standard)', value: '16/9' },
          { title: '4:3 (Classic)', value: '4/3' },
          { title: '21:9 (Ultrawide)', value: '21/9' },
        ],
        layout: 'radio',
      },
      initialValue: '16/9',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Note: Autoplay only works when video is muted due to browser restrictions',
      initialValue: false,
    }),
    defineField({
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showControls',
      title: 'Show Controls',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      videoUrl: 'videoUrl',
      media: 'thumbnail',
    },
    prepare({ title, videoUrl, media }) {
      return {
        title: title || 'Untitled Video',
        subtitle: videoUrl ? `Video: ${videoUrl.substring(0, 50)}...` : 'No URL set',
        media: media || PlayIcon,
      }
    },
  },
})
