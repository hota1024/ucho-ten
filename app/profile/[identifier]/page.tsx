'use client'

import {
  Button,
  Card,
  Col, Dropdown,
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
import { ProfileEditModal } from '@/components/ProfileEditModal'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

/**
 * Home page.
 */
const ProfilePage = ({ params }: { params: { identifier: string } }) => {
  const { agent } = useRequiredSession()
  const [profile, setProfile] = useState<ProfileViewDetailed>()
  const [followHover, setFollowHover] = useState(false)
  const [isFollowing, setIsFollowing] = useState(!!profile?.viewer?.following)
  const [followLoading, setFollowLoading] = useState(false)

  const [isMuted, setIsMuted] = useState(!!profile?.viewer?.muted)
  const [MuteLoading, setMuteLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(!!profile?.viewer?.blocking)
  const [BlockLoading, setBlockLoading] = useState(false)

  const [isLabeled, setIsLabeled] = useState(false)
  const [whatLabel, setWhatLabel] = useState('')
  const [isMe, setIsMe] = useState(false)
  const [show, setShow] = useState(true)
  const [profileEditModal, setProfileEditModal] = useState(false)
  const { t, i18n } = useTranslation()


  const fetchTimeline: TimelineFetcher = ({ agent, cursor }) => {
    if (!agent) {
      return
    }

    return agent
      .getAuthorFeed({
        actor: params.identifier,
        cursor,
      })
      .then((result) => result.data)
  }

  const timeline = useTimelineView(fetchTimeline)

  const fetchProfile = useCallback(async () => {
    if (!agent) {
      return
    }

    try {
      const result = await agent.getProfile({
        actor: params.identifier,
      })

      if (
        result &&
        result.data &&
        result.data.labels &&
        result.data.labels.length > 0
      ) {
        setIsLabeled(true)
        setWhatLabel(result.data.labels[0].val)
      }

      if (result.data.did === agent.session!.did) {
        setIsMe(true)
      }
      setProfile(result.data)
      setIsFollowing(!!result.data?.viewer?.following)

      if(result.data.viewer?.blocking || !!result.data.viewer?.blockedBy){
        setIsBlocked(true)
      }

      if (result.data.viewer?.muted || result.data.viewer?.blocking || !!result.data.viewer?.blockedBy) {
        setShow(false)
      }
    } catch (error) {
      setShow(false)
    }
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

  const handleEditProfileClick = async () => {
    setProfileEditModal(true)
  }

  const handleMuteClick = async () => {
    if (!agent) {
      return
    }
    const mute = profile?.viewer?.muted
    setMuteLoading(true)

    if (isMuted && profile?.did) {
      await agent.unmute(profile.did)
      setIsMuted(false)
    } else if (profile?.did) {
      await agent.mute(profile.did)
      setIsMuted(true)
    }

    //await fetchProfile()
    setMuteLoading(false)

  }

  const handleBlockClick = async () => {
    if (!agent) {
      return
    }
    const blocking = profile?.viewer?.blocking
    setBlockLoading(true)

    if (blocking !== undefined) {
      // await agent.unblock(profile.did)
      setIsMuted(false)
    } else if (profile?.did) {
      // await agent.block(profile.did)
      setIsMuted(true)
    }

    //await fetchProfile()
    setMuteLoading(false)

  }

  const newlineCodeToBr = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i}>
        {reactStringReplace(
          line,
          /(@[a-zA-Z0-9-.]+|https?:\/\/[a-zA-Z0-9-./?=_%&:#@]+)/g,
          (match, j) => {
            if (match.startsWith('@')) {
              let domain = match.substring(1) // remove "@" symbol from match
              if (domain.endsWith('.')) {
                domain = domain.slice(0, -1)
              }
              return (
                <Link key={j} href={`/profile/${domain}`}>
                  {match}
                </Link>
              )
            } else if (match.startsWith('http')) {
              let url = match
              if (url.endsWith('.')) {
                url = url.slice(0, -1)
              }
              return (
                <a key={j} href={url} target="_blank" rel="noopener noreferrer">
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
            }
          }
        )}
      </p>
    ))
  }

  if (!show) {
    return (
      <MainLayout>
        <div
          style={{
            height: '100dvh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Card css={{ my: '$10' }} variant="bordered">
            <Card.Image
              src={'/images/profileDefaultImage/defaultHeaderImage.png'}
            ></Card.Image>
            <Card.Header>{t("ProfilePage.UserNotFound")}</Card.Header>
            <Card.Body>
              <Link href="/">
                <Button>{t("ProfilePage.ReturnToHome")}</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <ProfileEditModal
        open={profileEditModal}
        onClose={() => setProfileEditModal(false)}
        onSave={fetchProfile}
      />
      <TimelineView
        {...timeline}
        header={
          profile ? (
            <Card css={{ my: '$10' }} variant="bordered">
              {!profile.banner && (
                <Card.Image
                  src={'/images/profileDefaultImage/defaultHeaderImage.png'}
                ></Card.Image>
              )}
              {profile.banner && (
                <Zoom>
                  <Card.Image src={profile.banner} showSkeleton />
                </Zoom>
              )}
              <Card.Header css={{ px: 0, flexFlow: 'column' }}>
                <Row align="center" justify="space-between">
                  <Col>
                    <User
                      squared
                      size="xl"
                      name={profile.displayName}
                      //description={`@${profile.handle}${isMuted?' (Muted)':''}`}
                        description={'　'}
                    />
                    <div style={{height:'64px', width : '64px', borderRadius:' 22px', overflow:'hidden', marginLeft : '12px', position:"absolute", top:'0px', zIndex : '999'}}>
                      <Zoom>
                        <img src={
                          profile.avatar
                              ? profile.avatar
                              : '/images/profileDefaultIcon/kkrn_icon_user_6.svg'
                        }></img>
                      </Zoom>
                    </div>
                    <div style={{width: '250px', position: 'absolute', top:'30px', left:'88px'}}>
                      <Text css={{width:'100%', maxWidth:'100%' ,overflowWrap: 'break-word', fontSize:'13px', color:'$gray700'}}>{`@${profile.handle}${isMuted?' (Muted)':''}`}</Text>
                    </div>
                  </Col>
                  {!isMe && (
                      <div style={{cursor:'pointer'}}>
                        <Dropdown placement="bottom-left">
                          <Dropdown.Trigger>
                            <FontAwesomeIcon icon={faEllipsis} size={'xl'}></FontAwesomeIcon>
                          </Dropdown.Trigger>
                          <Dropdown.Menu
                              onAction={(key) => {
                                if (key === 'mute') {
                                  handleMuteClick()
                                }
                              }}
                          >
                            <Dropdown.Item key="mute">
                              {!isMuted && <Text color={'error'}>{t('ProfilePage.Button.HideUser')}</Text>}
                              {isMuted && (
                                  <Text>{t('ProfilePage.Button.ShowUser')}</Text>
                              )}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      )}
                  <Spacer y={1} />
                  <Button
                    rounded
                    bordered={isFollowing}
                    color={
                      isMe
                        ? 'gradient'
                        : isFollowing && followHover
                        ? 'error'
                        : 'primary'
                    }
                    onMouseOver={() => setFollowHover(true)}
                    onMouseLeave={() => setFollowHover(false)}
                    onPress={isMe ? handleEditProfileClick : handleFollowClick}
                    style={{ marginRight: '12px' }}
                  >
                    {!isMe
                      ? isFollowing
                        ? followHover
                          ? <>{t('Button.UnFollow')}</>
                          : <>{t('Button.Following')}</>
                        : <>{t('Button.Follow')}</>
                      : <>{t('ProfilePage.Button.EditProfile')}</>}
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
