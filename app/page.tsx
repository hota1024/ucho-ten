'use client'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Container } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useAgent } from './atoms/agent'
import { FeedView } from './components/FeedView'

/**
 * Home page.
 */
const HomePage: NextPage = () => {
  const router = useRouter()
  const [agent] = useAgent()

  const [feeds, setFeeds] = useState<FeedViewPost[]>([])
  console.log(feeds)

  const updateFeed = useCallback(async () => {
    if (agent) {
      const result = await agent.getTimeline()
      setFeeds(result.data.feed)
    } else {
      router.replace('/login')
    }
  }, [agent, router])

  useEffect(() => {
    updateFeed()
  }, [updateFeed])

  return (
    <>
      <Container>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            gap: '16px',
          }}
        >
          {feeds.map((feed, key) => (
            <FeedView key={key} feed={feed} />
          ))}
        </div>
      </Container>
    </>
  )
}

export default HomePage
