# Storybook Configuration

This project uses Storybook v9 for component development and testing.

## Running Storybook

```bash
npm run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

## Building Storybook

```bash
npm run build-storybook
```

This will build a static version of Storybook in the `storybook-static` directory.

## Writing Stories

Stories can be placed in:
- `/stories` directory (default example stories)
- `/app/components/**/*.stories.tsx` (your component stories)

### Example Story

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import MyComponent from '@/app/components/MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    // your props here
  },
}
```

## Addons Included

- **@chromatic-com/storybook** - Visual testing with Chromatic
- **@storybook/addon-docs** - Auto-generated documentation
- **@storybook/addon-onboarding** - Onboarding guide
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-vitest** - Component testing with Vitest

## Testing with Vitest

Run component tests with:

```bash
npx vitest
```

The Vitest addon allows you to write tests alongside your stories and see them in the Storybook UI.

## Global Styles

Your global Tailwind CSS styles from `app/globals.css` are automatically imported in `.storybook/preview.ts`.

### Typography Plugin

The `@tailwindcss/typography` plugin is configured and available in Storybook. Use the `prose` classes to apply beautiful typographic defaults:

```tsx
<div className="prose prose-gray">
  <h1>Your content here</h1>
  <p>Automatically styled with typography defaults</p>
</div>
```

Available typography variants:
- `prose-sm` - Smaller typography scale
- `prose-lg` - Larger typography scale
- `prose-xl` - Extra large typography scale
- `prose-2xl` - Even larger typography scale
- `prose-invert` - Inverted colors for dark backgrounds
- `prose-gray` - Gray color scheme (default)

See the `Typography` story for examples and live previews.

## Backgrounds

The preview is configured with multiple background options to help you test your components:
- **light** (default) - White background (#ffffff)
- **dark** - Dark gray background (#1b1d27)
- **gray** - Light gray background (#f6f6f8)

Switch backgrounds using the toolbar in Storybook's UI.

## Static Assets

Static assets from the `/public` directory are available in Storybook via the `staticDirs` configuration.
