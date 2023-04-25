import {
  useMuteWords,
  useShowMuteUserInNotifications,
  useShowMuteUserInSearch,
} from '@/atoms/settings'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Spacer,
  Switch,
  Text,
  Textarea,
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'

/**
 * SetttingsModal props.
 */
export type SetttingsModalProps = {
  open: boolean
  onClose: () => void
}

/**
 * SetttingsModal component.
 */
export const SetttingsModal = (props: SetttingsModalProps) => {
  const { open, onClose } = props

  // showMuteUserInNotifications - 通知にミュートユーザーを表示するか
  const [showMuteUserInNotifications, setShowUserInNotifications] =
    useShowMuteUserInNotifications()

  // showMuteUserInSearch - 検索結果にミュートユーザーを表示するか
  const [showMuteUserInSearch, setShowMuteUserInSearch] =
    useShowMuteUserInSearch()

  // muteWords - ミュートワードの配列
  const [muteWords, setMuteWords] = useMuteWords()

  const [muteWord, setMuteWord] = useState('')
  const muteWordInputRef = useRef<HTMLInputElement>(null)

  const handleMuteWordAddClick = () => {
    if (muteWord.length === 0) {
      return
    }

    if (muteWords.includes(muteWord)) {
      return
    }

    setMuteWords([...muteWords, muteWord])
    if (muteWordInputRef.current) {
      muteWordInputRef.current.value = ''
    }
  }

  const removeMuteWord = (word: string) => {
    setMuteWords(muteWords.filter((w) => w !== word))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Text size="$lg" b>
          Settings
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text size={20} b>
          Mute users
        </Text>
        <Row align="center">
          <Col>
            <Text>Show mute users in notification</Text>
          </Col>
          <Switch
            initialChecked={showMuteUserInNotifications}
            onChange={(e) => setShowUserInNotifications(e.target.checked)}
            disabled
          />
        </Row>
        <Row align="center">
          <Col>
            <Text>Show mute users in search</Text>
          </Col>
          <Switch
            initialChecked={showMuteUserInSearch}
            onChange={(e) => setShowMuteUserInSearch(e.target.checked)}
            disabled
          />
        </Row>
        <Text size={20} b>
          Mute words (工事中)
        </Text>
        <Row>
          <Col
            css={{
              display: 'flex',
              flexFlow: 'column',
              gap: 8,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            {muteWords.map((word) => (
              <Row key={word}>
                <Card variant="flat">
                  <Card.Header>
                    <Row align="center">
                      <Col>{word}</Col>
                      <Button
                        auto
                        color="error"
                        flat
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onPress={() => removeMuteWord(word)}
                      />
                    </Row>
                  </Card.Header>
                </Card>
              </Row>
            ))}
          </Col>
        </Row>
        <Row align="flex-end">
          <Col>
            <Input
              fullWidth
              label="Add mute word"
              placeholder="Mute word to add"
              ref={muteWordInputRef}
              onChange={(e) => setMuteWord(e.target.value)}
            />
          </Col>
          <Spacer x={0.5} />
          <Button auto onPress={handleMuteWordAddClick} disabled>
            Add
          </Button>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={onClose} flat css={{ width: '100%' }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
