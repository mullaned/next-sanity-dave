import { page } from './documents/page'
import { person } from './documents/person'
import { post } from './documents/post'
import { redirect } from './documents/redirect'
import { blockContent } from './objects/blockContent'
import { callToAction } from './objects/callToAction'
import { heroSlider } from './objects/heroSlider'
import { imageGallery } from './objects/imageGallery'
import { infoSection } from './objects/infoSection'
import { link } from './objects/link'
import { rawHtml } from './objects/rawHtml'
import { seo } from './objects/seo'
import { textPicture } from './objects/textPicture'
import { videoPlayer } from './objects/videoPlayer'
import { settings } from './singletons/settings'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  post,
  person,
  redirect,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  heroSlider,
  imageGallery,
  seo,
  rawHtml,
  textPicture,
  videoPlayer,
  link,
]
