'use client'

import {
  Button,
  Card,
  Col,
  Loading,
  Row,
  Spacer,
  Text,
  User,
} from '@nextui-org/react'
import { NextPage } from 'next'
import { TimelineView } from '@/components/TimelineView'
import {
  TimelineFetcher,
  useTimelineView,
} from '@/components/TimelineView/useTimelineView'
import { MainLayout } from '@/layouts/Main'
import { useRequiredSession } from '@/lib/hooks/useRequiredSession'
import React, { useCallback, useEffect, useState } from 'react'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import reactStringReplace from 'react-string-replace'
import Link from 'next/link'
import Zoom from 'react-medium-image-zoom'


/**
 * Home page.
 */
const ProfilePage = ({ params }: { params: { identifier: string } }) => {
  const { agent } = useRequiredSession()
  const [profile, setProfile] = useState<ProfileViewDetailed>()
  const [followHover, setFollowHover] = useState(false)
  const [isFollowing, setIsFollowing] = useState(!!profile?.viewer?.following)
  const [followLoading, setFollowLoading] = useState(false)

  const fetchTimeline: TimelineFetcher = ({ agent }) => {
    if (!agent) {
      return
    }

    return agent
      .getAuthorFeed({
        actor: params.identifier,
      })
      .then((result) => result.data)
  }

  const timeline = useTimelineView(fetchTimeline)

  const fetchProfile = useCallback(async () => {
    if (!agent) {
      return
    }

    const result = await agent.getProfile({
      actor: params.identifier,
    })
    console.log(result)

    setProfile(result.data)
    setIsFollowing(!!result.data?.viewer?.following)
  }, [agent, params.identifier])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

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

  const handleFollowClick = async () => {
    if (!agent || followLoading) {
      return
    }

    const following = profile?.viewer?.following
    setFollowLoading(true)

    if (following) {
      setIsFollowing(false)
      await agent.deleteFollow(following)
    } else if (profile?.did) {
      setIsFollowing(true)
      await agent.follow(profile.did)
    }

    await fetchProfile()
    setFollowLoading(false)
  }
  const newlineCodeToBr = (text: string) => {
    //return text.split('\n').map((line, i) => { return <span key={i}>{line}<br /></span> })
    return text.split('\n').map((line, i) => (
      <p key={i}>
        {reactStringReplace(
          line,
            /(@[a-zA-Z0-9-.]+|https?:\/\/[a-zA-Z0-9-./])/g,
          (match, j) => {
            if (match.startsWith('@')) {
              const domain = match.substring(1) // remove "@" symbol from match
              return (
                <Link key={j} href={`/profile/${domain}`}>
                  {match}
                </Link>
              )
            } else if (match.startsWith('http')) {
              return (
                <a
                  key={j}
                  href={match}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {match}
                </a>
              )
            } else if (match.startsWith('tw@')) {
              const domain = match.substring(3) // remove "tw@" symbol from match
              return (
                <a
                  key={j}
                  href={`https://twitter.com/${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {match}
                </a>
              )
            } else {
              return match
            }
          }
        )}
      </p>
    ))
  }

  return (
    <MainLayout>
      <TimelineView
        {...timeline}
        header={
          profile ? (
            <Card css={{ my: '$10' }} variant="bordered">
              {profile.banner && (
                  <Zoom>
                    <Card.Image src={profile.banner} showSkeleton />
                  </Zoom>
              )}
              <Card.Header css={{ px: 0, flexFlow: 'column' }}>
                <Row align="center" justify="space-between">
                  <Col>
                    <User
                      src={profile.avatar}
                      squared
                      size="xl"
                      name={profile.displayName}
                      description={`@${profile.handle}`}
                    />
                  </Col>
                  <Button
                    rounded
                    bordered={isFollowing}
                    color={isFollowing && followHover ? 'error' : 'primary'}
                    onMouseOver={() => setFollowHover(true)}
                    onMouseLeave={() => setFollowHover(false)}
                    onPress={handleFollowClick}
                    style={{ marginRight: '12px' }}
                  >
                    {isFollowing
                      ? followHover
                        ? 'UnFollow'
                        : 'Following'
                      : 'Follow'}
                  </Button>
                </Row>
              </Card.Header>
              {profile.description && (
                <>
                  <Card.Divider />
                  <Card.Body>{newlineCodeToBr(profile.description)}</Card.Body>
                </>
              )}
            </Card>
          ) : (
            <div
              style={{
                height: '100dvh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading />
            </div>
          )
        }
      />
    </MainLayout>
  )
}

export default ProfilePage
