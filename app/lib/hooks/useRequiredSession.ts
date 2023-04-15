import { useAgent } from '@/atoms/agent'
import { BskyAgent } from '@atproto/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

export const useRequiredSession = () => {
  const router = useRouter()
  const [agent, setAgent] = useAgent()

  const restoreSession = useCallback(async () => {
    const sessionJson = localStorage.getItem('session')

    if (!sessionJson) {
      if (router) {
        router.push('/login')
      } else {
        location.href = '/login'
      }
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
