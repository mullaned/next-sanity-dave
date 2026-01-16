import { CodeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Raw HTML schema object for rendering custom HTML code.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const rawHtml = defineType({
  name: 'rawHtml',
  title: 'Raw HTML',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'html',
      title: 'HTML Code',
      type: 'code',
      description: 'Enter your HTML code here. Scripts will be sanitized for security.',
      options: {
        language: 'html',
        languageAlternatives: [
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      code: 'html.code',
    },
    prepare(selection) {
      const { code } = selection

      return {
        title: code ? 'Raw HTML Block' : 'No HTML added',
        subtitle: code ? `${code.split('\n').length} lines of code` : 'Add HTML code to display',
      }
    },
  },
})
