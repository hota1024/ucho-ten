import {
  FeedViewPost,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Card, styled } from '@nextui-org/react'
import { PostViewCard } from '../Post'

const PostContainer = styled('div', {
  padding: '0 $8',
})

export interface FeedViewProps {
  feed: FeedViewPost
}

export const FeedView = (props: FeedViewProps) => {
  const { feed } = props

  return (
    <>
      <Card variant="flat" css={{ py: '$8' }}>
        {feed.reply ? (
          <>
            <PostContainer>
              <PostViewCard
                hasReply
                post={feed.reply.parent}
                reasonRepost={feed.reason as ReasonRepost}
                showLikeCount
                showReplyCount
                showRepostCount
              />
            </PostContainer>
            <PostContainer>
              <PostViewCard
                post={feed.post}
                reasonRepost={feed.reason as ReasonRepost}
                showLikeCount
                showReplyCount
                showRepostCount
              />
            </PostContainer>
          </>
        ) : (
          <PostContainer>
            <PostViewCard
              post={feed.post}
              reasonRepost={feed.reason as ReasonRepost}
              showLikeCount
              showReplyCount
              showRepostCount
            />
          </PostContainer>
        )}
      </Card>
    </>
  )
}
