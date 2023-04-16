'use client'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {Loading, Row, styled} from '@nextui-org/react'
import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
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
  gridTemplateColumns: '300px auto 300px',
  gap: '$6',
})

const TimelineContainer = styled('div', {
  maxHeight: '100dvh',
  overflowY: 'scroll',
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
  console.log(feeds.length)

  const updateFeed = useCallback(async () => {
    if (agent) {
      const result = await agent.getTimeline({
        cursor,
      })

      setFeeds((feeds) => [...feeds, ...result.data.feed])
      setCursor(result.data.cursor)

      console.log(cursor, 'fetched feed', result.data.feed)

      if (!result.data.cursor) {
        setHasMore(false)
      }
    }
  }, [agent, cursor])

  useEffect(() => {
    if (window) {
      console.log('initial load')
    }
  }, [])

  if (!agent) {
    return <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'auto'
          }}>
            <Loading size="lg" />
          </div>
  }

  return (
    <Container>
      <LeftActionsContainer>
        <UchoTen>Ucho-ten</UchoTen>
        <PostButton />
        <LogoutButton />
      </LeftActionsContainer>
      <TimelineContainer>
        <InfiniteScroll
          loadMore={updateFeed}
          hasMore={hasMore}
          loader={<div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    <Loading size="lg" />
                  </div>}
          threshold={2500}
          useWindow={false}
        >
          {feeds.map((feed, key) => (
            <Row key={key} css={{ my: '$8' }}>
              <FeedView feed={feed} />
            </Row>
          ))}
        </InfiniteScroll>
      </TimelineContainer>
      <div></div>
    </Container>
  )
}

export default HomePage
