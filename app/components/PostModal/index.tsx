import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import { useAgent } from '@/atoms/agent'
import { PostRecordPost } from '@/types/posts'
import { RichText } from '@atproto/api'
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  Button,
  Card,
  Loading,
  Modal,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react'
import { useState } from 'react'
import { Post } from '../Post/Post'

export interface PostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (record: PostRecordPost) => void
  parentPostView?: PostView
}

export const PostModal = (props: PostModalProps) => {
  const { open, onClose, onSubmit, parentPostView } = props
  const [agent] = useAgent()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const isPostable = content.length > 0

  const handlePostClick = async () => {
    if (!agent) {
      throw new Error('agent is not ready')
    }

    setLoading(true)

    const rt = new RichText({ text: content })
    await rt.detectFacets(agent)

    await onSubmit({
      text: rt.text,
      facets: rt.facets,
    })

    setLoading(false)
    onClose()
    setContent('')
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handlePostClick()
    }
  }

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      preventClose={loading}
    >
      <Modal.Header>
        <Text size="$lg" b>
          {parentPostView ? '返信する' : '投稿する'}
        </Text>
      </Modal.Header>
      {parentPostView && (
        <Modal.Body>
          <Card variant="bordered">
            <Post
              record={parentPostView.record as Record}
              author={parentPostView.author}
              hideActions
              disableTooltip
            />
          </Card>
        </Modal.Body>
      )}
      <Modal.Body>
        <Textarea
          placeholder="投稿内容"
          rows={8}
          maxLength={300}
          initialValue={content}
          autoFocus={true}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          onKeyDown={handleKeyDown}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat onPress={onClose} disabled={loading}>
          キャンセル
        </Button>
        <Button
          auto
          onClick={handlePostClick}
          disabled={loading || !isPostable}
        >
          {loading ? (
            <>
              <Loading size="xs" />
              <Spacer x={0.5} />
              投稿中...
            </>
          ) : (
            '投稿'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
