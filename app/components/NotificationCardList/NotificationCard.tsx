import { useAgent } from '@/atoms/agent'
import {
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyGraphFollow,
} from '@atproto/api'
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import {
  PostView,
  ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {Card, Loading, styled, Text, Row, Col, Dropdown} from '@nextui-org/react'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faHeart as faHeartRegular,faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons'
import {faComment, faUser} from "@fortawesome/free-regular-svg-icons";
import {
  faRetweet as faRetweetSolid,
} from '@fortawesome/free-solid-svg-icons'

/**
 * NotificationCard props.
 */
export type NotificationCardProps = {
  item: Notification
  onFetch: () => PostView | Promise<PostView>
}

/**
 * NotificationCard component.
 */

const PostAction = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  fontWeight: '$medium',
  color: '$gray700',
  //cursor: 'pointer',
})

export const NotificationCard: React.VFC<NotificationCardProps> = (props) => {
  const [agent] = useAgent()
  const { item , onFetch } = props
  const [post, setPost] = useState<ThreadViewPost | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isReposted, setIsReposted] = useState(false)
  const [isReactionProcessing, setIsReactionProcessing] = useState(false)
  //console.log(post)
  //console.log(isLiked)

  const fetchNotificationDetails = async () => {
    if (!agent) {
      return
    }

    if (AppBskyFeedLike.isRecord(item.record)) {
      const result = await agent.getPostThread({
        uri: item.record.subject.uri,
      })
      console.log(result)

      setPost(result.data.thread as ThreadViewPost)
    } else if (AppBskyFeedPost.isRecord(item.record)) {
      const result = await agent.getPostThread({
        uri: item.uri,
      })
      console.log(result)
      setIsLiked(!!result.data.thread?.post?.viewer?.like)
      setIsReposted(!!result.data.thread?.post?.viewer?.repost)

      setPost(result.data.thread as ThreadViewPost)
    }
  }

  const handleLikeClick = async () => {
    if (!agent) {
      return
    }
    console.log('hogehoge')

    //非同期のlikeがまだ処理中だったらreturn
    if(isReactionProcessing){
      return
    }
    setIsReactionProcessing(true)


    //let fetchedPost = await onFetch()
    //console.log(fetchedPost)
    console.log(post)
    /*
    if (fetchedPost.viewer?.like) {

      await agent.deleteLike(fetchedPost.viewer?.like)
      setIsReactionProcessing(false)
    } else {
      await agent.like(post.uri, post.cid)
      setIsReactionProcessing(false)
    }

    await onFetch()
     */
    setIsReactionProcessing(false)

  }

  useEffect(() => {
    fetchNotificationDetails()
  }, [agent, item])

  return (
    <Card variant="bordered" css={{ my: 4 }}>
      {AppBskyFeedLike.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              liked your post{' '}
              <FontAwesomeIcon icon={faHeart} color={'#F31260'} />
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ maxWidth: '300px' }}>
            {post ? (
              <Text>
                {AppBskyFeedPost.isRecord(post.post.record)
                  ? post.post.record.text
                  : '投稿が取得できません。'}
              </Text>
            ) : (
              <Loading />
            )}
          </Card.Body>
        </>
      )}
      {AppBskyFeedPost.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              {item.reason === 'reply' && 'replied to your post  '}
              <FontAwesomeIcon icon={faArrowsTurnRight} color={'orange'} />
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ maxWidth: '300px' }}>
            {post ? (
                <>
                  <Text>
                    {AppBskyFeedPost.isRecord(post.post.record)
                        ? post.post.record.text
                        : '投稿が取得できません。'}
                  </Text>
                  <Row>
                    <Row css={{ mt: '$3'}} align="center">
                      <Col>
                        <PostAction>
                          <FontAwesomeIcon
                              icon={faComment}
                              color="#787F85"
                              style={{ cursor: 'pointer' }}
                          />
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
                            </PostAction>
                          </Dropdown.Trigger>
                          <Dropdown.Menu
                              onAction={(key) => {
                                if (key === 'repost') {
                                  console.log('')
                                } else if (key === 'quoteRepost') {
                                  console.log('')
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
                              onClick={!isReactionProcessing ? handleLikeClick : undefined}
                              icon={isLiked ? faHeartSolid : faHeartRegular}
                              color={isLiked ? '#F31260' : '#787F85'}
                              style={{ cursor: 'pointer' }}
                          />
                        </PostAction>
                      </Col>
                    </Row>
                  </Row>
                </>
            ) : (
              <Loading />
            )}
          </Card.Body>
        </>
      )}
      {AppBskyGraphFollow.isRecord(item.record) && (
        <>
          <Card.Header>
            <Text>
              <Link href={`/profile/${item.author.handle}`}>
                {item.author.displayName ?? item.author.handle}
              </Link>{' '}
              followed you{' '}
              <FontAwesomeIcon
                icon={faUser}
                color={'green'}
                size={'lg'}
              />
            </Text>
          </Card.Header>
        </>
      )}
    </Card>
  )
}
