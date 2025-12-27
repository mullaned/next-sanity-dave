import { EarthGlobeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Redirect schema for managing URL redirects.
 * Auto-generated when slugs change on posts and pages.
 */

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description: 'The old URL path (e.g., /posts/old-slug)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
      description: 'The new URL path (e.g., /posts/new-slug)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent',
      type: 'boolean',
      description: 'Whether this is a permanent (301) or temporary (302) redirect',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      from: 'from',
      to: 'to',
      permanent: 'permanent',
    },
    prepare({ from, to, permanent }) {
      return {
        title: from,
        subtitle: `→ ${to} (${permanent ? '301' : '302'})`,
      }
    },
  },
})
