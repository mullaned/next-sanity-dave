# TextPicture Component Implementation

This document outlines all the steps taken to add the `textPicture` component to the Next.js + Sanity project.

## Overview

The `textPicture` component is a flexible content block that displays an image alongside text content (title, description, and optional button). It supports configurable image positioning (left/right) and background colors (primary/secondary).

## Files Created

### 1. Sanity Schema Object
**File:** `studio/src/schemaTypes/objects/textPicture.ts`

Created a new Sanity schema type with the following fields:
- `image` (required) - Image field with hotspot support and AI assist for alt text
- `title` (required) - String field for the heading
- `description` - Text field (4 rows) for body content
- `buttonText` - String field for button label
- `buttonLink` - Link field (references the existing link schema)
- `imagePosition` - Radio select: 'left' or 'right' (default: 'left')
- `backgroundColor` - Radio select: 'primary' or 'secondary' (default: 'primary')

Includes custom preview configuration showing title, media, and image position.

### 2. Next.js React Component
**File:** `frontend/app/components/TextPicture.tsx`

Created a responsive React component that:
- Uses Next.js `Image` component for optimized image loading
- Implements flexbox layout that switches between column (mobile) and row (desktop)
- Reverses the flex direction when `imagePosition` is 'right'
- Applies different background colors based on `backgroundColor` field:
  - `primary`: white background
  - `secondary`: gray background with border
- Uses `ResolvedLink` component for button functionality
- Wrapped button in `Suspense` for better loading experience
- TypeScript typed with proper Sanity types

### 3. Component Tests
**File:** `frontend/app/components/TextPicture.test.tsx`

Created comprehensive test suite with:
- Mocked Sanity utilities (`urlForImage`, `linkResolver`, `dataAttr`)
- Tests for rendering title, description, and button text
- Tests for background color variations (primary/secondary)
- Tests for layout variations (left/right image position)
- All 7 tests passing ✓

### 4. Documentation
**File:** `studio/static/page-builder-thumbnails/README.md`

Created a README noting that a thumbnail image (`textPicture.webp`) should be added to display in the Sanity Studio page builder's "Add Item" menu.

## Files Modified

### 1. Schema Types Index
**File:** `studio/src/schemaTypes/index.ts`

- Imported `textPicture` schema
- Added `textPicture` to the `schemaTypes` export array

### 2. Page Document Schema
**File:** `studio/src/schemaTypes/documents/page.ts`

- Added `{ type: 'textPicture' }` to the `pageBuilder` field's `of` array
- This makes the textPicture component available in the page builder

### 3. Block Renderer Component
**File:** `frontend/app/components/BlockRenderer.tsx`

- Imported `TextPictureComponent`
- Added mapping: `textPicture: TextPictureComponent` to the `Blocks` object
- This enables the PageBuilder to render textPicture blocks

### 4. Next.js Configuration
**File:** `frontend/next.config.ts`

- Added `images.remotePatterns` configuration to allow loading images from `cdn.sanity.io`
- This fixes the "hostname not configured" error for Next.js Image component

### 5. Vitest Setup
**File:** `frontend/vitest.setup.ts`

- Added mock environment variables:
  - `NEXT_PUBLIC_SANITY_DATASET = 'test'`
  - `NEXT_PUBLIC_SANITY_PROJECT_ID = 'test'`
- Required for running tests that import Sanity utilities

## Type Generation

After creating the schema, types were generated for TypeScript:

1. **Studio:** `npm run extract-types` in `studio/` directory
   - Extracts schema to `studio/schema.json`

2. **Frontend:** `npm run typegen` in `frontend/` directory
   - Generates TypeScript types in `frontend/sanity.types.ts`
   - Created the `TextPicture` type used by the React component

## Component Features

### Layout Behavior
- **Mobile (< lg breakpoint):** Single column, image above content
- **Desktop (≥ lg breakpoint):** Two columns (50/50 split)
  - Image position 'left': Image on left, content on right
  - Image position 'right': Image on right, content on left

### Styling Options
- **Primary background:** Clean white background
- **Secondary background:** Light gray background with subtle border
- **Image aspect ratio:** 4:3 with rounded corners
- **Button styling:** Black background with hover/focus states (blue)

### Responsive Design
- Container padding: 8px (mobile) → 12px (desktop)
- Gap between image and content: 8px (mobile) → 12px (desktop)
- Title: 3xl (mobile) → 4xl (desktop)
- Full-width on mobile, 50% width on desktop for each section

## Testing

All tests pass successfully:
```
✓ renders the title
✓ renders the description
✓ renders the button text
✓ applies correct background color for primary
✓ applies correct background color for secondary
✓ applies correct layout for left image position
✓ applies correct layout for right image position
```

## Usage in Sanity Studio

1. Navigate to any Page document in Sanity Studio
2. In the Page Builder section, click "Add Item"
3. Select "Text Picture" from the available components
4. Fill in the fields:
   - Upload an image with alt text
   - Enter title and description
   - Optionally add button text and link
   - Choose image position (left or right)
   - Choose background color (primary or secondary)
5. Publish the page

The component will automatically render on the frontend through the PageBuilder and BlockRenderer system.

## Technical Stack Integration

- **Sanity CMS:** Schema definition, content management
- **Next.js 15.5.0:** Server/client rendering with Turbopack
- **TypeScript:** Full type safety across schema and components
- **Tailwind CSS:** Responsive utility-first styling
- **Vitest:** Unit testing with mocked dependencies
- **React Testing Library:** Component testing utilities

## Future Enhancements (Optional)

- Add thumbnail image (`textPicture.webp`) to page builder menu
- Consider adding animation options (fade in, slide in, etc.)
- Add more background color options if needed
- Support for multiple buttons
- Add optional caption field for images
