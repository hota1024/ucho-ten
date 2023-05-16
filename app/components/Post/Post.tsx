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
  Text,
  Dropdown,
} from '@nextui-org/react'
import Link from 'next/link'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { utx, makeConsecutiveUnits, makeUnit } from 'utx'
import { PostRecordTextView } from '../PostRecordTextView'
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { AppBskyEmbedRecord, AppBskyEmbedImages } from '@atproto/api'
import { useAgent } from '@/atoms/agent'
import { ImagesGrid } from '../ImagesGrid'

const RepostByLabel = styled('div', {
  fontSize: '$sm',
  fontWeight: 'bold',
  color: '$gray700',
  '& a': {
    color: '$gray700',
  },
  '&:hover': {
    textDecoration: 'underline',
  },
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

const URLCard = styled('div', {
  height: '100px',
  width: '485px',
  borderRadius: ' 10px',
  overflow: 'hidden',
  border: '1px solid $gray600',
  display: 'flex',
  alignItems: 'center',
  color: '$gray800',
})

const URLCardThumb = styled('div', {
  height: '100px',
  width: '100px',
  borderRight: '1px solid $gray600',
})
const URLCardDetail = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px',
  height: '100%',
  width: 'calc(100% - 110px)',
})
const URLCardTitle = styled('div', {
  fontSize: '$sm',
  fontWeight: 'bold',
  color: '$gray800',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  marginBottom: '$1',
})
const URLCardDesc = styled('div', {
  fontSize: '$xs',
  color: '$gray700',
  marginTop: '$1',
})

interface PostProps {
  myDid?: string
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

  isMuted?: boolean
  isLiked?: boolean
  isReposted?: boolean
  onLikeClick?: () => void
  onRepostClick?: () => void
  onQuoteRepostClick?: () => void

  isFollowing?: boolean
  isReactionProcessing?: boolean
  onFollowClick?: () => void

  onReplyClick?: () => void
}

