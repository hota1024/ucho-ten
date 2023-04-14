import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Entity,
  Record,
} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import { ReactNode } from 'react'
import Link from 'next/link'

interface PostViewContent {
  post: PostView
}

export const PostViewContent = (props: PostViewContent) => {
  const { post } = props
  const record = post.record as Record
  const elements: ReactNode[] = []

  if (record.facets && record.facets.length > 0) { // facetsがある場合にのみ処理する
    const text = record.text
    let i = 0
    for (const facet of record.facets) {
      const { byteStart, byteEnd } = facet.index
      // URL以外のテキストを追加
      elements.push(<>{text.slice(i, byteStart)}</>)
      // URLにaタグまたはlinkタグを追加
      if (facet.features[0].$type === "app.bsky.richtext.facet#mention") {
        elements.push(<Link href={`/profile/${text.slice(byteStart+1 , byteEnd)}`}>{text.slice(byteStart, byteEnd)}</Link>)
      } else if (facet.features[0].$type === "app.bsky.richtext.facet#link") {
        elements.push(<a href={facet.features[0].uri as string}>{text.slice(byteStart, byteEnd)}</a>)
      }
      i = byteEnd
    }
    // 最後のURL以降のテキストを追加
    elements.push(<>{text.slice(i)}</>)
  } else {
    elements.push(<>{record.text}</>)
  }

  return <div>{elements}</div>
}