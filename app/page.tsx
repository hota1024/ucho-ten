'use client'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Loading, Row, styled } from '@nextui-org/react'
import { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FeedView } from './components/FeedView'
import { LogoutButton } from './components/LogoutButton'
import { PostButton } from './components/PostButton'
import { useRequiredSession } from './lib/hooks/useRequiredSession'
import InfiniteScroll from 'react-infinite-scroller'

const Container = styled('div', {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',

  display: 'grid',
  gridTemplateColumns: '300px 600px 300px',
  gap: '$6',
})

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

const LeftActionsContainer = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  gap: '$8',
})

const UchoTen = styled('div', {
  marginTop: '$8',
  fontSize: '2rem',
  fontWeight: 'bold',
  textAlign: 'center',
})

/**
 * Home page.
 */
const HomePage: NextPage = () => {
  const { agent } = useRequiredSession()

  const [feeds, setFeeds] = useState<FeedViewPost[]>([])
  const [cursor, setCursor] = useState<string>()
  const [hasMore, setHasMore] = useState(true)
  const [newTimeline, setNewTimeline] = useState<FeedViewPost[] | null>()
  const [newCursor, setNewCursor] = useState<string | undefined>()
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFeed = useCallback(async () => {
    if (agent) {
      const result = await agent.getTimeline({
        cursor,
      })

      setFeeds((feeds) => [...feeds, ...result.data.feed])
      setCursor(result.data.cursor)

      if (!result.data.cursor) {
        setHasMore(false)
      }
    }
  }, [agent, cursor])

  const reloadTimeline = useCallback(async () => {
    if (!agent) {
      return
    }

    if (!newTimeline) {
      return
    }

    console.log('reload', newTimeline)

    setFeeds(newTimeline)
    setCursor(newCursor)

    setNewTimeline(null)

    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }

    if (!newCursor) {
      setHasMore(false)
    }
  }, [agent, newCursor, newTimeline])

  useEffect(() => {
    if (!agent) {
      return
    }

    const id = setInterval(async () => {
      const result = await agent.getTimeline()

      console.log(result.data.feed[0].post.uri, feeds[0].post.uri)
      if (result.data.feed[0].post.uri !== feeds[0].post.uri) {
        setNewTimeline(result.data.feed)
        setNewCursor(result.data.cursor)
      }
    }, 10000)

    return () => {
      clearInterval(id)
    }
  }, [agent, feeds])

  useEffect(() => {
    console.log({ feeds })
  }, [feeds])

  if (!agent) {
    return (
      <div
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
    )
  }

  return (
    <Container>
      <LeftActionsContainer>
        <UchoTen>Ucho-ten</UchoTen>
        <PostButton />
        <LogoutButton />
      </LeftActionsContainer>

      <div style={{ position: 'relative' }}>
        <ReloadButtonContainer>
          <Button
            shadow
            color="primary"
            auto
            css={{
              backgroundFilter: 'blur(16px)',
              visibility: newTimeline ? 'visible' : 'hidden',
            }}
            onPress={reloadTimeline}
          >
            新しい投稿があります
          </Button>
        </ReloadButtonContainer>
        <TimelineContainer ref={containerRef}>
          <InfiniteScroll
            loadMore={updateFeed}
            hasMore={hasMore}
            loader={<>loading...</>}
            threshold={2500}
            useWindow={false}
          >
            {feeds.map((feed, key) => (
              <Row
                key={`${feed.post.cid}${feed.reason?.by ?? 'no-reason-by'}${
                  feed.reply?.parent.cid ?? 'no-reply-parent'
                }`}
                css={{ my: '$8' }}
              >
                <FeedView feed={feed} />
              </Row>
            ))}
          </InfiniteScroll>
        </TimelineContainer>
      </div>

      <div></div>
    </Container>
  )
}

export default HomePage
