import { useAgent } from '@/atoms/agent'
import { Button, Modal, Textarea } from '@nextui-org/react'
import { useState } from 'react'

export interface PostButtonProps {}

export const PostButton = (props: PostButtonProps) => {
  const [agent] = useAgent()
  const [dialog, setDialog] = useState(false)
  const [content, setContent] = useState('')

  const post = async () => {
    console.log(content)
    await agent?.post({
      text: content,
    })
    setDialog(false)
  }

  return (
    <>
      <Button css={{ width: '100%' }} onPress={() => setDialog(true)}>
        投稿
      </Button>
      <Modal open={dialog} onClose={() => setDialog(false)} closeButton>
        <Modal.Header>投稿する</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="投稿内容"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat onPress={() => setDialog(false)}>
            キャンセル
          </Button>
          <Button auto onClick={post}>
            投稿
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
