'use client'

import { BskyAgent } from '@atproto/api'
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Button,
  Container,
  Grid,
  Modal,
  Row,
  Spacer,
  Textarea,
} from '@nextui-org/react'
import { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { FeedView } from './components/FeedView'
import { PostButton } from './components/PostButton'
import { useRequiredSession } from './lib/hooks/useRequiredSession'

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
      <Grid.Container>
        <Grid xs={2}>
          <PostButton />
        </Grid>
        <Grid xs={6}>
          <Container>
            {feeds.map((feed, key) => (
              <Row key={key} css={{ my: '$8' }}>
                <FeedView feed={feed} />
              </Row>
            ))}
          </Container>
        </Grid>
      </Grid.Container>
    </Container>
  )
}

export default HomePage
