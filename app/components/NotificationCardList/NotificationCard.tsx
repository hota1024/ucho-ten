import { useAgent } from '@/atoms/agent'
import {
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyGraphFollow,
} from '@atproto/api'
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import { Card, Loading, Text } from '@nextui-org/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons'
import {faUser} from "@fortawesome/free-regular-svg-icons";

/**
 * NotificationCard props.
 */
export type NotificationCardProps = {
  item: Notification
}

/**
 * NotificationCard component.
 */
export const NotificationCard: React.VFC<NotificationCardProps> = (props) => {
  const [agent] = useAgent()
  const { item } = props
  const [post, setPost] = useState<ThreadViewPost | null>(null)

  const fetchNotificationDetails = async () => {
    if (!agent) {
      return
    }

    if (AppBskyFeedLike.isRecord(item.record)) {
      const result = await agent.getPostThread({
        uri: item.record.subject.uri,
      })

      setPost(result.data.thread as ThreadViewPost)
    } else if (AppBskyFeedPost.isRecord(item.record)) {
      const result = await agent.getPostThread({
        uri: item.uri,
      })

      setPost(result.data.thread as ThreadViewPost)
    }
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
              <FontAwesomeIcon icon={faHeart} color={'#F31260'} />
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
              <FontAwesomeIcon icon={faArrowsTurnRight} color={'orange'} />
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
      {AppBskyGraphFollow.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              followed you{' '}
              <FontAwesomeIcon
                icon={faUser}
                color={'green'}
                size={'lg'}
              />
            </Text>
          </Card.Header>
        </>
      )}
    </Card>
  )
}
