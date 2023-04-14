import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Entity,
  Record,
} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import React, { ReactNode } from 'react'
import Link from 'next/link'

interface PostRecordTextViewProps {
  post: PostView
}

export const PostRecordTextView = (props: PostRecordTextViewProps) => {
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
    //elements.push(<>{text.slice(i)}</>)
    let sliced_sentence = text.slice(i)
    elements.push(<>{sliced_sentence.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
    ))}</>)


  }else if (record.entities && record.entities.length > 0) { // entitiesがある場合にのみ処理する
    const text = record.text
    let i = 0
    for (const entity of record.entities) {
      const { start, end } = entity.index
      // URLにaタグまたはlinkタグを追加
      if (entity.type === "app.bsky.richtext.entity#mention") {
        elements.push(<Link href={`/profile/${text.slice(start+1 , end)}`}>{text.slice(start, end)}</Link>)
      } else if (entity.type === "link") {
        elements.push(<a href={text.slice(start, end)}>{text.slice(start, end)}</a>)
      }
      // URL以外のテキストを追加
      // elements.push(<>{text.slice(end)}</>)

      let sliced_sentence = text.slice(end)
      elements.push(<>{sliced_sentence.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
      ))}</>)
      i = end
    }
  } else {
    let sliced_sentence = record.text
    elements.push(<>{sliced_sentence.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
    ))}</>)
  }

  return <div>{elements}</div>
}