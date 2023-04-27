'use client'

import { useState } from 'react'
import { NextPage } from 'next'

import {Container, Card, Image, Spacer, Text} from '@nextui-org/react'

import { LoginForm } from '@/components/LoginForm'
import { BskyAgent } from '@atproto/api'

/**
 * Login page.
 */
const LoginPage = () => {
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
        css={{ minHeight: '100dvh', flexFlow: 'column' }}
      >
        <Image src="/images/Logo/ucho-ten.svg" height="64px" alt="logo" />
        <Spacer y={1} />
        <LoginForm
          loading={loading}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
        />
        <Card css={{ mt: '$10' , width: '420px'}}>
          <Card.Body>
            <Text css={{textAlign:'center'}}>
              We recommend using the App Passwords. <a href="https://github.com/bluesky-social/atproto-ecosystem/blob/main/app-passwords.md" target="_blank" rel="noopener noreferrer">Read More</a>.
            </Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default LoginPage
