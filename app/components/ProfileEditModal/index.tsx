import { useAgent } from '@/atoms/agent'
import { AppBskyActorProfile } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
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
  minHeight: '10rem',
})

const DummyAvatar = styled('div', {
  background: '$gray100',
  borderRadius: '8px',
  minWidth: '4rem',
  aspectRatio: 1,
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

  const fetchProfile = useCallback(async () => {
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

    console.log(displayName, description)
    setSaving(true)
    await agent.upsertProfile((old) => {
      const profile: AppBskyActorProfile.Record = {
        ...old,
        displayName: displayName || undefined,
        description: description || undefined,
      }

      return profile
    })
    setSaving(false)
    onSave()
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
            {profile.banner ? (
              <Image src={profile.banner} alt="banner" />
            ) : (
              <DummyBanner></DummyBanner>
            )}
            <Row align="center">
              {profile.avatar ? (
                <Avatar src={profile.avatar} squared size="xl" />
              ) : (
                <DummyAvatar></DummyAvatar>
              )}
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
            <Button light auto onPress={() => onClose()} disabled={saving}>
              Cancel
            </Button>
            <Button
              color="success"
              auto
              onPress={handleSaveClick}
              disabled={saving}
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
