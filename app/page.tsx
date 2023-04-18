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

  const fetchTimeline: TimelineFetcher = ({ agent }) => {
    if (!agent) {
      return
    }

    return agent.getTimeline().then((result) => result.data)
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
      <TimelineView {...timeline} />
    </MainLayout>
  )
}

export default HomePage
