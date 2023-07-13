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

function hasNestedReply(post: any) {
  if (post.feed.reply) {
    if (post.feed.reply.parent && post.feed.reply.parent.reply) {
      return true;
    } else {
      return false;
    }
  }else{
    return false
  }
}

export const FeedView = (props: FeedViewProps) => {
  const [agent] = useAgent()
  const [feed, setFeed] = useState(props.feed)
  const [replyParent, setReplyParent] = useState(props.feed.reply?.parent)
  const [replyParentRoot, setReplyParentRoot] = useState(props.feed.reply?.root)
  const [hasNested, setHasNested] = useState(hasNestedReply(props))
  const printReplies = (reply = feed?.reply?.parent, level = 0): any[] => {
    const indent = "  ".repeat(level);
    const replies: any[] = [];

    if (reply) {
      replies.unshift(reply);
      if (reply.reply) {
        //@ts-ignore
        const nestedReplies = printReplies(reply.reply, level + 1);
        replies.unshift(...nestedReplies);
      }
    }

    return replies
  }

  const [nestedReplies, setNestedReplies] = useState(printReplies)


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
        {feed?.reason !== undefined && feed?.reply !== undefined ?
            (<PostContainer>
              <PostViewCard
                  // @ts-ignore
                  post={feed.post}
                  reasonRepost={reasonRepost}
                  parentReply={replyParentRoot}
                  rootReply={replyParentRoot}
                  showLikeCount
                  showReplyCount
                  showRepostCount
                  onFetch={fetchFeed}
                  postType={"post"}
              />
            </PostContainer>):
                (hasNested?
                      //threadの場合
                      (nestedReplies[0].cid === nestedReplies[1].reply.cid) ?
                        (<>
                          {nestedReplies.slice(0).map((item, index) => {
                            if (index === 0) {
                              //console.log(item) // 同じ場合は出力しない
                              return(
                                  <PostContainer key={index}>
                                    <PostViewCard
                                        hasReply
                                        post={item}
                                        //reasonRepost={reasonRepost}
                                        parentReply={nestedReplies[nestedReplies.length - 2]}
                                        parentIsRoot={false}
                                        rootReply={item}
                                        showLikeCount
                                        showReplyCount
                                        showRepostCount
                                        onFetch={fetchReplyParent}
                                        nestedReply={true}
                                        postType={"thread"}
                                        isRoot={true}
                                    />
                                  </PostContainer>
                              )
                            }
                            if(index === nestedReplies.length - 1){
                              return (
                                  <PostContainer key={index}>
                                    <PostViewCard
                                        hasReply
                                        post={item}
                                        //reasonRepost={reasonRepost}
                                        parentReply={nestedReplies[nestedReplies.length - 2]}
                                        parentIsRoot={nestedReplies[index - 1]?.reply?.parent?.cid === props.feed.reply?.root.cid}
                                        rootReply={replyParentRoot}
                                        showLikeCount
                                        showReplyCount
                                        showRepostCount
                                        onFetch={fetchReplyParent}
                                        nestedReply={true}
                                        postType={"thread"}
                                        //isRoot={item.cid === props.feed.reply?.root.cid}
                                    />
                                  </PostContainer>
                              )
                            }
                          })}
                          <PostContainer>
                            <PostViewCard
                                post={feed.post}
                                reasonRepost={reasonRepost}
                                rootReply={replyParentRoot}
                                showLikeCount
                                showReplyCount
                                showRepostCount
                                onFetch={fetchFeed}
                                postType={"thread"}
                            />
                          </PostContainer>
                        </>):
                          (<>
                            <PostContainer>
                              <PostViewCard
                                  hasReply
                                  // @ts-ignore
                                  post={replyParentRoot}
                                  //reasonRepost={reasonRepost}
                                  rootReply={replyParentRoot}
                                  showLikeCount
                                  showReplyCount
                                  showRepostCount
                                  onFetch={fetchReplyParent}
                                  isRoot={true}
                                  postType={"thread"}
                              />
                            </PostContainer>
                            {nestedReplies.slice(-1).map((item, index) => {
                              if (item.cid === props.feed.reply?.root.cid) {
                                return null; // 同じ場合は出力しない
                              }

                              return (
                                  <PostContainer key={index}>
                                    <PostViewCard
                                        hasReply
                                        post={item}
                                        //reasonRepost={reasonRepost}
                                        parentReply={nestedReplies[nestedReplies.length - 2]}
                                        parentIsRoot={nestedReplies[index - 1]?.reply?.parent?.cid === props.feed.reply?.root.cid}
                                        rootReply={replyParentRoot}
                                        showLikeCount
                                        showReplyCount
                                        showRepostCount
                                        onFetch={fetchReplyParent}
                                        nestedReply={true}
                                        postType={"thread"}
                                        isRoot={item.cid === props.feed.reply?.root.cid}
                                    />
                                  </PostContainer>
                              );
                            })}
                            <PostContainer>
                              <PostViewCard
                                  post={feed.post}
                                  reasonRepost={reasonRepost}
                                  rootReply={replyParentRoot}
                                  showLikeCount
                                  showReplyCount
                                  showRepostCount
                                  onFetch={fetchFeed}
                                  postType={"thread"}
                              />
                            </PostContainer>
                          </>):
                      //replyParentRootがある場合、かつreplyParentRootとreplyparentが一緒じゃない場合(つまり三つ連なっている)
                      (replyParentRoot && props.feed.reply?.parent.cid !== props.feed.reply?.root.cid ?
                              //parentとrootのauthorが一緒の場合はreplyParentRootを表示する
                              ((feed?.reply?.parent?.author as any)?.did as string === (feed?.reply?.root?.author as any)?.did as string ?
                                      (<>
                                        <PostContainer>
                                          <PostViewCard
                                              hasReply
                                              // @ts-ignore
                                              post={replyParentRoot}
                                              //reasonRepost={reasonRepost}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchReplyParent}
                                              postType={"thread"}
                                          />
                                        </PostContainer>
                                        <PostContainer>
                                          <PostViewCard
                                              hasReply
                                              // @ts-ignore
                                              post={replyParent}
                                              //reasonRepost={reasonRepost}
                                              //parentReply={replyParentRoot}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchReplyParent}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                        <PostContainer>
                                          <PostViewCard
                                              post={feed.post}
                                              reasonRepost={reasonRepost}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchFeed}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                      </>):
                                      (<>
                                        <PostContainer>
                                          <PostViewCard
                                              hasReply
                                              // @ts-ignore
                                              post={replyParent}
                                              //reasonRepost={reasonRepost}
                                              parentReply={replyParentRoot}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchReplyParent}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                        <PostContainer>
                                          <PostViewCard
                                              post={feed.post}
                                              reasonRepost={reasonRepost}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchFeed}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                      </>)
                              ):
                              //replyParentが存在する場合
                              (replyParent?
                                      (<>
                                        <PostContainer>
                                          <PostViewCard
                                              hasReply
                                              // @ts-ignore
                                              post={replyParent}
                                              rootReply={replyParentRoot}
                                              //reasonRepost={reasonRepost}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchReplyParent}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                        <PostContainer>
                                          <PostViewCard
                                              post={feed.post}
                                              reasonRepost={reasonRepost}
                                              rootReply={replyParentRoot}
                                              showLikeCount
                                              showReplyCount
                                              showRepostCount
                                              onFetch={fetchFeed}
                                              postType={"reply"}
                                          />
                                        </PostContainer>
                                      </>):
                                      (feed.post ?(<PostContainer>
                                        <PostViewCard
                                            post={feed.post}
                                            reasonRepost={reasonRepost}
                                            showLikeCount
                                            showReplyCount
                                            showRepostCount
                                            onFetch={fetchFeed}
                                            postType={"post"}
                                        />
                                      </PostContainer>) :
                                          (<PostContainer>
                                            <PostViewCard
                                                // @ts-ignore
                                                post={feed}
                                                reasonRepost={undefined}
                                                showLikeCount
                                                showReplyCount
                                                showRepostCount
                                                onFetch={fetchFeed}
                                                postType={"post"}
                                            />
                                          </PostContainer>))
                              )
                      )
                )
        }

      </Card>
    </>
  )
}
