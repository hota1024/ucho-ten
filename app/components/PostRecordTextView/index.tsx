import {
  FeedViewPost,
  PostView,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Entity,
  Record,
} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import { ViewRecord } from '@atproto/api/dist/client/types/app/bsky/embed/record'
import { AppBskyFeedPost } from '@atproto/api'

interface PostRecordTextViewProps {
  record: Record
}

export const PostRecordTextView = (props: PostRecordTextViewProps) => {
  const { record } = props
  let elements: ReactNode[] = []

  if (record.facets && record.facets.length > 0) {
    // facetsがある場合にのみ処理する
    const text = record.text
    let i = 0
    elements.push(
      <>
        {text.split('\n').map((line, i) => (
          <p key={i}>
            {reactStringReplace(line, /(@\S+|https?:\/\/\S+)/g, (match, j) => {
              if (match.startsWith('@')) {
                const domain = match.substring(1) // remove "@" symbol from match
                return (
                  <Link key={j} href={`/profile/${domain}`}>
                    {match}
                  </Link>
                )
              } else if (match.startsWith('http')) {
                return (
                  <a key={j} href={match} target="_blank" rel="noopener noreferrer">
                    {match}
                  </a>
                )
              } else {
                return match
              }
            })}
          </p>
        ))}
      </>
    )
  } else if (record.entities && record.entities.length > 0) {
    // entitiesがある場合にのみ処理する
    const text = record.text
    let i = 0
    for (const entity of record.entities) {
      const { start, end } = entity.index
      // URLにaタグまたはlinkタグを追加
      if (entity.type === 'app.bsky.richtext.entity#mention') {
        elements.push(
          <Link href={`/profile/${text.slice(start + 1, end)}`}>
            {text.slice(start, end)}
          </Link>
        )
      } else if (entity.type === 'link') {
        elements.push(
          <a href={text.slice(start, end)} target="_blank" rel="noopener noreferrer">{text.slice(start, end)}</a>
        )
      }
      // URL以外のテキストを追加
      // elements.push(<>{text.slice(end)}</>)

      let sliced_sentence = text.slice(end)
      elements.push(
        <>
          {sliced_sentence.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </>
      )
      i = end
    }
  } else {
    let sliced_sentence = record.text
    elements.push(
      <>
        {sliced_sentence.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </>
    )
  }

  elements = elements.map((el, key) => (
    <React.Fragment key={key}>{el}</React.Fragment>
  ))

  return <div>{elements}</div>
}
