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
    const res = await fetch(
      'https://search.bsky.social/search/posts?q=青空'
    ).then((r) => r.json())

    let data = await Promise.all(
      res.map((p:any) =>
        agent
          .getPostThread({ uri: `at://${p.user.did}/${p.tid}` })
          .then((p) => p)
          .catch(() => null)
      )
    )
    data = data.filter(
      (v) =>
        !!v && v.data.thread.post.embed?.$type === 'app.bsky.embed.images#view'
    )

    console.log(data)
    const feed = data.map((v) => ({
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

/**
 * Home page.
 */
const HomePage = () => {
  const { agent } = useRequiredSession()
  const [tab, setTab] = useState<'home' | 'bluesky'>('home')

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
                if(tab === 'home') {
                    return
                }
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
                if(tab === 'home') {
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
                if(tab === 'bluesky') {
                    return
                }
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
                if(tab === 'bluesky') {
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
              borderBottom: '2px solid transparent',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderBottom = '2px solid transparent'
            }}
          >
            <div
              style={{
                borderLeft: '1px solid #d3d3d3',
                paddingLeft: '0.5rem',
                width: '100%',
              }}
            >
              {`what's hot(工事中)`}
            </div>
          </div>
        </div>

        {tab === 'home' && <Timeline />}
        {tab === 'bluesky' && <BlueskyTimeline />}
      </div>
    </MainLayout>
  )
}

export default HomePage