export const Post = (props: PostProps) => {
  const {
    myDid,
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
    isMuted,
    isLiked,
    isReposted,
    isFollowing,
    isReactionProcessing,
    onReplyClick,
  } = props
  const onLikeClick = props.onLikeClick ?? (() => {})
  const onRepostClick = props.onRepostClick ?? (() => {})
  const onQuoteRepostClick = props.onQuoteRepostClick ?? (() => {})
  const onFollowClick = props.onFollowClick ?? (() => {})

  const [agent] = useAgent()
  const [followHover, setFollowHover] = useState(false)
  const [showEmbedImages, setShowEmbedImages] = useState(!isEmbed)

  const images = AppBskyEmbedImages.isView(embed) ? embed.images ?? [] : []

  const [elapsed, setElapsed] = useState<number>()
  const time = useMemo(() => createdAt && new Date(createdAt), [createdAt])

  /*if(embed && embed.$type === "app.bsky.embed.recordWithMedia#view"){
    console.log(embed)
  }*/

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

  if (!author) {
    return <></>
  }

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
                    src={
                      author.avatar
                        ? author.avatar
                        : '/images/profileDefaultIcon/kkrn_icon_user_6.svg'
                    }
                    size="lg"
                    name={((author.displayName ?? `@${author.handle}`).length >= 25 ? (author.displayName ?? `@${author.handle}`).slice(0, 25) : (author.displayName ?? `@${author.handle}`)) + (((author.displayName ?? `@${author.handle}`).length >= 25) ? '...' : '')}

                    description={`@${author.handle.length >= 30 ? author.handle.slice(0, 25) + '...' : author.handle}`}
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
                    disabled={myDid === author.did}
                  >
                    {isFollowing
                      ? followHover
                        ? 'UnFollow'
                        : 'Following'
                      : 'Follow'}
                  </Button>
                </Col>
              </Row>
            </Container>
          }
        >
          <Link href={`/profile/${author.handle}`}>
            <Avatar
              pointer
              squared
              src={
                author.avatar
                  ? author.avatar
                  : '/images/profileDefaultIcon/kkrn_icon_user_6.svg'
              }
              size={isEmbed ? 'md' : 'lg'}
            />
          </Link>
        </Tooltip>
      </div>
      <Spacer x={1} />
      <Col>
        {reasonRepost && (
          <Link href={`/profile/${reasonRepost.by.handle}`}>
            <RepostByLabel>
              Reposted by {reasonRepost.by.displayName}
            </RepostByLabel>
          </Link>
        )}
        <PostInfo>
          <Link style={{ display: 'block' }} href={`/profile/${author.handle}`}>
            <AuthorDisplayName>
              {!isEmbed && ((author.displayName ?? `@${author.handle}`).length >= 25 ? (author.displayName ?? `@${author.handle}`).slice(0, 25) : (author.displayName ?? `@${author.handle}`)) + (((author.displayName ?? `@${author.handle}`).length >= 25) ? '...' : '')}
              {isEmbed && ((author.displayName ?? `@${author.handle}`).length >= 20 ? (author.displayName ?? `@${author.handle}`).slice(0, 17) : (author.displayName ?? `@${author.handle}`)) + (((author.displayName ?? `@${author.handle}`).length >= 17) ? '...' : '')}
            </AuthorDisplayName>
          </Link>
          <Link style={{ display: 'block' }} href={`/profile/${author.handle}`}>
            <AuthorHandle>
              @{author.handle.length >= 30 ? `${author.handle.slice(0,22)}...`: author.handle}
            </AuthorHandle>
          </Link>
          <PostDate>
            <Link
              style={{ display: 'block' }}
              href={`https://staging.bsky.app/profile/${author.handle}/post/${postUri}`}
              target={'_blank'}
            >
              {elapsed && `${timeUnit(elapsed, { noZero: true })[0]}`}
            </Link>
          </PostDate>
        </PostInfo>

        <PostRecordTextView record={record} />
        {embed &&
          isEmbed &&
          showEmbedImages &&
          embed.$type === 'app.bsky.embed.images#view' && (
            <a onClick={() => setShowEmbedImages(false)}>hide images</a>
          )}
        {embed &&
          isEmbed &&
          !showEmbedImages &&
          embed.$type === 'app.bsky.embed.images#view' && (
            <a onClick={() => setShowEmbedImages(true)}>show images</a>
          )}

        {embed && !isEmbed && embed.$type === 'app.bsky.embed.record#view' && (
          <>
            <Post
              myDid={myDid}
              record={(embed.record as Record).value as Record}
              author={(embed.record as Record).author as ProfileViewBasic}
              isFollowing={
                !!((embed.record as Record).author as ProfileViewBasic)?.viewer
                  ?.following
              }
              postUri={
                (embed.record as { uri: string }).uri.split('/').pop() as string
              }
              createdAt={(embed.record as Record).indexedAt as string}
              embed={
                (embed?.record as any)?.embeds?.length
                  ? ((embed.record as any)
                      .embeds[0] as AppBskyEmbedRecord.ViewRecord as any)
                  : null
              }
              isEmbed
              hideActions
            />
          </>
        )}

        {images.length > 0 && showEmbedImages && <ImagesGrid images={images} />}
        {!!embed?.media && (embed?.media as any)?.images?.length > 0 && (
          <ImagesGrid images={(embed?.media as any)?.images} />
        )}

        {embed && !isEmbed && embed.$type === 'app.bsky.embed.external#view' && (
          <a
            href={(embed as any)?.external?.uri}
            target="_blank"
            rel="noopener noreferrer"
          >
            <URLCard>
              <URLCardThumb>
                <img
                  src={(embed as any)?.external?.thumb}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  alt={(embed as any)?.external?.alt}
                ></img>
              </URLCardThumb>
              <URLCardDetail>
                <div>
                  <URLCardTitle style={{ color: 'black' }}>
                    {(embed as any)?.external?.title}
                  </URLCardTitle>
                  <URLCardDesc style={{ fontSize: 'small' }}>
                    {(embed as any)?.external?.description}
                  </URLCardDesc>
                </div>
              </URLCardDetail>
            </URLCard>
          </a>
        )}

        {embed &&
          !isEmbed &&
          embed.$type === 'app.bsky.embed.recordWithMedia#view' && (
            <>
              <Post
                myDid={myDid}
                record={(embed.record as any)?.record.value as Record}
                author={
                  (embed.record as any)?.record.author as ProfileViewBasic
                }
                isFollowing={(embed.record as any).record?.author?.viewer?.following as boolean}
                postUri={(embed.record as any).record?.uri.split('/').pop() as string}
                createdAt={(embed.record as any).record?.indexedAt as string}
                embed={
                  (embed.record as any)?.record
                    ?.embeds[0] as AppBskyEmbedRecord.ViewRecord
                }
                isEmbed
                hideActions
              />
            </>
          )}

        {!hideActions && (
          <Row css={{ mt: '$3', mb: hasReply ? '$10' : '$0' }} align="center">
            <Col>
              <PostAction>
                <FontAwesomeIcon
                  icon={faComment}
                  color="#787F85"
                  style={{ cursor: 'pointer' }}
                  onClick={onReplyClick}
                />
                {showReplyCount && replyCount}
              </PostAction>
            </Col>
            <Col>
              <Dropdown placement="bottom-left">
                <Dropdown.Trigger>
                  <PostAction>
                    <FontAwesomeIcon
                      //onClick={onRepostClick}
                      icon={faRetweetSolid}
                      //color="#787F85"
                      color={isReposted ? '#36BA7A' : '#787F85'}
                      style={{ cursor: 'pointer' }}
                    />
                    {showRepostCount && repostCount}
                  </PostAction>
                </Dropdown.Trigger>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === 'repost') {
                      onRepostClick()
                    } else if (key === 'quoteRepost') {
                      onQuoteRepostClick()
                    }
                  }}
                >
                  <Dropdown.Item key="repost">
                    {isReposted === false && <Text>Repost</Text>}
                    {isReposted === true && (
                      <Text color={'error'}>UnRepost</Text>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Item key="quoteRepost">
                    <Text>Quote Repost</Text>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <PostAction>
                <FontAwesomeIcon
                  onClick={!isReactionProcessing ? onLikeClick : undefined}
                  icon={isLiked ? faHeartSolid : faHeartRegular}
                  color={isLiked ? '#F31260' : '#787F85'}
                  style={{ cursor: 'pointer' }}
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
