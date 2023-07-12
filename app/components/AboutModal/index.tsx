
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
export type AboutModalProps = {
    open: boolean
    onClose: () => void
}

/**
 * SetttingsModal component.
 */
export const AboutModal = (props: AboutModalProps) => {
    const { open, onClose } = props

    const { t, i18n } = useTranslation();
    const lngs = {
        ja: "日本語",
        en: "English",
    }

    return (
        <Modal open={open} onClose={onClose}
               width='600px'
               css={{left: '2%'}}
        >
            <Modal.Header>
                <Text size="$lg" b>
                    {t("Modal.About.Title")}
                </Text>
            </Modal.Header>
            <Modal.Body>
              <Text b> Ucho-ten とは</Text>
                <Text>Ucho-tenは「他者から解放され、自己の独立を目指す」クライアントです。</Text>

              <Text b> 特徴</Text>
              <Text>そのため、リアクション数が見えないことも一つの特徴です。<br/>またlike機能に代わる「Bluedot」を開発中です。<br/>Bluedotは、レコメンドアルゴリズム的システムではなく、タイムラインを自分好みへ最適化する際にも用いられる予定です。</Text>
              <Text b>リンク集</Text>
              <Text>
                  Github: <a href="https://github.com/hota1024/ucho-ten" target="_blank" rel="noopener noreferrer">https://github.com/hota1024/ucho-ten</a><br/>
                  Add Translate button script. Developed by <a href="https://bsky.app/profile/lamrongol.bsky.social" target="_blank" rel="noopener noreferrer">lamrongol</a>: <a href="https://greasyfork.org/ja/scripts/467220-bluesky%E3%81%AE%E8%8B%B1%E8%AA%9E%E3%82%92%E7%BF%BB%E8%A8%B3%E3%81%99%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3-ucho-ten-laika" target="_blank" rel="noopener noreferrer">Link</a>
              </Text>
              <Text b>開発者</Text>
              <Text>ばいそに: @bisn.ucho-ten.net <br/> hota1024: @hota1024.com</Text>
              <Text b>連絡先</Text>
                <Text>bluesky: @bisn.ucho-ten.net</Text>
                <Text>Mail: <img src={"https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/contact/contact.png"} style={{width:"180px"}}></img></Text>
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={onClose} flat css={{ width: '100%' }}>
                    {t("Modal.Settings.CloseButton")}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
