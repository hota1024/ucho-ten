import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord } from '@atproto/api'
import {useAgent} from "@/atoms/agent";

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
  const [agent] = useAgent()
  const handleLikeClick = async () => {
    if (!agent) {
      return
    }
    //let r = await agent.like(post.uri, post.cid)
    let is_already_like = await agent.getLikes({uri: post.uri, cid: post.cid})
    let my_did = await agent.session?.did
    console.log(is_already_like)
    console.log(my_did)
    for (let i = 0; i < is_already_like.data.likes.length; i++) {
      console.log(is_already_like.data.likes[i].did)
      if(is_already_like.data.likes[i].actor.did !== my_did) {
        await agent.like(post.uri, post.cid)
        return
      }
    }

  }
  const handleRepostClick = async () => {
    if (!agent) {
      return
    }
    let reposter_list = await agent.getRepostedBy({uri: post.uri, cid: post.cid})
    console.log()
    let repost_result = await agent.repost(post.uri, post.cid)
    console.log(repost_result)
    return
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
      repostCount={post.repostCount}
      likeCount={post.likeCount}
      showReplyCount={showReplyCount}
      showRepostCount={showRepostCount}
      showLikeCount={showLikeCount}
      isLiked={true}
      isReposted={true}
      onLikeClick={() => {handleLikeClick()}}
      onRepostClick={() => {handleRepostClick()}}
    />
  )
}
