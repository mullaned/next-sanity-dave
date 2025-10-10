# Typography Setup - Quick Reference

## Overview

Storybook is configured with the Tailwind CSS Typography plugin (`@tailwindcss/typography`) which provides beautiful typographic defaults for HTML content.

## Basic Usage

```tsx
<div className="prose">
  {/* Your content here */}
</div>
```

## Color Schemes

```tsx
<div className="prose prose-gray">
  {/* Gray color scheme (recommended) */}
</div>
```

## Size Modifiers

| Class | Use Case |
|-------|----------|
| `prose-sm` | Compact content, dense layouts |
| `prose` | Default size (65ch max-width) |
| `prose-lg` | Prominent content, marketing |
| `prose-xl` | Hero sections, emphasis |
| `prose-2xl` | Maximum impact |

## Dark Mode

```tsx
<div className="prose prose-invert prose-gray">
  {/* Automatically inverted for dark backgrounds */}
</div>
```

## Width Control

```tsx
{/* Default: max-w-prose (65ch) */}
<div className="prose prose-gray">...</div>

{/* Full width */}
<div className="prose prose-gray max-w-none">...</div>

{/* Custom width */}
<div className="prose prose-gray max-w-4xl">...</div>
```

## Custom Link Colors

Your project uses custom link styling:

```tsx
<div className="prose prose-a:text-brand">
  {/* Links will use the brand color (#f50) */}
</div>
```

## Combining Classes

You can combine multiple modifiers:

```tsx
<div className="prose prose-lg prose-gray prose-a:text-brand max-w-none">
  {/* Large, gray scheme, custom links, full width */}
</div>
```

## Common Patterns

### Blog Post

```tsx
<article className="prose prose-lg prose-gray mx-auto">
  <h1>Title</h1>
  <p>Content...</p>
</article>
```

### Documentation

```tsx
<div className="prose prose-gray max-w-none">
  {/* Full-width documentation */}
</div>
```

### Dark Mode Article

```tsx
<article className="prose prose-invert prose-gray">
  {/* Dark mode content */}
</article>
```

## Element Customization

Override specific elements using arbitrary variants:

```tsx
<div className="prose prose-h1:text-4xl prose-p:text-lg">
  {/* Custom heading and paragraph sizes */}
</div>
```

## Not-Prose

Remove prose styles from specific elements:

```tsx
<div className="prose">
  <p>Styled with prose</p>
  <div className="not-prose">
    {/* This won't be affected by prose styles */}
  </div>
</div>
```

## Global Configuration

The typography plugin is configured in:
- `tailwind.config.ts` - Plugin registration
- `app/globals.css` - Global plugin import
- `.storybook/preview.ts` - Storybook integration

## Available Stories

- **Design System/Typography** - Basic typography showcase
- **Design System/Typography Examples** - Comprehensive examples
- **Components/PortableText** - Sanity Portable Text with typography

## Learn More

- [Tailwind Typography Docs](https://tailwindcss.com/docs/typography-plugin)
- [Customizing Typography](https://github.com/tailwindlabs/tailwindcss-typography)
