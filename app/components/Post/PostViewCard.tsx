import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord, ComAtprotoRepoStrongRef } from '@atproto/api'
import { useAgent } from '@/atoms/agent'
import { useState } from 'react'
import { isRTL } from '@react-aria/i18n/src/utils'
import { PostModal } from '../PostModal'
import { PostRecordPost } from '@/types/posts'

interface PostViewCardProps {
  post: PostView
  reasonRepost?: ReasonRepost

  hasReply?: boolean

  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean

  onFetch: () => PostView | Promise<PostView>
}

export const PostViewCard = (props: PostViewCardProps) => {
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
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [isReposted, setIsReposted] = useState(!!post.viewer?.repost)
  const [isFollowing, setIsFollowing] = useState(!!post.viewer?.following)
  const [repostCount, setRepostCount] = useState(post.repostCount ?? 0)
  const [followLoading, setFollowLoading] = useState(false)
  const [replyDialog, setReplyDialog] = useState(false)

  const handleLikeClick = async () => {
    if (!agent) {
      return
    }

    setIsLiked((v) => {
      if (v) {
        setLikeCount((v) => v - 1)
        return false
      } else {
        setLikeCount((v) => v + 1)
        return true
      }
    })
    let post = await onFetch()

    if (post.viewer?.like) {
      await agent.deleteLike(post.viewer?.like)
    } else {
      await agent.like(post.uri, post.cid)
    }

    post = await onFetch()
    setLikeCount(post.likeCount ?? 0)
  }

  const handleRepostClick = async () => {
    if (!agent) {
      return
    }

    setIsReposted((v) => {
      if (v) {
        setRepostCount((v) => v - 1)
        return false
      } else {
        setRepostCount((v) => v + 1)
        return true
      }
    })
    let post = await onFetch()

    if (post.viewer?.repost) {
      await agent.deleteRepost(post.viewer?.repost)
    } else {
      await agent.repost(post.uri, post.cid)
    }

    post = await onFetch()
    setRepostCount(post.repostCount ?? 0)
  }

  const handleFollowClick = async () => {
    if (!agent || followLoading) {
      return
    }

    const { author } = post

    setIsFollowing((v) => !v)

    //my did
    const my_did = agent.session!.did

    setFollowLoading(true)
    const profile = await agent.getProfile({
      actor: author.did,
    })

    if (profile.data.viewer) {
      if (profile.data.viewer.following) {
        setIsFollowing(false)
        await agent.deleteFollow(profile.data.viewer.following)
      } else {
        setIsFollowing(true)
        await agent.follow(author.did)
      }
    }

    await onFetch()
    setFollowLoading(false)
  }

  const handleReplyClick = () => {
    setReplyDialog(true)
  }

  const onReplySubmit = async (postRecord: PostRecordPost) => {
    if (!agent) {
      return
    }

    const parent: ComAtprotoRepoStrongRef.Main = {
      uri: post.uri,
      cid: post.cid,
    }

    postRecord.reply = {
      root: record.reply?.root ?? parent,
      parent,
    }

    await agent.post(postRecord)
  }

  return (
    <>
      <Post
        uri={post.uri.split('/').pop()}
        record={record}
        embed={embed}
        author={post.author}
        createdAt={record.createdAt}
        reasonRepost={reasonRepost}
        hasReply={hasReply}
        replyCount={post.replyCount}
        repostCount={repostCount}
        likeCount={likeCount}
        showReplyCount={showReplyCount}
        showRepostCount={showRepostCount}
        showLikeCount={showLikeCount}
        isLiked={isLiked}
        isReposted={isReposted}
        isFollowing={isFollowing}
        onLikeClick={handleLikeClick}
        onRepostClick={handleRepostClick}
        onFollowClick={handleFollowClick}
        onReplyClick={handleReplyClick}
      />
      <PostModal
        open={replyDialog}
        onClose={() => setReplyDialog(false)}
        onSubmit={onReplySubmit}
        parentPostView={post}
      />
    </>
  )
}
