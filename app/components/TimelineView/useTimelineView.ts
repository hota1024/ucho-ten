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
  const [hasNewTimeline, setHasNewTimeline] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFeed = useCallback(
    async (turn: number, loadTop = false) => {
      if (!agent) {
        return
      }

      setLoading(true)
      const result = await fetchTimeline({
        agent,
        cursor: loadTop ? undefined : cursor,
      })
      setLoading(false)

      if (!result) {
        return
      }

      console.log({ loadTop }, 'current', cursor, 'new', result.cursor)

      // if (result.feed[0]?.post.uri === feeds[0]?.post.uri) {
      //   return
      // }

      if (loadTop) {
        setFeeds(() => [...result.feed])
      } else {
        setFeeds((feeds) => [...feeds, ...result.feed])
      }

      if (cursor === result.cursor) {
        setCursor(undefined)
      } else {
        setCursor(result.cursor)
      }

      if (!result.cursor) {
        setHasMore(false)
      }
    },
    [agent, cursor, fetchTimeline]
  )

  const reloadTimeline = useCallback(async () => {
    updateFeed(0, true)
    setHasNewTimeline(false)

    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [updateFeed])

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
        setHasNewTimeline(true)
      }
    }, 10000)

    return () => {
      clearInterval(id)
    }
  }, [agent, feeds, cursor, fetchTimeline])

  useEffect(() => {
    updateFeed(0, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent])

  return {
    posts: feeds,
    hasMorePosts: hasMore && !loading,
    hasNewTimeline,
    onLoadMorePosts: updateFeed,
    onLoadNewTimeline: reloadTimeline,
    containerRef,
  }
}
