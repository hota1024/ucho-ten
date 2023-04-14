'use client'

import { BskyAgent } from '@atproto/api'
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Container } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useAgent } from './atoms/agent'
import { FeedView } from './components/FeedView'

const useRequiredSession = () => {
  const router = useRouter()
  const [agent, setAgent] = useAgent()

  const restoreSession = useCallback(async () => {
    const sessionJson = localStorage.getItem('session')

    if (!sessionJson) {
      router.push('/login')
      return
    }

    const session = JSON.parse(sessionJson)
    const agent = new BskyAgent({ service: 'https://bsky.social' })

    try {
      await agent.resumeSession(session)

      setAgent(agent)
    } catch {
      router.push('/login')
    }
  }, [router, setAgent])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return { agent }
}

/**
 * Home page.
 */
const HomePage: NextPage = () => {
  const { agent } = useRequiredSession()
  console.log(agent)

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
