'use client'

import { Loading } from '@nextui-org/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { TimelineView } from './components/TimelineView'
import {
  TimelineFetcher,
  useTimelineView,
} from './components/TimelineView/useTimelineView'
import { MainLayout } from './layouts/Main'
import { useRequiredSession } from './lib/hooks/useRequiredSession'

const Timeline = () => {
  const fetchTimeline: TimelineFetcher = ({ agent, cursor }) => {
    if (!agent) {
      return
    }

    return agent
      .getTimeline({
        cursor,
      })
      .then((result) => result.data)
  }

  const timeline = useTimelineView(fetchTimeline)

  return <TimelineView {...timeline} />
}

const BlueskyTimeline = () => {
  const fetchTimeline: TimelineFetcher = async ({ agent, cursor }) => {
    const res1 = await fetch(
      'https://search.bsky.social/search/posts?q=青空'
    ).then((r) => r.json())

    const res2 = await fetch(
      'https://search.bsky.social/search/posts?q=bluesky'
    ).then((r) => r.json())

    const res3 = await fetch(
      'https://search.bsky.social/search/posts?q=sky'
    ).then((r) => r.json())
    let res = [...res1, ...res2, ...res3]
    //tidが被ったものを削除
    res = res.filter(
      (x: any, i: number, self: any) =>
        self.findIndex((y: any) => y.tid === x.tid) === i
    )

    //resの中身のpost.createdAtが新しい順に並び替え
    res.sort((a, b) => {
      if (a.post.createdAt > b.post.createdAt) {
        return -1
      } else {
        return 1
      }
    })
    console.log(res)

    let data: any = await Promise.all(
      res.map((p: any) =>
        agent
          .getPostThread({ uri: `at://${p.user.did}/${p.tid}` })
          .then((p) => p)
          .catch(() => null)
      )
    )
    data = data.filter(
      (v: any) =>
        !!v && v.data.thread.post.embed?.$type === 'app.bsky.embed.images#view'
    )

    console.log(data)
    const feed = data.map((v: any) => ({
      post: v.data.thread.post,
    }))

    console.log({ feed })

    return {
      feed,
    }
  }

  const timeline = useTimelineView(fetchTimeline)

  return <TimelineView {...timeline} />
}

const LikeFeed = () => {
    const fetchTimeline: TimelineFetcher = ({ agent, cursor }) => {
        if (!agent) {
        return
        }

        return agent
        .app.bsky.feed.getFeed({
          cursor: cursor,
          limit: 20,
          feed: 'at://did:plc:txandrhc7afdozk6a2itgltm/app.bsky.feed.generator/aaapc6cjz4c3e',
        })
        .then((result) => result.data)
    }

    const timeline = useTimelineView(fetchTimeline)

    return <TimelineView {...timeline} />
}

/**
 * Home page.
 */
const HomePage = () => {
  const { agent } = useRequiredSession()
  const [tab, setTab] = useState<'home' | 'bluesky' | 'likefeed' >('home')

  if (!agent) {
    return (
      <div
        style={{
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <MainLayout>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <div
          style={{
            height: '5vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: '18px',
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
              borderBottom:
                tab === 'home' ? '3px solid #d3d3d3' : '1px solid transparent', // 初期状態は透明の下線を設定
            }}
            onMouseOver={(e) => {
              if (tab === 'home') {
                return
              }
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
              if (tab === 'home') {
                return
              }
              e.currentTarget.style.borderBottom = '2px solid transparent' // ホバー解除時に下線を透明に戻す
            }}
            onClick={() => setTab('home')}
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
              borderBottom:
                tab === 'bluesky'
                  ? '3px solid #d3d3d3'
                  : '1px solid transparent', // 初期状態は透明の下線を設定
            }}
            onMouseOver={(e) => {
              if (tab === 'bluesky') {
                return
              }
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
              if (tab === 'bluesky') {
                return
              }
              e.currentTarget.style.borderBottom = '2px solid transparent' // ホバー解除時に下線を透明に戻す
            }}
            onClick={() => setTab('bluesky')}
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
              Bluesky
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
                borderBottom:
                    tab === 'likefeed'
                        ? '3px solid #d3d3d3'
                        : '1px solid transparent', // 初期状態は透明の下線を設定
            }}
            onMouseOver={(e) => {
              if (tab === 'likefeed') {
                  return
              }
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3'
            }}
            onMouseOut={(e) => {
              if (tab === 'likefeed') {
                  return
              }
              e.currentTarget.style.borderBottom = '2px solid transparent'
            }}
            onClick={() => setTab('likefeed')}
          >
            <div
              style={{
                borderLeft: '1px solid #d3d3d3',
                paddingLeft: '0.5rem',
                width: '100%',
              }}
            >
              {`public (JP feed)`}
            </div>
          </div>
        </div>

        {tab === 'home' && <Timeline />}
        {tab === 'bluesky' && <BlueskyTimeline />}
        {tab === 'likefeed' && <LikeFeed />}
      </div>
    </MainLayout>
  )
}

export default HomePage
