'use client'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Card, Container, User } from '@nextui-org/react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useAgent } from './atoms/agent'
import { NewLineToBreak } from './components/NewLineToBreak'
import { PostViewContent } from './components/PostView/PostViewContent'

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
        {feeds.map((feed) => (
          <Card key={feed.post.cid} css={{ mb: '$8' }}>
            <Card.Header>
              <User
                src={feed.post.author.avatar}
                name={feed.post.author.displayName}
                description={feed.post.author.handle}
              />
            </Card.Header>

            <Card.Body>
              <PostViewContent post={feed.post} />
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  )
}

export default HomePage
