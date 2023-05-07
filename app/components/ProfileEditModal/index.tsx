import { useAgent } from '@/atoms/agent'
import { AppBskyActorProfile, BlobRef } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Avatar,
  Button,
  Col,
  Image,
  Input,
  Loading,
  Modal,
  Row,
  Spacer,
  styled,
  Text,
  Textarea,
} from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'

const DummyBanner = styled('div', {
  background: '$gray100',
  borderRadius: '8px',
  width: '100%',
  minHeight: '10rem',
})

const DummyAvatar = styled('div', {
  background: '$gray100',
  borderRadius: '8px',
  minWidth: '4rem',
  aspectRatio: 1,
})

const ImageContainer = styled('label', {
  width: 'auto',
  display: 'block',
  cursor: 'pointer',
  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
})

export interface ProfileEditModalProps {
  open: boolean
  onClose: () => void
  onSave?: () => void
}

export const ProfileEditModal = (props: ProfileEditModalProps) => {
  const { open, onClose } = props
  const onSave = props.onSave ?? (() => {})
  const [agent] = useAgent()
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [bannerFile, setBannerFile] = useState<File | undefined>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()

  const hasChange =
    !!bannerFile ||
    !!avatarFile ||
    displayName !== profile?.displayName ||
    description !== profile?.description

  const fetchProfile = useCallback(async () => {
    setBannerFile(undefined)
    setAvatarFile(undefined)

    if (!agent || !agent.session?.handle) {
      return
    }

    const { data: profile } = await agent.getProfile({
      actor: agent.session.handle,
    })

    setProfile(profile)
  }, [agent])

  const handleSaveClick = async () => {
    if (!agent) {
      return
    }

    let avatar: BlobRef | undefined

    if (avatarFile) {
      const result = await agent.uploadBlob(
        new Uint8Array(await avatarFile.arrayBuffer()),
        {
          encoding: avatarFile.type,
        }
      )
      avatar = result.data.blob
    }

    let banner: BlobRef | undefined

    if (bannerFile) {
      const result = await agent.uploadBlob(
        new Uint8Array(await bannerFile.arrayBuffer()),
        {
          encoding: bannerFile.type,
        }
      )
      banner = result.data.blob
    }

    setSaving(true)
    await agent.upsertProfile((old) => {
      const profile: AppBskyActorProfile.Record = {
        ...old,
        avatar: avatar ?? old?.avatar,
        banner: banner ?? old?.banner,
        displayName: displayName || undefined,
        description: description || undefined,
      }

      return profile
    })
    setSaving(false)
    onSave()
    onClose()
  }

  useEffect(() => {
    if (!open || !agent) {
      return
    }

    fetchProfile()
  }, [open, agent, fetchProfile])

  useEffect(() => {
    if (!profile) {
      return
    }

    setDisplayName(profile.displayName ?? '')
    setDescription(profile.description ?? '')
  }, [profile])

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Text size={20} b>
          Edit my profile
        </Text>
      </Modal.Header>
      {profile ? (
        <>
          <Modal.Body>
            <Row>
              <ImageContainer htmlFor="banner-input" fullWidth>
                {bannerFile ? (
                  <Image src={URL.createObjectURL(bannerFile)} alt="banner" css={{
                    '&:hover': {
                      opacity: 0.8,
                      filter: 'grayscale(100%)',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                    }
                  }}/>
                ) : profile.banner ? (
                  <Image src={profile.banner} alt="banner" css={{
                    '&:hover': {
                      opacity: 0.8,
                      filter: 'grayscale(100%)',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                    }
                  }}/>
                ) : (
                  <DummyBanner></DummyBanner>
                )}
              </ImageContainer>
              <input
                hidden
                id="banner-input"
                type="file"
                accept="image/*,.png,.jpg,.jpeg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBannerFile(e.target.files?.[0])
                }
              />
            </Row>
            <Row align="center">
              <ImageContainer htmlFor="avatar-input">
                {avatarFile ? (
                  <Avatar
                    src={URL.createObjectURL(avatarFile)}
                    squared
                    size="xl"
                    pointer
                    css={{
                      '&:hover': {
                        opacity: 0.8,
                        filter: 'grayscale(100%)',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                      }
                    }}
                  />
                ) : profile.avatar ? (
                  <Avatar src={profile.avatar} squared size="xl" pointer css={{
                    '&:hover': {
                      opacity: 0.8,
                      filter: 'grayscale(100%)',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                    }
                  }}/>
                ) : (
                  <DummyAvatar></DummyAvatar>
                )}
                <input
                  hidden
                  id="avatar-input"
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAvatarFile(e.target.files?.[0])
                  }
                />
              </ImageContainer>
              <Spacer x={1} />
              <Col>
                <Input
                  label="Display name"
                  initialValue={profile.displayName ?? ''}
                  fullWidth
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Textarea
                label="Description"
                initialValue={profile.description ?? ''}
                fullWidth
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {hasChange && <Text color="error">You have unsaved changes</Text>}
            <Button light auto onPress={() => onClose()} disabled={saving}>
              Cancel
            </Button>
            <Button
              color="success"
              auto
              onPress={handleSaveClick}
              disabled={saving || !hasChange}
            >
              {saving ? <Loading /> : 'Save'}
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Modal.Body>
          <Loading />
        </Modal.Body>
      )}
    </Modal>
  )
}
