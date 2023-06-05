import {
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyGraphFollow,
} from '@atproto/api'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import { Card, Container, Row, Text } from '@nextui-org/react'
import Link from 'next/link'
import { NotificationCard } from './NotificationCard'
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'

/**
 * NotificationCardList props.
 */
export type NotificationCardListProps = {
  notifications: Notification[]
  onReplyClick?: (post: PostView) => void
  onQuoteRepostClick?: (post: PostView) => void
}

/**
 * NotificationCardList component.
 */
export const NotificationCardList: React.VFC<NotificationCardListProps> = (
  props
) => {
  const { notifications, onReplyClick, onQuoteRepostClick } = props

  return (
    <Container gap={1}>
      {notifications.map((item, key) => (
        <>
          {AppBskyFeedPost.isRecord(item.record) && (
            <NotificationCard
              key={key}
              item={item}
              onReplyClick={onReplyClick}
              onQuoteRepostClick={onQuoteRepostClick}
            />
          )}
          {AppBskyGraphFollow.isRecord(item.record) && (
            <NotificationCard
              key={key}
              item={item}
              onReplyClick={onReplyClick}
              onQuoteRepostClick={onQuoteRepostClick}
            />
          )}
        </>
      ))}
    </Container>
  )
}
