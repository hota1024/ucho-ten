'use client'

import { useAgent } from '@/atoms/agent'
import { MainLayout } from '@/layouts/Main'
import { useRequiredSession } from '@/lib/hooks/useRequiredSession'
import { NextPage } from 'next'
import { useCallback, useEffect } from 'react'

/**
 * Notification page.
 */
const NotificationPage = () => {
  const { agent } = useRequiredSession()

  const fetchNotifications = useCallback(async () => {
    if (!agent) {
      return
    }

    const result = await agent.listNotifications()
    console.log({ result })
  }, [agent])

  useEffect(() => {
    fetchNotifications()
  }, [agent, fetchNotifications])

  return (
    <>
      <MainLayout>
        <div style={{ minHeight: '100dvh' }}></div>
      </MainLayout>
    </>
  )
}

export default NotificationPage
