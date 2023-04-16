import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord } from '@atproto/api'
import { useAgent } from '@/atoms/agent'
import { useState } from 'react'
import { isRTL } from '@react-aria/i18n/src/utils'

interface PostProps {
  post: PostView
  reasonRepost?: ReasonRepost

  hasReply?: boolean

  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean

  onFetch: () => PostView
}

export const PostViewCard = (props: PostProps) => {
  const {
    post,
    reasonRepost,
    hasReply,
    showReplyCount,
    showRepostCount,
    showLikeCount,
    onFetch,
  } = props
  const record = post.record as Record
  const embed = post.embed as unknown as AppBskyEmbedRecord.ViewRecord
  const [agent] = useAgent()
  const [isLiked, setIsLiked] = useState(!!post.viewer?.like)
  const [isReposted, setIsReposted] = useState(!!post.viewer?.repost)

  const handleLikeClick = async () => {
    if (!agent) {
      return
    }

    setIsLiked((v) => {
      if (v) {
        return false
      } else {
        return true
      }
    })
    const post = await onFetch()

    if (post.viewer?.like) {
      await agent.deleteLike(post.viewer?.like)
    } else {
      await agent.like(post.uri, post.cid)
    }

    await onFetch()

    //let r = await agent.like(post.uri, post.cid)
    // let is_already_like = await agent.getLikes({ uri: post.uri, cid: post.cid })
    // let my_did = await agent.session?.did
    // console.log(is_already_like)
    // console.log(my_did)
    // for (let i = 0; i < is_already_like.data.likes.length; i++) {
    //   console.log(is_already_like.data.likes[i].did)
    //   if (is_already_like.data.likes[i].actor.did !== my_did) {
    //     await agent.like(post.uri, post.cid)
    //     return
    //   }
    // }
  }

  const handleRepostClick = async () => {
    if (!agent) {
      return
    }

    setIsReposted((v) => {
      if (v) {
        return false
      } else {
        return true
      }
    })
    const post = await onFetch()

    if (post.viewer?.repost) {
      await agent.deleteRepost(post.viewer?.repost)
    } else {
      await agent.repost(post.uri, post.cid)
    }

    await onFetch()

    //let r = await agent.like(post.uri, post.cid)
    // let is_already_like = await agent.getLikes({ uri: post.uri, cid: post.cid })
    // let my_did = await agent.session?.did
    // console.log(is_already_like)
    // console.log(my_did)
    // for (let i = 0; i < is_already_like.data.likes.length; i++) {
    //   console.log(is_already_like.data.likes[i].did)
    //   if (is_already_like.data.likes[i].actor.did !== my_did) {
    //     await agent.like(post.uri, post.cid)
    //     return
    //   }
    // }
  }

  return (
    <Post
      record={record}
      embed={embed}
      author={post.author}
      createdAt={record.createdAt}
      reasonRepost={reasonRepost}
      hasReply={hasReply}
      replyCount={post.replyCount}
      repostCount={
        isReposted
          ? (post.repostCount ? post.repostCount - 1 : 0) + 1
          : post.repostCount
          ? post.repostCount - 1
          : post.repostCount
      }
      likeCount={
        isLiked
          ? (post.likeCount ? post.likeCount - 1 : 0) + 1
          : post.likeCount
          ? post.likeCount - 1
          : 0
      }
      showReplyCount={showReplyCount}
      showRepostCount={showRepostCount}
      showLikeCount={showLikeCount}
      isLiked={isLiked}
      isReposted={isReposted}
      onLikeClick={() => {
        handleLikeClick()
      }}
      onRepostClick={() => {
        handleRepostClick()
      }}
      onFetch={onFetch}
    />
  )
}
