import { useAgent } from '@/atoms/agent'
import { AppBskyFeedDefs, AppBskyFeedGetPostThread, AtUri } from '@atproto/api'
import {
  FeedViewPost,
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Card, styled } from '@nextui-org/react'
import { ComponentProps, useMemo, useState } from 'react'
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
  const [replyParent, setReplyParent] = useState(props.feed.reply?.parent)
  const [replyParentRoot, setReplyParentRoot] = useState(props.feed.reply?.root)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reasonRepost = useMemo(() => feed.reason as ReasonRepost, [])

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

  const fetchReplyParent = async () => {
    if (!agent) {
      throw new Error('agent is not ready')
    }

    const thread = await agent.getPostThread({
      uri: replyParent?.uri! as string,
    })

    const post = thread.data.thread

    setReplyParent(post.post as PostView)

    return post.post as ReturnType<
      ComponentProps<typeof PostViewCard>['onFetch']
    >
  }

  return (
    <>
      <Card variant="flat" css={{ py: '$8' }}>
        {replyParentRoot && props.feed.reply?.parent.cid !== props.feed.reply?.root.cid ? (
            <>
              <PostContainer>
                <PostViewCard
                    hasReply
                    // @ts-ignore
                    post={replyParentRoot}
                    //reasonRepost={reasonRepost}
                    showLikeCount
                    showReplyCount
                    showRepostCount
                    onFetch={fetchReplyParent}
                />
              </PostContainer>
              <PostContainer>
                <PostViewCard
                    hasReply
                    // @ts-ignore
                    post={replyParent}
                    //reasonRepost={reasonRepost}
                    showLikeCount
                    showReplyCount
                    showRepostCount
                    onFetch={fetchReplyParent}
                />
              </PostContainer>
              <PostContainer>
                <PostViewCard
                    post={feed.post}
                    reasonRepost={reasonRepost}
                    showLikeCount
                    showReplyCount
                    showRepostCount
                    onFetch={fetchFeed}
                />
              </PostContainer>
            </>
        ):(
            replyParent? (
                <>
                  <PostContainer>
                    <PostViewCard
                        hasReply
                        // @ts-ignore
                        post={replyParent}
                        //reasonRepost={reasonRepost}
                        showLikeCount
                        showReplyCount
                        showRepostCount
                        onFetch={fetchReplyParent}
                    />
                  </PostContainer>
                  <PostContainer>
                    <PostViewCard
                        post={feed.post}
                        reasonRepost={reasonRepost}
                        showLikeCount
                        showReplyCount
                        showRepostCount
                        onFetch={fetchFeed}
                    />
                  </PostContainer>
                </>
            ):(
                <PostContainer>
                  <PostViewCard
                      post={feed.post}
                      reasonRepost={reasonRepost}
                      showLikeCount
                      showReplyCount
                      showRepostCount
                      onFetch={fetchFeed}
                  />
                </PostContainer>
            ))}
      </Card>
    </>
  )
}
