import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord } from '@atproto/api'

interface PostProps {
  post: PostView
  reasonRepost?: ReasonRepost

  hasReply?: boolean

  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean
}

export const PostViewCard = (props: PostProps) => {
  const {
    post,
    reasonRepost,
    hasReply,
    showReplyCount,
    showRepostCount,
    showLikeCount,
  } = props
  const record = post.record as Record
  const embed = post.embed as unknown as AppBskyEmbedRecord.ViewRecord

  return (
    <Post
      record={record}
      embed={embed}
      author={post.author}
      createdAt={record.createdAt}
      reasonRepost={reasonRepost}
      hasReply={hasReply}
      replyCount={post.replyCount}
      repostCount={post.repostCount}
      likeCount={post.likeCount}
      showReplyCount={showReplyCount}
      showRepostCount={showRepostCount}
      showLikeCount={showLikeCount}
    />
  )
}
