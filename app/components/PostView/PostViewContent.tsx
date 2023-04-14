import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Entity,
  Record,
} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import { ReactNode } from 'react'

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
      elements.push(<>{text.substring(i, byteStart)}</>)
      // URLにaタグを追加
      elements.push(<a href={facet.features[0].uri}>{text.substring(byteStart, byteEnd)}</a>)
      i = byteEnd
    }
    // 最後のURL以降のテキストを追加
    elements.push(<>{text.substring(i)}</>)
  } else {
    elements.push(<>{record.text}</>)
  }

  return <div>{elements}</div>
}
