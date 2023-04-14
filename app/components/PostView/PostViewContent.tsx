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

  if (record.entities) {
    const text = record.text

    for (let i = 0; i < text.length; ++i) {
      const entity = record.entities.find((entity) => entity.index.start === i)

      if (entity) {
        const { start, end } = entity.index

        const link = text.slice(start, end)
        elements.push(<a href={entity.value}>{link}</a>)

        i = end
      } else if (text[i] === '\n') {
        elements.push(<br />)
      } else {
        elements.push(<>{text[i]}</>)
      }
    }
  } else {
    elements.push(<>{record.text}</>)
  }

  return <div>{elements}</div>
}
