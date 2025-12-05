import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Image Gallery schema object. A component that displays a collection of images
 * in a masonry grid layout with modal viewing functionality.
 */

export const imageGallery = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'link',
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'alt',
            },
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: (rule) => {
                return rule.custom((alt, context) => {
                  if ((context.parent as any)?.asset?._ref && !alt) {
                    return 'Required'
                  }
                  return true
                })
              },
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).max(20).error('Gallery must have between 1 and 20 images'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled Gallery',
        subtitle: 'Image Gallery',
        media,
      }
    },
  },
})
