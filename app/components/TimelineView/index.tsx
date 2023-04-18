import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Loading, Row, styled } from '@nextui-org/react'
import { ReactNode, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { FeedView } from '../FeedView'

const TimelineContainer = styled('div', {
  maxHeight: '100dvh',
  overflowY: 'scroll',
})

const ReloadButtonContainer = styled('div', {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1,
  top: 32,
  left: 16,
  right: 16,
})

/**
 * TimelineView props.
 */
export type TimelineViewProps = {
  hasNewTimeline?: boolean
  hasMorePosts?: boolean
  onLoadNewTimeline?: () => void
  onLoadMorePosts: () => void
  posts: FeedViewPost[]
  containerRef?: React.RefObject<HTMLDivElement>

  header?: ReactNode
}

/**
 * TimelineView component.
 */
export const TimelineView: React.FC<TimelineViewProps> = (props) => {
  const {
    hasNewTimeline,
    posts,
    containerRef,
    hasMorePosts,
    onLoadMorePosts,
    header,
  } = props
  const onLoadNewTimeline = props.onLoadNewTimeline ?? (() => {})

  return (
    <div style={{ position: 'relative' }}>
      <ReloadButtonContainer
        css={{
          visibility: hasNewTimeline ? 'visible' : 'hidden',
        }}
      >
        <Button shadow color="primary" auto onPress={onLoadNewTimeline}>
          新しい投稿があります
        </Button>
      </ReloadButtonContainer>
      <TimelineContainer ref={containerRef}>
        <InfiniteScroll
          loadMore={onLoadMorePosts}
          hasMore={hasMorePosts}
          loader={
            <div
              key={0}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Loading size="lg" />
            </div>
          }
          threshold={2500}
          useWindow={false}
        >
          {header}
          {posts.map((feed, key) => (
            <Row key={`${feed.post.cid}${key}`} css={{ my: '$8' }}>
              <FeedView feed={feed} />
            </Row>
          ))}
        </InfiniteScroll>
      </TimelineContainer>
    </div>
  )
}
