import {
  FeedViewPost,
  PostView,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/like'
import {
  faComment,
  faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons'
import {
  faHeart as faHeartSolid,
  faRetweet,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Avatar,
  Card,
  Col,
  Link,
  Row,
  Spacer,
  styled,
  Text,
} from '@nextui-org/react'
import NextLink from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeConsecutiveUnits, makeUnit, utx } from 'utx'
import { PostRecordTextView } from '../PostRecordTextView'

const PostInfo = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '$4',
})

const AuthorDisplayName = styled('div', {
  fontWeight: 'bold',
})

const AuthorHandle = styled('div', {
  color: '$gray700',
})

const PostDate = styled('div', {
  color: '$gray700',
  fontSize: '$sm',
})

const timeUnit = utx(
  makeConsecutiveUnits([
    makeUnit(1000, '秒'),
    makeUnit(60, '分'),
    makeUnit(60, '時'),
    makeUnit(24, '日'),
  ])
)

const PostAction = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  fontWeight: '$medium',
  color: '$gray700',
})

const PostContainer = styled('div', {
  padding: '0 $8',
})

const ReplyLine = styled('div', {
  position: 'absolute',
  borderLeft: '2px solid $gray700',
  left: 22,
  top: 50,
  bottom: 2,
})

interface PostProps {
  post: PostView
  hasReply?: boolean
  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean
}

const Post = (props: PostProps) => {
  const { post, hasReply, showReplyCount, showRepostCount, showLikeCount } =
    props
  const record = post.record as Record

  const [elapsed, setElapsed] = useState<number>()
  const time = useMemo(() => new Date(record.createdAt), [record.createdAt])

  const updateElapsed = useCallback(() => {
    const elapsed = Date.now() - time.getTime()
    setElapsed(elapsed)

    return elapsed
  }, [time])

  useEffect(() => {
    updateElapsed()

    const id = setInterval(() => {
      const elapsed = updateElapsed()

      if (elapsed > 6000) {
        clearInterval(id)
      }
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [time, updateElapsed])

  return (
    <Row align="stretch" css={{ position: 'relative' }}>
      {hasReply && <ReplyLine />}
      <div>
        <Avatar squared src={post.author.avatar} size="lg" />
      </div>
      <Spacer x={1} />
      <Col>
        <PostInfo>
          <AuthorDisplayName>
            <NextLink href={`/profile/${post.author.handle}`}>
              <Link color="text">{post.author.displayName}</Link>
            </NextLink>
          </AuthorDisplayName>
          <AuthorHandle>
            <NextLink href={`/profile/${post.author.handle}`}>
              <Link color="text">@{post.author.handle}</Link>
            </NextLink>
          </AuthorHandle>
          <PostDate>
            {elapsed && `${timeUnit(elapsed, { noZero: true })[0]}`}
          </PostDate>
        </PostInfo>
        <PostRecordTextView post={post} />
        <Row css={{ mt: '$6', mb: hasReply ? '$10' : '$0' }} align="center">
          <Col>
            <PostAction>
              <FontAwesomeIcon icon={faComment} color="#787F85" />
              {showReplyCount && post.replyCount}
            </PostAction>
          </Col>
          <Col>
            <PostAction>
              <FontAwesomeIcon icon={faRetweet} color="#787F85" />
              {showRepostCount && post.repostCount}
            </PostAction>
          </Col>
          <Col>
            <PostAction>
              <FontAwesomeIcon icon={faHeartRegular} color="#787F85" />
              {showLikeCount && post.likeCount}
            </PostAction>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export interface FeedViewProps {
  feed: FeedViewPost
}

export const FeedView = (props: FeedViewProps) => {
  const { feed } = props

  return (
    <>
      <Card variant="flat" css={{ py: '$8' }}>
        {feed.reply ? (
          <>
            <PostContainer>
              <Post
                hasReply
                post={feed.reply.parent}
                showLikeCount
                showReplyCount
                showRepostCount
              />
            </PostContainer>
            <PostContainer>
              <Post
                post={feed.post}
                showLikeCount
                showReplyCount
                showRepostCount
              />
            </PostContainer>
          </>
        ) : (
          <PostContainer>
            <Post
              post={feed.post}
              showLikeCount
              showReplyCount
              showRepostCount
            />
          </PostContainer>
        )}
      </Card>
    </>
  )
}
