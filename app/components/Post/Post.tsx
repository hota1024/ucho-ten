import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  FeedViewPost,
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {
  faComment,
  faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons'
import {
  faHeart as faHeartSolid,
  faRetweet as faRetweetSolid,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  styled,
  Row,
  Tooltip,
  Container,
  Col,
  User,
  Button,
  Avatar,
  Spacer,
  Grid,
  Image,
} from '@nextui-org/react'
import Link from 'next/link'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import { utx, makeConsecutiveUnits, makeUnit } from 'utx'
import { PostRecordTextView } from '../PostRecordTextView'
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { AppBskyEmbedRecord, AppBskyEmbedImages } from '@atproto/api'
import { useAgent } from '@/atoms/agent'

const RepostByLabel = styled('div', {
  fontSize: '$sm',
  fontWeight: 'bold',
  color: '$gray700',
})

const PostInfo = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '$4',
})

const AuthorDisplayName = styled('div', {
  color: '$text',
  fontWeight: 'bold',
})

const AuthorHandle = styled('div', {
  color: '$gray700',
})

const PostDate = styled('div', {
  color: '$gray700',
  fontSize: '$sm',
  lineHeight: '1.6',
  '&:hover': {
    textDecoration: 'underline',
  },
  '& a': {
    color: '$gray700',
  },
})


const timeUnit = utx(
    makeConsecutiveUnits([
      makeUnit(1000, 's'),
      makeUnit(60, 'm'),
      makeUnit(60, 'h'),
      makeUnit(24, 'd'),
    ])
)

const PostAction = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  fontWeight: '$medium',
  color: '$gray700',
  //cursor: 'pointer',
})

const ReplyLine = styled('div', {
  position: 'relative',
  borderLeft: '2px solid $gray700',
  left: 24,
  top: 50,
  bottom: 2,
})

interface PostProps {
  postUri?: string
  reasonRepost?: ReasonRepost

  author: ProfileViewBasic

  record: Record
  embed?: AppBskyEmbedRecord.ViewRecord
  isEmbed?: boolean

  createdAt?: string

  hasReply?: boolean

  hideActions?: boolean

  disableTooltip?: boolean

  replyCount?: number
  repostCount?: number
  likeCount?: number

  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean

  isLiked?: boolean
  isReposted?: boolean
  onLikeClick?: () => void
  onRepostClick?: () => void

  isFollowing?: boolean
  onFollowClick?: () => void

  onReplyClick?: () => void
}

