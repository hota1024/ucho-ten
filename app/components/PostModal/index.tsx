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
  Image,
} from '@nextui-org/react'
import { useState } from 'react'
import { Post } from '../Post/Post'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import Zoom from 'react-medium-image-zoom'

export interface PostModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (record: PostRecordPost) => void
  parentPostView?: PostView
}

export const PostModal = (props: PostModalProps) => {
  const { open, onClose, onSubmit, parentPostView } = props
  const [agent] = useAgent()
  const [contentText, setContentText] = useState<string>('')
  const [contentImage, setContentImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const isPostable = contentText.length > 0
  const isImageMaxLimited =
    contentImage.length >= 5 || contentImage.length === 4 // 4枚まで
  const isImageMinLimited = contentImage.length === 0 // 4枚まで
  const inputId = Math.random().toString(32).substring(2)

  const handlePostClick = async () => {
    if (!agent) {
      throw new Error('agent is not ready')
    }

    setLoading(true)

    const rt = new RichText({ text: contentText })
    await rt.detectFacets(agent)

    await onSubmit({
      text: rt.text,
      facets: rt.facets,
    })
    //contentImage.lengthが0枚または5枚以上のときは画像を投稿しない
    // if (contentImage.length > 0 && contentImage.length < 5) {
    //     const formData = new FormData();
    //     contentImage.forEach((image) => {
    //         formData.append("images", image);
    //     });
    //     await agent.post(formData);
    // }

    setLoading(false)
    onClose()
    setContentText('')
    setContentImages([])
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handlePostClick()
    }
  }

  const handleOnAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setContentImages([...contentImage, ...e.target.files])
  }

  const handleOnRemoveImage = (index: number) => {
    // 選択した画像は削除可能
    const newImages = [...contentImage]
    newImages.splice(index, 1)
    setContentImages(newImages)
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
          placeholder="Post contents"
          rows={8}
          maxLength={300}
          initialValue={contentText}
          autoFocus={true}
          onChange={(e) => setContentText(e.target.value)}
          disabled={loading}
          onKeyDown={isPostable ? handleKeyDown : undefined}
        />
      </Modal.Body>
      <Modal.Footer>
        {contentImage.length > 0 && (
          <Text size="$sm" color="error">
            画像はあと{4 - contentImage.length}枚までです.
          </Text>
        )}
        {contentImage.length > 0 && (
          <div style={{ display: 'flex', width: '100%', height: '100px' }}>
            {contentImage.map((image, index) => (
              <div
                key={index}
                style={{
                  width: `calc(100% / 4)`,
                  height: '88px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Zoom>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    style={{
                      width: `100%`,
                      height: '88px',
                      objectFit: 'cover',
                    }}
                  ></Image>
                </Zoom>
                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                  <Button
                    auto
                    css={{
                      height: '15px',
                      width: '15px',
                      padding: '0px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                    onClick={() => handleOnRemoveImage(index)}
                  >
                    <FontAwesomeIcon icon={faXmark} size="sm" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <label htmlFor={inputId}>
          <Button disabled={loading || isImageMaxLimited} as="span" auto>
            <FontAwesomeIcon icon={faImage} size="lg" />
          </Button>
          <input
            hidden
            id={inputId}
            type="file"
            multiple
            accept="image/*,.png,.jpg,.jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleOnAddImage(e)
            }
            disabled={isImageMaxLimited}
          />
        </label>

        <Button auto flat onPress={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          auto
          onClick={handlePostClick}
          disabled={
            loading ||
            (!isPostable && isImageMinLimited) ||
            contentImage.length >= 5
          }
        >
          {loading ? (
            <>
              <Loading size="xs" />
              <Spacer x={0.5} />
              投稿中...
            </>
          ) : (
            'Post'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
