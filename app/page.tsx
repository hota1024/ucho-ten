'use client'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Row, styled } from '@nextui-org/react'
import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { FeedView } from './components/FeedView'
import { LogoutButton } from './components/LogoutButton'
import { PostButton } from './components/PostButton'
import { useRequiredSession } from './lib/hooks/useRequiredSession'

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

  const updateFeed = useCallback(async () => {
    if (agent) {
      const result = await agent.getTimeline()
      setFeeds(result.data.feed)
      console.log('fetched feed', result.data.feed)
    }
  }, [agent])

  useEffect(() => {
    updateFeed()
  }, [updateFeed])

  if (!agent) {
    return <>loading...</>
  }

  return (
    <Container>
      <LeftActionsContainer>
        <UchoTen>Ucho-ten</UchoTen>
        <PostButton />
        <LogoutButton />
      </LeftActionsContainer>
      <TimelineContainer>
        {feeds.map((feed, key) => (
          <Row key={key} css={{ my: '$8' }}>
            <FeedView feed={feed} />
          </Row>
        ))}
      </TimelineContainer>
      <div></div>
    </Container>
  )
}

export default HomePage
