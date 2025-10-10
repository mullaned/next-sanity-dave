import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CustomPortableText from '@/app/components/PortableText'

const meta: Meta<typeof CustomPortableText> = {
  title: 'Components/PortableText',
  component: CustomPortableText,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CustomPortableText>

const samplePortableTextContent = [
  {
    _type: 'block',
    _key: 'intro',
    style: 'h1',
    children: [
      {
        _type: 'span',
        text: 'Welcome to Portable Text',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'paragraph1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'Portable Text is a JSON-based rich text specification for modern content editing platforms. It provides a way to create structured content that can be rendered consistently across different platforms and devices.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading2',
    style: 'h2',
    children: [
      {
        _type: 'span',
        text: 'Key Features',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'paragraph2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'This component renders Portable Text with custom styling and interactive elements:',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'list1',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        text: 'Automatic anchor links on headings',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'list2',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        text: 'Custom link styling with brand colors',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'list3',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        text: 'Typography plugin integration for beautiful defaults',
      },
    ],
  },
]

const richTextContent = [
  {
    _type: 'block',
    _key: 'title',
    style: 'h1',
    children: [
      {
        _type: 'span',
        text: 'Rich Text Example',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'intro-p',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'This example shows various text formatting options including ',
      },
      {
        _type: 'span',
        text: 'bold text',
        marks: ['strong'],
      },
      {
        _type: 'span',
        text: ', ',
      },
      {
        _type: 'span',
        text: 'italic text',
        marks: ['em'],
      },
      {
        _type: 'span',
        text: ', and ',
      },
      {
        _type: 'span',
        text: 'a custom link',
        marks: [
          {
            _type: 'link',
            _key: 'link1',
            href: 'https://www.sanity.io',
          },
        ],
      },
      {
        _type: 'span',
        text: '.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'h2-example',
    style: 'h2',
    children: [
      {
        _type: 'span',
        text: 'Heading with Anchor Link',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'hover-instruction',
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: 'Hover over the headings above to see the anchor link icon appear.',
      },
    ],
  },
]

export const Default: Story = {
  args: {
    value: samplePortableTextContent,
  },
}

export const RichText: Story = {
  args: {
    value: richTextContent,
  },
}

export const WithCustomClassName: Story = {
  args: {
    value: samplePortableTextContent,
    className: 'prose-lg',
  },
}

export const MinimalContent: Story = {
  args: {
    value: [
      {
        _type: 'block',
        _key: 'simple',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'A simple paragraph of Portable Text.',
          },
        ],
      },
    ],
  },
}

export const OnDarkBackground: Story = {
  args: {
    value: samplePortableTextContent,
    className: 'prose-invert',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
