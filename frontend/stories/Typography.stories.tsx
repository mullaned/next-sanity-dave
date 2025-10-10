import type { Meta, StoryObj } from '@storybook/nextjs-vite'

// Simple component to showcase typography
const TypographyShowcase = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Typography Showcase</h1>
      <p className="lead">
        This is a demonstration of the Tailwind CSS Typography plugin in action.
        The typography plugin provides beautiful typographic defaults for HTML you don't control.
      </p>
      
      <h2>Heading Level 2</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </p>
      
      <h3>Heading Level 3</h3>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <h4>Lists</h4>
      <ul>
        <li>First item in unordered list</li>
        <li>Second item with <strong>bold text</strong></li>
        <li>Third item with <em>italic text</em></li>
      </ul>

      <ol>
        <li>First item in ordered list</li>
        <li>Second item</li>
        <li>Third item</li>
      </ol>

      <h4>Blockquote</h4>
      <blockquote>
        <p>
          "The typography plugin provides a set of prose classes you can use to add beautiful 
          typographic defaults to any vanilla HTML you don't control."
        </p>
      </blockquote>

      <h4>Code</h4>
      <p>
        Here's some inline code: <code>const greeting = 'Hello, World!'</code>
      </p>

      <pre><code>{`function example() {
  return 'This is a code block';
}`}</code></pre>

      <h4>Links</h4>
      <p>
        Check out the <a href="https://tailwindcss.com/docs/typography-plugin">Tailwind Typography documentation</a> for more information.
      </p>

      <h4>Table</h4>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Typography</td>
            <td>Beautiful default styles</td>
          </tr>
          <tr>
            <td>Responsive</td>
            <td>Works on all screen sizes</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const meta: Meta<typeof TypographyShowcase> = {
  title: 'Design System/Typography',
  component: TypographyShowcase,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TypographyShowcase>

export const Default: Story = {}

export const DarkBackground: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="prose prose-invert prose-gray max-w-none">
      <h1>Typography on Dark Background</h1>
      <p className="lead">
        The typography plugin includes an <code>prose-invert</code> class for dark backgrounds.
      </p>
      <h2>Beautiful Typography</h2>
      <p>
        This demonstrates how the typography looks on a dark background, perfect for dark mode designs.
      </p>
      <ul>
        <li>Automatically inverted colors</li>
        <li>Maintains readability</li>
        <li>Consistent spacing</li>
      </ul>
    </div>
  ),
}

export const SmallProse: Story = {
  render: () => (
    <div className="prose prose-sm prose-gray max-w-none">
      <h1>Small Typography</h1>
      <p className="lead">
        Use <code>prose-sm</code> for smaller typography.
      </p>
      <h2>Smaller Scale</h2>
      <p>
        This is useful for dense content or when you need to fit more text in a smaller space.
      </p>
    </div>
  ),
}

export const LargeProse: Story = {
  render: () => (
    <div className="prose prose-lg prose-gray max-w-none">
      <h1>Large Typography</h1>
      <p className="lead">
        Use <code>prose-lg</code> for larger, more prominent typography.
      </p>
      <h2>Bigger Scale</h2>
      <p>
        Perfect for landing pages, marketing content, or when you want to make a bold statement.
      </p>
    </div>
  ),
}

export const ExtraLargeProse: Story = {
  render: () => (
    <div className="prose prose-xl prose-gray max-w-none">
      <h1>Extra Large Typography</h1>
      <p className="lead">
        Use <code>prose-xl</code> for even larger typography.
      </p>
      <h2>Maximum Impact</h2>
      <p>
        Great for hero sections and important announcements.
      </p>
    </div>
  ),
}
