'use client'

import { Loading } from '@nextui-org/react'
import { NextPage } from 'next'
import { TimelineView } from './components/TimelineView'
import {
  TimelineFetcher,
  useTimelineView,
} from './components/TimelineView/useTimelineView'
import { MainLayout } from './layouts/Main'
import { useRequiredSession } from './lib/hooks/useRequiredSession'

/**
 * Home page.
 */
const HomePage: NextPage = () => {
  const { agent } = useRequiredSession()

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
              borderBottom: '1px solid transparent', // 初期状態は透明の下線を設定
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderBottom = '3px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderBottom = '3px solid transparent' // ホバー解除時に下線を透明に戻す
            }}
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
              borderBottom: '1px solid transparent', // 初期状態は透明の下線を設定
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderBottom = '2px solid #d3d3d3' // ホバー時に下線を表示
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderBottom = '2px solid transparent' // ホバー解除時に下線を透明に戻す
            }}
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
              what's hot
            </div>
          </div>
        </div>
        <TimelineView {...timeline} />
      </div>
    </MainLayout>
  )
}

export default HomePage
