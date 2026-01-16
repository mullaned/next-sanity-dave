import DOMPurify from 'isomorphic-dompurify'

import type { RawHtml as RawHtmlType } from '@/sanity.types'

type RawHtmlProps = {
  readonly block: RawHtmlType
  readonly index: number
}

export default function RawHtml({ block }: RawHtmlProps) {
  if (!block.html?.code) {
    return null
  }

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(block.html.code, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  })

  return (
    <div className="container my-12">
      <div
        className="raw-html-content"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with DOMPurify
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  )
}
