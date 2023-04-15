import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Post } from './Post'
import { AppBskyEmbedRecord } from '@atproto/api'

interface PostProps {
  post: PostView
  reasonRepost?: ReasonRepost

  hasReply?: boolean

  showReplyCount?: boolean
  showRepostCount?: boolean
  showLikeCount?: boolean
}

export const PostViewCard = (props: PostProps) => {
  const {
    post,
    reasonRepost,
    hasReply,
    showReplyCount,
    showRepostCount,
    showLikeCount,
  } = props
  const record = post.record as Record
  const embed = post.embed as unknown as AppBskyEmbedRecord.ViewRecord

  return (
    <Post
      record={record}
      embed={embed}
      author={post.author}
      createdAt={record.createdAt}
      reasonRepost={reasonRepost}
      hasReply={hasReply}
      replyCount={post.replyCount}
      repostCount={post.repostCount}
      likeCount={post.likeCount}
      showReplyCount={showReplyCount}
      showRepostCount={showRepostCount}
      showLikeCount={showLikeCount}
    />
  )

  // const images = (post.embed?.images ?? []) as ViewImage[]

  // const [elapsed, setElapsed] = useState<number>()
  // const time = useMemo(
  //   () => new Date(record.createdAt ?? ''),
  //   [record.createdAt]
  // )

  // const updateElapsed = useCallback(() => {
  //   const elapsed = Date.now() - time.getTime()
  //   setElapsed(elapsed)

  //   return elapsed
  // }, [time])

  // useEffect(() => {
  //   updateElapsed()

  //   const id = setInterval(() => {
  //     const elapsed = updateElapsed()

  //     if (elapsed > 6000) {
  //       clearInterval(id)
  //     }
  //   }, 1000)

  //   return () => {
  //     clearInterval(id)
  //   }
  // }, [time, updateElapsed])

  // return (
  //   <Row align="stretch" css={{ position: 'relative' }}>
  //     {hasReply && <ReplyLine />}
  //     <div>
  //       <Tooltip
  //         placement="right"
  //         content={
  //           <Container
  //             css={{
  //               mw: '400px',
  //               width: '100%',
  //               borderRadius: '$lg',
  //               p: '$sm',
  //             }}
  //           >
  //             <Row justify="space-between" align="center">
  //               <Col span={7}>
  //                 <User
  //                   squared
  //                   src={post.author.avatar}
  //                   size="lg"
  //                   name={post.author.displayName}
  //                   description={`@${post.author.handle}`}
  //                 />
  //               </Col>
  //               <Col span={3}>
  //                 <Button auto rounded css={{ ml: '$10' }}>
  //                   フォロー
  //                 </Button>
  //               </Col>
  //             </Row>
  //           </Container>
  //         }
  //       >
  //         <Avatar squared src={post.author.avatar} size="lg" />
  //       </Tooltip>
  //     </div>
  //     <Spacer x={1} />
  //     <Col>
  //       {reasonRepost && (
  //         <RepostByLabel>
  //           {reasonRepost.by.displayName}さんがリポスト
  //         </RepostByLabel>
  //       )}
  //       <PostInfo>
  //         <Link
  //           style={{ display: 'block' }}
  //           href={`/profile/${post.author.handle}`}
  //         >
  //           <AuthorDisplayName>{post.author.displayName}</AuthorDisplayName>
  //         </Link>
  //         <Link
  //           style={{ display: 'block' }}
  //           href={`/profile/${post.author.handle}`}
  //         >
  //           <AuthorHandle>@{post.author.handle}</AuthorHandle>
  //         </Link>
  //         <PostDate>
  //           {elapsed && `${timeUnit(elapsed, { noZero: true })[0]}`}
  //         </PostDate>
  //       </PostInfo>

  //       <PostRecordTextView record={post.record} />

  //       {post.embed && post.embed.$type === 'app.bsky.embed.record#view' && (
  //         <pre>
  //           <code>{JSON.stringify(post.embed.record, null, 2)}</code>
  //         </pre>
  //       )}

  //       {images.length > 0 && (
  //         <Grid.Container
  //           css={{
  //             m: 0,
  //             mt: '$4',
  //             p: 0,
  //             width: '100%',
  //             gap: '$4',
  //             flexFlow: 'row',
  //           }}
  //         >
  //           {images.map((image, key) => (
  //             <Grid key={key} xs={6} css={{ p: 0 }}>
  //               <Zoom>
  //                 <Image
  //                   src={image.fullsize}
  //                   alt={image.alt}
  //                   css={{ borderRadius: '$xs' }}
  //                 />
  //               </Zoom>
  //             </Grid>
  //           ))}
  //         </Grid.Container>
  //       )}

  //       <Row css={{ mt: '$3', mb: hasReply ? '$10' : '$0' }} align="center">
  //         <Col>
  //           <PostAction>
  //             <FontAwesomeIcon icon={faComment} color="#787F85" />
  //             {showReplyCount && post.replyCount}
  //           </PostAction>
  //         </Col>
  //         <Col>
  //           <PostAction>
  //             <FontAwesomeIcon icon={faRetweet} color="#787F85" />
  //             {showRepostCount && post.repostCount}
  //           </PostAction>
  //         </Col>
  //         <Col>
  //           <PostAction>
  //             <FontAwesomeIcon icon={faHeartRegular} color="#787F85" />
  //             {showLikeCount && post.likeCount}
  //           </PostAction>
  //         </Col>
  //       </Row>
  //     </Col>
  //   </Row>
  // )
}
