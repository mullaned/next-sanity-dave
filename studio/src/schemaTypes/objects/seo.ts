import { SearchIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * SEO schema object. This object provides fields for managing page metadata,
 * Open Graph data, and search engine optimization settings.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'The title tag for search engines. Recommended: 50-60 characters.',
      validation: (Rule) =>
        Rule.max(60).warning(
          'Meta titles longer than 60 characters may be truncated in search results',
        ),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'The meta description for search engines. Recommended: 150-160 characters.',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Meta descriptions longer than 160 characters may be truncated in search results',
        ),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description:
        'Title for social media sharing (Facebook, LinkedIn). Falls back to Meta Title if not set.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 3,
      description:
        'Description for social media sharing. Falls back to Meta Description if not set.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Image for social media sharing. Recommended: 1200x630px. Falls back to cover image if not set.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      description:
        'The canonical URL for this page. Use to prevent duplicate content issues. Leave empty to use the default page URL.',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Keywords for this page. While less important for modern SEO, they can help organize content.',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description:
        'Prevent search engines from indexing this page. Use for draft or internal pages.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
      description: 'metaDescription',
    },
    prepare({ title, description }) {
      return {
        title: title || 'No SEO title set',
        subtitle: description ? `${description.substring(0, 100)}...` : 'No meta description',
      }
    },
  },
})
