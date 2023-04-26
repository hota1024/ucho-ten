'use client'

import { ReactNode, useEffect, useState } from 'react'
import Konami from 'react-konami-code'

import {
  Badge,
  Button,
  Card,
  Dropdown,
  Loading,
  Modal,
  Popover,
  Row,
  Spacer,
  styled,
  Text,
  User,
  Image,
} from '@nextui-org/react'
import { PostButton } from '@/components/PostButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faHome, faSignOut } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useAgent } from '@/atoms/agent'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import { NotificationCardList } from '@/components/NotificationCardList'
import { useShowPostNumbers } from '@/atoms/settings'
import { SetttingsModal } from '@/components/SettingsModal'

const Container = styled('div', {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',

  display: 'grid',
  gridTemplateColumns: '300px 600px 300px',
  gap: '$6',
})

const LeftActionsContainer = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  gap: '$8',
})

const UchoTen = styled('div', {
  marginTop: '$7',
  fontSize: '2rem',
  fontWeight: 'bold',
  textAlign: 'center',
  color: 'white',
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
  const [agent] = useAgent()
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [showPostNumbers, setShowPostNumbers] = useShowPostNumbers()

  const logout = () => {
    setLogoutLoading(true)

    localStorage.removeItem('session')
    window.location.href = '/login'
  }

  const handleNotificationOpen = async (isOpen: boolean) => {
    if (!agent) {
      return
    }

    setNotifications([])

    if (isOpen) {
      setNotificationCount(0)
      setLoadingNotifications(true)

      const result = await agent.listNotifications()
      agent.updateSeenNotifications()

      setNotifications(result.data.notifications)

      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    if (!agent?.session?.handle) {
      return
    }

    agent
      .getProfile({
        actor: agent.session.handle,
      })
      .then((result) => {
        setProfile(result.data)
      })
  }, [agent])

  useEffect(() => {
    if (!agent) {
      return
    }

    const id = setInterval(async () => {
      const result = await agent.countUnreadNotifications()

      setNotificationCount(result.data.count)
    }, 10000)

    return () => {
      clearInterval(id)
    }
  }, [agent])

  const handleKonami = () => {
    setShowPostNumbers((v) => !v)
  }

  return (
    <Container>
      <Modal open={logoutLoading} blur preventClose>
        <Modal.Header>
          <Loading size="sm" />
          <Spacer y={1} />
          <Text>ログアウト中...</Text>
        </Modal.Header>
      </Modal>

      <SetttingsModal
        open={settingsModal}
        onClose={() => setSettingsModal(false)}
      />

      <LeftActionsContainer>
        <div style={{ display: 'none' }}>
          <Konami action={handleKonami}></Konami>
        </div>
        <UchoTen>
          <Image
            src={'/images/Logo/ucho-ten.svg'}
            alt="Icon"
            height={'70%'}
            width={'70%'}
          ></Image>
        </UchoTen>
        <Button
          as={Link}
          href="/"
          icon={<FontAwesomeIcon icon={faHome} size="lg" />}
        >
          Home
        </Button>

        <Popover onOpenChange={handleNotificationOpen}>
          <Popover.Trigger>
            <Button
              icon={
                notificationCount > 0 ? (
                  <Badge content={''} size="md" color="error" variant="dot">
                    <FontAwesomeIcon icon={faBell} size="lg" />
                  </Badge>
                ) : (
                  <FontAwesomeIcon icon={faBell} size="lg" />
                )
              }
            >
              Notification
            </Button>
          </Popover.Trigger>
          <Popover.Content
            css={{ minWidth: 400, maxHeight: 400, overflow: 'scroll' }}
          >
            {loadingNotifications && (
              <Row justify="center">
                <Loading css={{ my: 4 }} />
              </Row>
            )}

            <NotificationCardList notifications={notifications} />
          </Popover.Content>
        </Popover>

        <PostButton />

        {profile && (
          <Dropdown placement="bottom-left">
            <Dropdown.Trigger>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                }}
              >
                <User
                  as="button"
                  size="lg"
                  squared
                  src={
                    profile.avatar
                      ? profile.avatar
                      : '/images/profileDefaultIcon/kkrn_icon_user_6.svg'
                  }
                  css={{
                    '.nextui-user-desc': {
                      color: '$gray400',
                    },
                  }}
                  name={
                    <Text color="white">
                      {profile.displayName ?? profile.handle}
                    </Text>
                  }
                  description={`@${profile.handle}`}
                ></User>
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu
              disabledKeys={[logoutLoading ? 'logout' : '']}
              onAction={(key) =>
                key === 'logout'
                  ? logout()
                  : key === 'settings'
                  ? setSettingsModal(true)
                  : null
              }
            >
              <Dropdown.Item
                key="profile"
                icon={<FontAwesomeIcon icon={faUser} />}
              >
                <Link href={`/profile/${profile.handle}`}>
                  <Text>My profile</Text>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item
                key="settings"
                icon={<FontAwesomeIcon icon={faGear} />}
              >
                <Text>Settings</Text>
              </Dropdown.Item>
              <Dropdown.Item
                key="logout"
                withDivider
                color="error"
                icon={<FontAwesomeIcon icon={faSignOut} />}
              >
                <Text color="inherit">Log out</Text>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </LeftActionsContainer>
      {children}
      <div></div>
    </Container>
  )
}
