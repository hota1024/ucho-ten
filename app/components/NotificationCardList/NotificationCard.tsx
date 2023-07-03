import { useAgent } from '@/atoms/agent'
import {
  AppBskyFeedDefs,
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyGraphFollow,
} from '@atproto/api'
import {
  ThreadViewPost,
  isThreadViewPost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Card,
  Loading,
  styled,
  Text,
  Row,
  Col,
  Dropdown,
} from '@nextui-org/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faCheck as faCheckRegular,
  faCheck as faCheckSolid,
  faCircle as faCircleRegular,
  faCheckCircle as faCheckCircleSolid,
} from '@fortawesome/free-solid-svg-icons'
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons'
import { faComment, faUser } from '@fortawesome/free-regular-svg-icons'
import { faRetweet as faRetweetSolid } from '@fortawesome/free-solid-svg-icons'
import { PostModal } from '../PostModal'

/**
 * NotificationCard props.
 */
export type NotificationCardProps = {
  item: Notification
  onReplyClick?: (post: PostView) => void
  onQuoteRepostClick?: (post: PostView) => void
}

/**
 * NotificationCard component.
 */

const PostAction = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  fontWeight: '$medium',
  color: '$gray700',
  //cursor: 'pointer',
})

export const NotificationCard: React.FC<NotificationCardProps> = (props) => {
  const [agent] = useAgent()
  const { item } = props
  const onReplyClick = props.onReplyClick ?? (() => {})
  const onQuoteRepostClick = props.onQuoteRepostClick ?? (() => {})

  const [post, setPost] = useState<ThreadViewPost | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [repostCount, setRepostCount] = useState(0)
  const [isReposted, setIsReposted] = useState(false)
  const [isReactionProcessing, setIsReactionProcessing] = useState(false)
  const [replyDialog, setReplyDialog] = useState(false)
  const [repostDialog, setRepostDialog] = useState(false)
  //console.log(post)
  //console.log(isLiked)

  const fetchNotificationDetails = async () => {
    if (!agent) {
      return
    }

    try {
      if (AppBskyFeedLike.isRecord(item.record)) {
        const result = await agent.getPostThread({
          uri: item.record.subject.uri,
        })

        setPost(result.data.thread as ThreadViewPost)
      } else if (AppBskyFeedPost.isRecord(item.record)) {
        const result = await agent.getPostThread({
          uri: item.uri,
        })

        if (!AppBskyFeedDefs.isThreadViewPost(result.data.thread)) {
          return
        }

        console.log(result)
        setIsLiked(!!result.data.thread?.post?.viewer?.like)
        setIsReposted(!!result.data.thread?.post?.viewer?.repost)

        setPost(result.data.thread as ThreadViewPost)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLikeClick = async () => {
    if (!agent) {
      return
    }
    console.log(item)

    //非同期のlikeがまだ処理中だったらreturn
    if (isReactionProcessing) {
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

    setIsReactionProcessing(true)
    const result = await agent.getPostThread({
      uri: item.uri,
    })

    if (!AppBskyFeedDefs.isThreadViewPost(result.data.thread)) {
      return
    }

    if (result?.data?.thread?.post?.viewer?.like) {
      await agent.deleteLike(result?.data?.thread?.post?.viewer?.like)
      setIsReactionProcessing(false)
    } else {
      await agent.like(
        result?.data?.thread?.post?.uri,
        result?.data?.thread?.post?.cid
      )
      setIsReactionProcessing(false)
    }
    setIsReactionProcessing(false)
  }

  const handleRepostClick = async () => {
    if (!agent) {
      return
    }

    //非同期のlikeがまだ処理中だったらreturn
    if (isReactionProcessing) {
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

    const result = await agent.getPostThread({
      uri: item.uri,
    })

    if (!AppBskyFeedDefs.isThreadViewPost(result.data.thread)) {
      return
    }

    if (result?.data?.thread?.post?.viewer?.like) {
      await agent.deleteRepost(result?.data?.thread?.post?.viewer?.like)
    } else {
      await agent.repost(
        result?.data?.thread?.post?.uri,
        result?.data?.thread?.post?.cid
      )
    }
  }

  const handleReplyClick = () => {
    onReplyClick(item)
  }

  const handleQuoteRepostClick = () => {
    onQuoteRepostClick(item)
  }

  useEffect(() => {
    fetchNotificationDetails()
  }, [agent, item])

  return (
    <Card variant="bordered" css={{ my: 4 }}>
      {AppBskyFeedLike.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              liked your post{' '}
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ maxWidth: '300px' }}>
            {post ? (
              <Text>
                {AppBskyFeedPost.isRecord(post.post.record)
                  ? post.post.record.text
                  : '投稿が取得できません。'}
              </Text>
            ) : (
              <Loading />
            )}
          </Card.Body>
        </>
      )}
      {AppBskyFeedPost.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              {item.reason === 'reply' && 'replied to your post  '}
              {item.reason === 'mention' && 'mentioned to you  '}
              <FontAwesomeIcon icon={faArrowsTurnRight} color={'orange'} />
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ maxWidth: '300px' }}>
            {post ? (
              <>
                <Text>
                  {AppBskyFeedPost.isRecord(post.post.record)
                    ? post.post.record.text
                    : '投稿が取得できません。'}
                </Text>
                <Row>
                  <Row css={{ mt: '$3' }} align="center">
                    <Col>
                      <PostAction>
                        <FontAwesomeIcon
                          onClick={handleReplyClick}
                          icon={faComment}
                          color="#787F85"
                          style={{ cursor: 'pointer' }}
                        />
                      </PostAction>
                    </Col>
                    <Col>
                      <Dropdown placement="bottom-left">
                        <Dropdown.Trigger>
                          <PostAction>
                            <FontAwesomeIcon
                              //onClick={onRepostClick}
                              icon={faRetweetSolid}
                              //color="#787F85"
                              color={isReposted ? '#36BA7A' : '#787F85'}
                              style={{ cursor: 'pointer' }}
                            />
                          </PostAction>
                        </Dropdown.Trigger>
                        <Dropdown.Menu
                          onAction={(key) => {
                            if (key === 'repost') {
                              handleRepostClick()
                            } else if (key === 'quoteRepost') {
                              handleQuoteRepostClick()
                            }
                          }}
                        >
                          <Dropdown.Item key="repost">
                            {!isReposted && <Text>Repost</Text>}
                            {isReposted  && (
                              <Text color={'error'}>UnRepost</Text>
                            )}
                          </Dropdown.Item>
                          <Dropdown.Item key="quoteRepost">
                            <Text>Quote Repost</Text>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col>
                      <PostAction>
                        <FontAwesomeIcon
                          onClick={
                            !isReactionProcessing ? handleLikeClick : undefined
                          }
                          icon={isLiked ? faCheckCircleSolid : faCircleRegular}
                          color={isLiked ? `rgba(49,171,183,1)` : '#787F85'}
                          style={{ cursor: 'pointer' }}
                        />
                      </PostAction>
                    </Col>
                  </Row>
                </Row>
              </>
            ) : (
              <Loading />
            )}
          </Card.Body>
        </>
      )}
      {AppBskyGraphFollow.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              followed you{' '}
              <FontAwesomeIcon icon={faUser} color={'green'} size={'lg'} />
            </Text>
          </Card.Header>
        </>
      )}
    </Card>
  )
}
