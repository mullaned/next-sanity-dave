import { defineQuery } from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->{
      "slug": slug.current,
      "fullPath": select(
        defined(parent) => parent->slug.current + "/" + slug.current,
        slug.current
      )
    }.fullPath,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    "parent": parent->{_id, name, "slug": slug.current},
    "fullPath": select(
      defined(parent) => "/" + parent->slug.current + "/" + slug.current,
      "/" + slug.current
    ),
    heading,
    subheading,
    coverImage,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "heroSlider" => {
        slides[]{
          _key,
          _type,
          image{
            asset->,
            hotspot,
            crop,
            alt
          }
        },
        heading,
        subheading,
        buttonText,
        buttonLink{
          ${linkFields}
        },
        autoplay,
        autoplayInterval,
        showDots,
        showArrows,
        height
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "videoPlayer" => {
        title,
        videoUrl,
        thumbnail,
        aspectRatio,
        autoplay,
        muted,
        loop,
        showControls
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    "fullPath": select(
      _type == "page" && defined(parent) => parent->slug.current + "/" + slug.current,
      slug.current
    ),
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {
    "slug": slug.current,
    "parent": parent->{"slug": slug.current},
    "fullPath": select(
      defined(parent) => parent->slug.current + "/" + slug.current,
      slug.current
    )
  }
`)