export const Post = (props: PostProps) => {
  const {
    postUri,
    reasonRepost,
    author,
    record,
    isEmbed,
    embed,
    createdAt,
    hasReply,
    replyCount,
    repostCount,
    likeCount,
    hideActions,
    disableTooltip,
    showReplyCount,
    showRepostCount,
    showLikeCount,
    isLiked,
    isReposted,
    isFollowing,
    onReplyClick,
  } = props
  const onLikeClick = props.onLikeClick ?? (() => {})
  const onRepostClick = props.onRepostClick ?? (() => {})
  const onFollowClick = props.onFollowClick ?? (() => {})

  const [agent] = useAgent()
  const [followHover, setFollowHover] = useState(false)

  const images = AppBskyEmbedImages.isView(embed) ? embed.images ?? [] : []

  const [elapsed, setElapsed] = useState<number>()
  const time = useMemo(() => createdAt && new Date(createdAt), [createdAt])

  const updateElapsed = useCallback(() => {
    if (!time) return 0

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
      <Row
          align="stretch"
          css={{
            position: 'relative',
            border: isEmbed ? '2px solid $gray400' : undefined,
            borderRadius: '$md',
            padding: '$4',
          }}
      >
        {hasReply && <ReplyLine />}
        <div>
          <Tooltip
              placement="right"
              isDisabled={disableTooltip}
              content={
                <Container
                    css={{
                      mw: '400px',
                      width: '100%',
                      borderRadius: '$lg',
                      p: '$sm',
                    }}
                >
                  <Row justify="space-between" align="center">
                    <Col span={7}>
                      <User
                          squared
                          src={author.avatar ? author.avatar : undefined}
                          size="lg"
                          name={author.displayName}
                          description={`@${author.handle}`}
                      />
                    </Col>
                    <Col span={7}>
                      <Button
                          auto
                          onClick={onFollowClick}
                          onMouseOver={() => setFollowHover(true)}
                          onMouseLeave={() => setFollowHover(false)}
                          rounded
                          bordered={isFollowing}
                          color={isFollowing && followHover ? 'error' : 'primary'}
                          css={{ ml: '$10', width: `5ch` }}
                      >
                        {isFollowing
                            ? followHover
                                ? 'フォロー解除'
                                : 'フォロー中'
                            : 'フォロー'}
                      </Button>
                    </Col>
                  </Row>
                </Container>
              }
          >
            <Avatar squared src={author.avatar ? author.avatar : undefined} size={isEmbed ? 'md' : 'lg'} />
          </Tooltip>
        </div>
        <Spacer x={1} />
        <Col>
          {reasonRepost && (
              <RepostByLabel>
                {reasonRepost.by.displayName} さんがリポスト
              </RepostByLabel>
          )}
          <PostInfo>
            <Link style={{ display: 'block' }} href={`/profile/${author.handle}`}>
              <AuthorDisplayName>
                {author.displayName ?? `@${author.handle}`}
              </AuthorDisplayName>
            </Link>
            <Link style={{ display: 'block' }} href={`/profile/${author.handle}`}>
              <AuthorHandle>@{author.handle}</AuthorHandle>
            </Link>
            <PostDate>
              <Link style={{ display: 'block' }} href={`https://staging.bsky.app/profile/${author.handle}/post/${postUri}`} target={"_blank"}>
                {elapsed && `${timeUnit(elapsed, { noZero: true })[0]}`}
              </Link>
            </PostDate>
          </PostInfo>

          <PostRecordTextView record={record} />

          {embed && embed.$type === 'app.bsky.embed.record#view' && (
              <>
                <Post
                    record={(embed.record as Record).value as Record}
                    author={(embed.record as Record).author as ProfileViewBasic}
                    isEmbed
                    hideActions
                />
              </>
          )}

          {images.length > 0 && (
              <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '$4',
                    marginTop: '$4',
                    width: images.length === 1 ? '200%' : '100%',
                    
                  }}
              >
                {images.slice(0, 2).map((image, key) => (
                    <div
                        key={key}
                        style={{
                          flexBasis: '50%',
                          padding: '$1',
                          boxSizing: 'border-box',
                          padding: '1px',
                        }}
                    >
                      <Zoom>
                        <Image
                            src={image.fullsize}
                            alt={image.alt}
                            style={{ borderRadius: '$xs', width: '100%', height: '100%' }}
                        />
                      </Zoom>
                    </div>
                ))}
                {images.length > 2 &&
                    images.slice(2).map((image, key) => (
                        <div
                            key={key}
                            style={{
                              flexBasis: '50%',
                              padding: '$1',
                              boxSizing: 'border-box',
                              breakInside: 'avoid',
                              padding: '1px',
                            }}
                        >
                          <Zoom>
                            <Image
                                src={image.fullsize}
                                alt={image.alt}
                                style={{ borderRadius: '$xs', width: '100%'}}
                            />
                          </Zoom>
                        </div>
                    ))}
              </div>
          )}


          {!hideActions && (
              <Row css={{ mt: '$3', mb: hasReply ? '$10' : '$0' }} align="center">
                <Col>
                  <PostAction>
                    <FontAwesomeIcon icon={faComment} color="#787F85" onClick={onReplyClick}/>
                    {showReplyCount && replyCount}
                  </PostAction>
                </Col>
                <Col>
                  <PostAction>
                    <FontAwesomeIcon onClick={onRepostClick}
                                     icon={faRetweetSolid}
                        //color="#787F85"
                                     color={isReposted ? '#36BA7A' : '#787F85'}
                    />
                    {showRepostCount && repostCount}
                  </PostAction>
                </Col>
                <Col>
                  <PostAction>
                    <FontAwesomeIcon onClick={onLikeClick}
                                     icon={isLiked ? faHeartSolid : faHeartRegular}
                                     color={isLiked ? '#F31260' : '#787F85'}
                    />
                    {showLikeCount && likeCount}
                  </PostAction>
                </Col>
              </Row>
          )}
        </Col>
      </Row>
  )
}