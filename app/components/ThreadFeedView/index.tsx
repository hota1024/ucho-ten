import React from 'react';

import { useAgent } from '@/atoms/agent'
import { AppBskyFeedDefs, AppBskyFeedGetPostThread, AtUri } from '@atproto/api'
import {
    FeedViewPost,
    PostView,
    ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {Card, Row, styled} from '@nextui-org/react'
import { ComponentProps, useMemo, useState } from 'react'
import { PostViewCard } from '../ThreadPost'
import {root} from "postcss";
import {Post} from "@/components/Post/Post";

const PostContainer = styled('div', {
    padding: '0 $8',
})

export interface FeedViewProps {
    feed: any
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reasonRepost = useMemo(() => feed.reason as ReasonRepost, [])

    const fetchFeed = async (feed: any): Promise<PostView> => {
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

    const fetchReplyParent = async (feed: any) : Promise<PostView> => {
        if (!agent) {
            throw new Error('agent is not ready')
        }

        const thread = await agent.getPostThread({
            uri: feed.uri! as string,
        })

        const post = thread.data.thread

        setReplyParent(post.post as PostView)

        return post.post as ReturnType<
            ComponentProps<typeof PostViewCard>['onFetch']
        >
    }
    //const rootPost = props.feed[0].thread.post
    //console.log(rootPost)
    //console.log(props.feed[0])

    const renderPost = (post: any): JSX.Element => {
        console.log(post)
        return (
            <>
                <PostViewCard
                    hasReply={post.post.replyCount > 0}
                    post={post.post}
                    reasonRepost={undefined}
                    parentReply={undefined}
                    rootReply={undefined}
                    showLikeCount
                    showReplyCount
                    showRepostCount
                    onFetch={() => fetchReplyParent(post.post)}
                    postType={"post"}
                />
                {post.replies && post.replies.length > 0 && (
                    <>
                        {post.replies.length === 1 ? (
                            <>
                                <PostViewCard
                                    hasReply={post.replies[0].post.replyCount > 0}
                                    post={post.replies[0].post}
                                    reasonRepost={undefined}
                                    parentReply={undefined}
                                    rootReply={undefined}
                                    showLikeCount
                                    showReplyCount
                                    showRepostCount
                                    onFetch={() => fetchFeed(post.replies[0])}
                                    postType={"post"}
                                />
                                {post.replies[0].replies && [...post.replies[0].replies].reverse().map((reply: any) => renderPost(reply))}
                            </>
                        ) : (
                            <PostContainer>
                                {[...post.replies].reverse().map((reply: any) => {
                                    //console.log(reply)
                                    return renderPost(reply);
                                })}
                            </PostContainer>
                        )}
                    </>
                )}
            </>
        );
    };


    return (<div style={{height:'100%', width:'100%', position:'relative', left:'-10px'}}>
                {renderPost(props.feed[0].thread)}
            </div>
            )
}