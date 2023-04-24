import { useAgent } from '@/atoms/agent'
import { BskyAgent } from '@atproto/api'
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TimelineViewProps } from '.'

export type TimelineFetcher = (args: {
  agent: BskyAgent
  cursor?: string
}) => Promise<{
  cursor?: string
  feed: FeedViewPost[]
}> | void

export const useTimelineView = (
  fetchTimeline: TimelineFetcher
): TimelineViewProps => {
  const [agent] = useAgent()
  const [feeds, setFeeds] = useState<FeedViewPost[]>([])
  const [cursor, setCursor] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [newTimeline, setNewTimeline] = useState<FeedViewPost[] | null>()
  const [newCursor, setNewCursor] = useState<string | undefined>()
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFeed = useCallback(async () => {
    if (!agent) {
      return
    }

    setLoading(true)
    const result = await fetchTimeline({
      agent,
      cursor,
    })
    setLoading(false)

    if (!result) {
      return
    }

    if (result.feed[0]?.post.uri === feeds[0]?.post.uri) {
      return
    }
    
    setFeeds((feeds) => [...feeds, ...result.feed])
    setNewCursor(result.cursor)

    if (!result.cursor) {
      setHasMore(false)
    }
  }, [agent, cursor, fetchTimeline])

  const reloadTimeline = useCallback(async () => {
    if (!newTimeline) {
      return
    }

    setFeeds(newTimeline)
    setNewCursor(newCursor)

    setNewTimeline(null)

    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }

    if (!newCursor) {
      setHasMore(false)
    }
  }, [newCursor, newTimeline])

  useEffect(() => {
    const id = setInterval(async () => {
      if (!agent) {
        return
      }

      setLoading(true)
      const result = await fetchTimeline({
        agent,
        cursor,
      })
      setLoading(false)

      if (!result) {
        return
      }

      if (result.feed[0]?.post.uri !== feeds[0]?.post.uri) {
        setNewTimeline(result.feed)
        setNewCursor(result.cursor)
      }
    }, 5000)

    return () => {
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent, feeds])

  useEffect(() => {
    setFeeds([])
    updateFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent])

  return {
    posts: feeds,
    hasMorePosts: hasMore && !loading,
    hasNewTimeline: !!newTimeline,
    onLoadMorePosts: updateFeed,
    onLoadNewTimeline: reloadTimeline,
    containerRef,
  }
}
