import { useAgent } from '@/atoms/agent'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { PostModal } from '../PostModal'
import { PostRecordPost } from '@/types/posts'

export interface PostButtonProps {}

export const PostButton = (props: PostButtonProps) => {
  const [agent] = useAgent()
  const [dialog, setDialog] = useState(false)

  const post = async (record: PostRecordPost) => {
    if (!agent) {
      return
    }

    await agent.post(record)
  }
  const styles = {
    button: {
      color: '$white',
      backgroundColor: '$blue500',
      border: '2px solid $blue500', // 変更
      '&:hover': {
        color: '$blue500',
        backgroundColor: '$white',
        border: '2px solid $blue500', // 変更
      },
    },
  }

  return (
    <>
      <Button
        css={styles.button}
        onPress={() => setDialog(true)}
        icon={<FontAwesomeIcon icon={faPenToSquare} size="lg" />}
      >
        Post
      </Button>
      <PostModal
        open={dialog}
        onClose={() => setDialog(false)}
        onSubmit={post}
      />
    </>
  )
}
