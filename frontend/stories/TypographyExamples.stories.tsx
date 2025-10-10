import type { Meta, StoryObj } from '@storybook/nextjs-vite'

/**
 * This story demonstrates how to use Tailwind Typography with components
 * It shows different prose classes and color schemes
 */

const TypographyExamples = () => {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Default Prose</h2>
        <div className="prose">
          <h3>Article Title</h3>
          <p>
            This is using the default <code>prose</code> class with no color modifier. It provides
            beautiful typography defaults for vanilla HTML content.
          </p>
          <ul>
            <li>Automatic spacing and sizing</li>
            <li>Optimized line heights</li>
            <li>Beautiful default colors</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Gray Color Scheme</h2>
        <div className="prose prose-gray">
          <h3>Using prose-gray</h3>
          <p>
            The <code>prose-gray</code> modifier applies a gray color scheme to your typography.
            This matches your project's gray color palette.
          </p>
          <blockquote>"Typography is what language looks like." — Ellen Lupton</blockquote>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Small (prose-sm)</h3>
            <div className="prose prose-sm prose-gray">
              <h4>Compact Typography</h4>
              <p>Perfect for dense content or smaller spaces.</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Large (prose-lg)</h3>
            <div className="prose prose-lg prose-gray">
              <h4>Spacious Typography</h4>
              <p>Great for readability and emphasis.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Dark Mode (prose-invert)</h2>
        <div className="prose prose-invert prose-gray">
          <h3>Inverted Colors</h3>
          <p>
            Use <code>prose-invert</code> for dark backgrounds. It automatically adjusts all
            typography colors for optimal readability on dark surfaces.
          </p>
          <ul>
            <li>Inverted text colors</li>
            <li>Adjusted link colors</li>
            <li>Proper contrast ratios</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Maximum Width Control</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">With max-w-prose (default)</p>
            <div className="prose prose-gray max-w-prose">
              <p>
                By default, prose adds max-width constraints for optimal line length (65-75
                characters). This improves readability by preventing lines from becoming too long.
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">With max-w-none</p>
            <div className="prose prose-gray max-w-none">
              <p>
                Using <code>max-w-none</code> removes the width constraint, allowing typography to
                expand to fill the available space. Useful when you want more control over the
                layout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Link Styling</h2>
        <div className="prose prose-gray prose-a:text-brand">
          <p>
            Your project uses custom link styling with <code>prose-a:text-brand</code> to apply the
            brand color (#f50) to links. This is configured in your PortableText component.
          </p>
          <p>
            <a href="#">This link uses the brand color</a> for visual consistency with your design
            system.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Code Blocks</h2>
        <div className="prose prose-gray">
          <p>Typography plugin includes nice defaults for code:</p>
          <pre>
            <code>{`function example() {
  const message = "Hello, World!";
  console.log(message);
}`}</code>
          </pre>
          <p>
            And inline code like <code>const x = 42</code> looks great too.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tables</h2>
        <div className="prose prose-gray">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>prose</code>
                </td>
                <td>Base typography styles</td>
              </tr>
              <tr>
                <td>
                  <code>prose-sm</code>
                </td>
                <td>Smaller scale</td>
              </tr>
              <tr>
                <td>
                  <code>prose-lg</code>
                </td>
                <td>Larger scale</td>
              </tr>
              <tr>
                <td>
                  <code>prose-invert</code>
                </td>
                <td>Dark mode</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof TypographyExamples> = {
  title: 'Design System/Typography Examples',
  component: TypographyExamples,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof TypographyExamples>

export const AllExamples: Story = {}

export const DarkModeOnly: Story = {
  render: () => (
    <div className="bg-gray-900 p-8 min-h-screen">
      <div className="prose prose-invert prose-gray max-w-none">
        <h1>Dark Mode Typography</h1>
        <p className="lead">
          All typography classes work seamlessly with dark mode using the prose-invert modifier.
        </p>
        <h2>Beautiful in the Dark</h2>
        <p>
          The inverted prose classes automatically adjust colors for optimal contrast on dark
          backgrounds. This includes headings, body text, links, and code blocks.
        </p>
        <ul>
          <li>Proper contrast ratios for accessibility</li>
          <li>Consistent styling across all elements</li>
          <li>Easy to implement with a single class</li>
        </ul>
        <blockquote>Perfect for dark mode designs and modern interfaces.</blockquote>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const BlogPostLayout: Story = {
  render: () => (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog Post Title</h1>
        <p className="text-gray-500">March 15, 2024 • 5 min read</p>
      </header>

      <div className="prose prose-lg prose-gray">
        <p className="lead">
          This demonstrates a typical blog post layout using the typography plugin. The lead
          paragraph uses larger text to draw readers in.
        </p>

        <h2>Section Heading</h2>
        <p>
          Your content flows naturally with consistent spacing and sizing. The typography plugin
          handles all the details so you can focus on your content.
        </p>

        <h3>Subsection</h3>
        <p>
          Headings, paragraphs, lists, and other elements are automatically styled with beautiful
          defaults that work great for blog posts and articles.
        </p>

        <ul>
          <li>Automatic vertical rhythm</li>
          <li>Optimal line length</li>
          <li>Professional appearance</li>
        </ul>
      </div>
    </article>
  ),
}
