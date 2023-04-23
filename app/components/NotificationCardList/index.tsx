import { AppBskyFeedLike } from '@atproto/api'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import { Card, Container, Row, Text } from '@nextui-org/react'
import Link from 'next/link'
import { NotificationCard } from './NotificationCard'

/**
 * NotificationCardList props.
 */
export type NotificationCardListProps = {
  notifications: Notification[]
}

/**
 * NotificationCardList component.
 */
export const NotificationCardList: React.VFC<NotificationCardListProps> = (
  props
) => {
  const { notifications } = props

  return (
    <Container gap={1}>
      {notifications.map((item, key) => (
        <NotificationCard key={key} item={item} />
      ))}
    </Container>
  )
}
