import {
  useMuteWords,
  useShowMuteUserInNotifications,
  useShowMuteUserInSearch,
  useDisableScrollOnLoadButtonPress,
} from '@/atoms/settings'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Card,
  Col, Dropdown,
  Input,
  Modal,
  Row,
  Spacer,
  Switch,
  Text,
  Textarea,
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next";


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
  const [disableScrollOnLoadButtonPress, setDisableScrollOnLoadButtonPress] = useDisableScrollOnLoadButtonPress()
  const isPostable = muteWord.length > 0
  const { t, i18n } = useTranslation();
  const lngs = {
    ja: "日本語",
    en: "English",
  }
  const lngChange = (lng:any) => {
    i18n.changeLanguage(lng);
    console.log(i18n.resolvedLanguage)
  }
  
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleMuteWordAddClick()
    }
  }

  const removeMuteWord = (word: string) => {
    setMuteWords(muteWords.filter((w) => w !== word))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Text size="$lg" b>
          {t("Modal.Settings.Title")}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text size={20} b>
          auto scroll
        </Text>
        <Row align="center">
          <Col>
            <Text>when push load button disable scroll</Text>
          </Col>
          <Switch
              initialChecked={disableScrollOnLoadButtonPress}
              onChange={(e) => setDisableScrollOnLoadButtonPress(e.target.checked)}
              disabled
          />
        </Row>
        <Text size={20} b>
          {t("Modal.Settings.Language")}
        </Text>
        <Row align="center">
          <Col>
            <Text>{t("Modal.Settings.SelectUsingLanguage")}</Text>
          </Col>
          <div>
            <Dropdown>
              <Dropdown.Button light css={{ tt: "capitalize" }}>
                {i18n.resolvedLanguage}
              </Dropdown.Button>
              <Dropdown.Menu
                  aria-label="Multiple selection actions"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={i18n.resolvedLanguage}
                  //@ts-ignore
                  onSelectionChange={lngChange}
              >
                <Dropdown.Item key='en'>English</Dropdown.Item>
                <Dropdown.Item key='ja'>日本語</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Row>
        <Text size={20} b>
          {t("Modal.Settings.MuteWords")}
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
              //label={t("Modal.Settings.AddMuteword")}
              placeholder={t("Modal.Settings.InputHere")}
              ref={muteWordInputRef}
              onChange={(e) => setMuteWord(e.target.value)}
              onKeyDown={isPostable ? handleKeyDown : undefined}
            />
          </Col>
          <Spacer x={0.5} />
          <Button auto onPress={handleMuteWordAddClick}>
            {t("Modal.Settings.AddButton")}
          </Button>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={onClose} flat css={{ width: '100%' }}>
          {t("Modal.Settings.CloseButton")}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
