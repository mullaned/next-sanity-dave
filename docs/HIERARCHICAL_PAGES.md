# Hierarchical Pages (Parent-Child Relationships)

This project implements hierarchical page structures following [Sanity's recommended approach](https://www.sanity.io/answers/best-approach-for-parent-child-relationships-and-slugs-in-sanity-io) for parent-child page relationships.

## Features

- **Parent-Child Relationships**: Create nested page hierarchies in Sanity Studio
- **Simple Slug Management**: Slugs remain simple (just the page name), not the full path
- **Frontend Path Building**: Full hierarchical paths are built dynamically in GROQ queries
- **Automatic Propagation**: Parent slug changes automatically propagate to children
- **Circular Reference Prevention**: Built-in validation prevents pages from being their own parent
- **SEO-Friendly**: Proper sitemap generation with hierarchical URLs

## Implementation Approach

This follows **Option #3** from Sanity's documentation: **Build the Full Path in Your Frontend**

### Why This Approach?

As recommended by Sanity:

- ✅ Keeps your schema simple
- ✅ Parent slug changes automatically propagate to children
- ✅ Easier to maintain and debug
- ✅ Simpler breadcrumb and navigation implementation

### How It Works

1. **Schema**: Simple `parent` reference field + regular `slug` field
2. **GROQ Queries**: Build `fullPath` dynamically using `select()`:

   ```groq
   "fullPath": select(
     defined(parent) => "/" + parent->slug.current + "/" + slug.current,
     "/" + slug.current
   )
   ```

3. **Frontend**: Uses the pre-built `fullPath` from queries

## How to Use

### Creating a Child Page in Sanity Studio

1. Navigate to your Sanity Studio (`/studio`)
2. Create a new Page or edit an existing one
3. In the **Parent Page** field, select the page you want as the parent
4. Save the page

### Example Structure

```text
Home (/)
├── About Us (/about-us)
│   ├── Team (/about-us/team)
│   └── History (/about-us/history)
├── Services (/services)
│   ├── Consulting (/services/consulting)
│   └── Training (/services/training)
└── Contact (/contact)
```

### URL Structure

- **Top-level page**: Leave "Parent Page" empty → URL: `/page-slug`
- **Child page**: Select a parent → URL: `/parent-slug/child-slug`

### Important Notes

1. **One-level hierarchy**: Currently supports parent->child (one level deep). For deeper nesting, see "Future Enhancements" below.

2. **Slug stays simple**: The slug field only contains the page's own slug (e.g., `team`), not the full path (not `about-us/team`). This is intentional and follows Sanity best practices.

3. **Full paths in queries**: The complete URL path is constructed in GROQ queries and automatically available as `fullPath`.

4. **Automatic updates**: If you change a parent's slug, all child page URLs automatically update (no manual intervention needed).

5. **Links**: Internal page links automatically use the correct hierarchical URL via the `fullPath` field.

## Technical Implementation

### Schema Updates

The page schema ([studio/src/schemaTypes/documents/page.ts](../studio/src/schemaTypes/documents/page.ts)) includes:

- `parent` field (reference to another page)
- Simple `slug` field (just the page name, not full path)
- Validation to prevent self-referencing

### GROQ Query Pattern

Following Sanity's recommended pattern, queries build the full path:

```groq
*[_type == 'page' && slug.current == $slug][0]{
  _id,
  name,
  slug,
  "parent": parent->{_id, name, "slug": slug.current},
  "fullPath": select(
    defined(parent) => "/" + parent->slug.current + "/" + slug.current,
    "/" + slug.current
  ),
  // ... other fields
}
```

### Frontend Updates

1. **Routing**: Uses Next.js catch-all routes `[...slug]` to support nested URLs
2. **Static Generation**: Splits `fullPath` into slug array for Next.js params
3. **Sitemap**: Uses `fullPath` directly from queries
4. **Links**: Resolved using `fullPath` from GROQ queries

### Files Modified

- `studio/src/schemaTypes/documents/page.ts` - Added parent field with validation
- `frontend/sanity/lib/queries.ts` - Added `fullPath` construction in GROQ queries
- `frontend/sanity/lib/page-utils.ts` - Helper functions for path extraction
- `frontend/app/[...slug]/page.tsx` - Catch-all route handler for nested pages
- `frontend/app/sitemap.ts` - Uses `fullPath` for hierarchical sitemap URLs
- `studio/sanity.config.ts` - Updated preview tool for nested URLs

## Reference

This implementation follows the official Sanity recommendation:

- [Best approach for parent-child relationships and slugs in Sanity.io](https://www.sanity.io/answers/best-approach-for-parent-child-relationships-and-slugs-in-sanity-io)

## Future Enhancements

Potential improvements for the future:

1. **Multi-level nesting**: Support unlimited depth using recursive GROQ queries or coalesce patterns
2. **Breadcrumbs component**: Automatic breadcrumb navigation from parent hierarchy
3. **Page tree view**: Visual hierarchy display in Sanity Studio
4. **Menu builder**: Auto-generate navigation menus from page hierarchy
5. **Path helpers**: Utility functions for complex path manipulations

## Migration

Existing pages will continue to work as top-level pages. They won't have a parent assigned, so their URLs remain unchanged (`/page-slug`).
