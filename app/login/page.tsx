'use client'

import { useState } from 'react'
import { NextPage } from 'next'

import { Container } from '@nextui-org/react'

import { LoginForm } from '@/components/LoginForm'
import { BskyAgent } from '@atproto/api'

/**
 * Login page.
 */
const LoginPage: NextPage = () => {
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

      if (agent.session) {
        localStorage.setItem('session', JSON.stringify(agent.session))
      }

      location.href = '/'
    } catch (error) {
      if (
        error instanceof Error &&
        (error as unknown as { error: string })['error'] ===
          'AuthenticationRequired'
      ) {
        setErrorMessage('ハンドルまたはパスワードが間違っています。')

        setLoading(false)
      } else {
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
