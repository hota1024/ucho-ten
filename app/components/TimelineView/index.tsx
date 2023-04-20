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
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <div
              style={{
                  height: '5vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '18px'
              }}
          >
              <div
                  style={{
                      flex: 1,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent' // 初期状態は透明の下線を設定
                  }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.borderBottom = '3px solid #d3d3d3'; // ホバー時に下線を表示
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.borderBottom = '3px solid transparent'; // ホバー解除時に下線を透明に戻す
                  }}
              >
                  <div
                      style={{
                          borderRight: '1px solid #d3d3d3',
                          paddingRight: '0.5rem',
                          width: '100%',
                      }}
                  >
                      Timeline
                  </div>
              </div>
              <div
                  style={{
                      flex: 1,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent' // 初期状態は透明の下線を設定
                  }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.borderBottom = '2px solid #d3d3d3'; // ホバー時に下線を表示
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.borderBottom = '2px solid transparent'; // ホバー解除時に下線を透明に戻す
                  }}
              >
                  <div
                      style={{
                          borderLeft: '1px solid #d3d3d3',
                          borderRight: '1px solid #d3d3d3',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem',
                          width: '100%',
                      }}
                  >
                      青空
                  </div>
              </div>
              <div
                  style={{
                      flex: 1,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '2px solid transparent',
                  }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.borderBottom = '2px solid #d3d3d3';
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.borderBottom = '2px solid transparent';
                  }}
              >
                  <div
                      style={{
                          borderLeft: '1px solid #d3d3d3',
                          paddingLeft: '0.5rem',
                          width: '100%',
                      }}
                  >
                      what's hot
                  </div>
              </div>
          </div>




                              <ReloadButtonContainer
              css={{
                  visibility: hasNewTimeline ? 'visible' : 'hidden',
              }}
          >
              <Button shadow color="primary" auto onPress={onLoadNewTimeline}>
                  新しい投稿があります
              </Button>
          </ReloadButtonContainer>
          <TimelineContainer ref={containerRef} style={{ height: '97vh', overflowY: 'auto' }}>
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
                              height: 'calc(100% - 3vh)',
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
