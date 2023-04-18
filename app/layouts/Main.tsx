'use client'

import { ReactNode } from 'react'

import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Loading, Row, styled } from '@nextui-org/react'
import { NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LogoutButton } from '@/components/LogoutButton'
import { PostButton } from '@/components/PostButton'
import { useRequiredSession } from '@/lib/hooks/useRequiredSession'

const Container = styled('div', {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',

  display: 'grid',
  gridTemplateColumns: '300px 600px 300px',
  gap: '$6',
})

const TimelineContainer = styled('div', {
  maxHeight: '100dvh',
  overflowY: 'scroll',
})

const ReloadButtonContainer = styled('div', {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1,
  top: 32,
  left: 16,
  right: 16,
})

const LeftActionsContainer = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  gap: '$8',
})

const UchoTen = styled('div', {
  marginTop: '$8',
  fontSize: '2rem',
  fontWeight: 'bold',
  textAlign: 'center',
})

/**
 * MainLayout props.
 */
export type MainLayoutProps = {
  children?: ReactNode
}

/**
 * MainLayout component.
 */
export const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { children } = props

  return (
    <Container>
      <LeftActionsContainer>
        <UchoTen>Ucho-ten</UchoTen>
        <PostButton />
        <LogoutButton />
      </LeftActionsContainer>
      {children}
      <div></div>
    </Container>
  )
}
