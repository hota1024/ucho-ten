import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord, ComAtprotoRepoStrongRef } from '@atproto/api'
import { useAgent } from '@/atoms/agent'
import { useCallback, useState } from 'react'
import { PostModal } from '../PostModal'
import { PostRecordPost } from '@/types/posts'
import { useShowPostNumbers } from '@/atoms/settings'

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
  const [myDid, setMyDid] = useState<string | undefined>(agent?.session!.did)
  const [isMuted, setIsMuted] = useState(!!post.viewer?.mute)
  const [isLiked, setIsLiked] = useState(!!post.viewer?.like)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [isReposted, setIsReposted] = useState(!!post.viewer?.repost)
  const [isFollowing, setIsFollowing] = useState(
    !!post.author.viewer?.following
  )
  const [repostCount, setRepostCount] = useState(post.repostCount ?? 0)
  const [followLoading, setFollowLoading] = useState(false)
  const [replyDialog, setReplyDialog] = useState(false)
  const [repostDialog, setRepostDialog] = useState(false)
  const [showPostNumbers] = useShowPostNumbers()

  if (
    post.cid === 'bafyreievvr466th5wonvdoxazkbly6ziide2s7hjiu35poxeicfnh6vlfa'
  ) {
  }

  const handleLikeClick = useCallback(async () => {
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
    let fetchedPost = await onFetch()

    if (fetchedPost.viewer?.like) {
      await agent.deleteLike(fetchedPost.viewer?.like)
    } else {
      await agent.like(post.uri, post.cid)
    }

    await onFetch()
  }, [agent, onFetch])

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

  const handleQuoteRepostClick = () => {
    setRepostDialog(true)
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

  const onRepostSubmit = async (postRecord: PostRecordPost) => {
    if (!agent) {
      return
    }

    if (!postRecord.embed) {
      postRecord.embed = {} as unknown as AppBskyEmbedRecord.Main
    }

    postRecord.embed = {
      $type: 'app.bsky.embed.record',
      record: post,
    }

    await agent.post(postRecord)
  }

  return (
    <>
      <Post
        myDid={myDid}
        postUri={post.uri.split('/').pop()}
        record={record}
        embed={embed}
        author={post.author}
        createdAt={record.createdAt}
        reasonRepost={reasonRepost}
        hasReply={hasReply}
        replyCount={post.replyCount}
        repostCount={repostCount}
        likeCount={likeCount}
        showReplyCount={showPostNumbers}
        showRepostCount={showPostNumbers}
        showLikeCount={showPostNumbers}
        isMuted={isMuted}
        isLiked={isLiked}
        isReposted={isReposted}
        isFollowing={isFollowing}
        onLikeClick={handleLikeClick}
        onRepostClick={handleRepostClick}
        onFollowClick={handleFollowClick}
        onReplyClick={handleReplyClick}
        onQuoteRepostClick={handleQuoteRepostClick}
      />
      <PostModal
        open={replyDialog}
        onClose={() => setReplyDialog(false)}
        onSubmit={onReplySubmit}
        parentPostView={post}
        title="Reply"
        submitText="Reply"
      />
      <PostModal
        open={repostDialog}
        onClose={() => setRepostDialog(false)}
        onSubmit={onRepostSubmit}
        parentPostView={post}
        title="Quote Repost"
        submitText="Quote Repost"
      />
    </>
  )
}
