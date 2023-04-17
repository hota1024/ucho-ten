import { useAgent } from '@/atoms/agent'
import { AppBskyFeedDefs, AppBskyFeedGetPostThread, AtUri } from '@atproto/api'
import {
  FeedViewPost,
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Card, styled } from '@nextui-org/react'
import { ComponentProps, useState } from 'react'
import { PostViewCard } from '../Post'

const PostContainer = styled('div', {
  padding: '0 $8',
})

export interface FeedViewProps {
  feed: FeedViewPost
}

export const FeedView = (props: FeedViewProps) => {
  const [agent] = useAgent()
  const [feed, setFeed] = useState(props.feed)

  const fetchFeed = async () => {
    if (!agent) {
      throw new Error('agent is not ready')
    }

    const thread = await agent.getPostThread({
      uri: feed.post.uri,
    })

    const post = thread.data.thread

    if (AppBskyFeedDefs.isThreadViewPost(post)) {
      setFeed(post)
    }

    return post.post as ReturnType<
      ComponentProps<typeof PostViewCard>['onFetch']
    >
  }

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
                onFetch={fetchFeed}
              />
            </PostContainer>
            <PostContainer>
              <PostViewCard
                post={feed.post}
                reasonRepost={feed.reason as ReasonRepost}
                showLikeCount
                showReplyCount
                showRepostCount
                onFetch={fetchFeed}
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
              onFetch={fetchFeed}
            />
          </PostContainer>
        )}
      </Card>
    </>
  )
}
