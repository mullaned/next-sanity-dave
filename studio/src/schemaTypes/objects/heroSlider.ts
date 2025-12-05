import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const heroSlider = defineType({
  name: 'heroSlider',
  title: 'Hero Slider',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          name: 'slide',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
                aiAssist: {
                  imageDescriptionField: 'alt',
                },
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  description: 'Important for accessibility and SEO.',
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'image.alt',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Untitled Slide',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading text that appears over all slides',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Subheading text that appears below the heading',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'link',
      description: 'Link for the call-to-action button',
      hidden: ({ parent }) => !parent?.buttonText,
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Automatically transition between slides',
      initialValue: true,
    }),
    defineField({
      name: 'autoplayInterval',
      title: 'Autoplay Interval (seconds)',
      type: 'number',
      description: 'Time between slide transitions',
      initialValue: 5,
      validation: (Rule) => Rule.min(2).max(30),
      hidden: ({ parent }) => !parent?.autoplay,
    }),
    defineField({
      name: 'showDots',
      title: 'Show Navigation Dots',
      type: 'boolean',
      description: 'Display dot indicators at the bottom',
      initialValue: true,
    }),
    defineField({
      name: 'showArrows',
      title: 'Show Navigation Arrows',
      type: 'boolean',
      description: 'Display previous/next arrow buttons',
      initialValue: true,
    }),
    defineField({
      name: 'height',
      title: 'Hero Height',
      type: 'string',
      options: {
        list: [
          { title: 'Small (400px)', value: 'small' },
          { title: 'Medium (600px)', value: 'medium' },
          { title: 'Large (800px)', value: 'large' },
          { title: 'Full Screen', value: 'full' },
        ],
      },
      initialValue: 'large',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      media: 'slides.0.image',
      slideCount: 'slides',
    },
    prepare({ heading, media, slideCount }) {
      const count = Array.isArray(slideCount) ? slideCount.length : 0
      return {
        title: 'Hero Slider',
        subtitle: heading || `${count} slide${count === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})
