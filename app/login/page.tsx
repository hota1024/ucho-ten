'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NextPage } from 'next'

import { Container } from '@nextui-org/react'

import { useAgent } from '@/atoms/agent'
import { LoginForm } from '@/components/LoginForm'
import { BskyAgent } from '@atproto/api'

/**
 * Login page.
 */
const LoginPage: NextPage = () => {
  const router = useRouter()

  const [, setAgent] = useAgent()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async ({
    identifier,
    password,
  }: {
    identifier: string
    password: string
  }) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const agent = new BskyAgent({
        service: 'https://bsky.social',
      })
      await agent.login({ identifier, password })

      setAgent(agent)

      await router.push('/')
    } catch (error) {
      if (
        error instanceof Error &&
        (error as unknown as { error: string })['error'] ===
          'AuthenticationRequired'
      ) {
        setErrorMessage('ハンドルまたはパスワードが間違っています。')

        setLoading(false)
      } else {
        console.log({ error })
        throw error
      }
    }
  }

  return (
    <>
      <Container
        display="flex"
        alignItems="center"
        justify="center"
        css={{ minHeight: '100dvh' }}
      >
        <LoginForm
          loading={loading}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  )
}

export default LoginPage
