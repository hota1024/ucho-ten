import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Loading, Row, Spacer, styled, Text } from '@nextui-org/react'
import { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { FeedView } from '../FeedView'
import {useMuteWords} from "@/atoms/settings";
import { useState } from 'react'
import { useAgent } from '@/atoms/agent'


const TimelineContainer = styled('div', {
  maxHeight: '100dvh',
  overflowY: 'scroll',
})

const ReloadButtonContainer = styled('div', {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1,
  top: 32,
  left: 16,
  right: 16,
})

/**
 * TimelineView props.
 */
export type TimelineViewProps = {
  hasNewTimeline?: boolean
  hasMorePosts?: boolean
  onLoadNewTimeline?: () => void
  onLoadMorePosts: (turn: number, loadTop?: boolean) => void
  posts: FeedViewPost[]
  containerRef?: React.RefObject<HTMLDivElement>

  header?: ReactNode
}

/**
 * TimelineView component.
 */
export const TimelineView: React.FC<TimelineViewProps> = (props) => {
  const {
    hasNewTimeline,
    posts,
    containerRef,
    hasMorePosts,
    onLoadMorePosts,
    header,
  } = props
  const [agent] = useAgent()
  const onLoadNewTimeline = props.onLoadNewTimeline ?? (() => {})
  const [muteWords, setMuteWords] = useMuteWords()
  //重複するrepostを一番古いものを一つだけ残して削除し、その削除したpostが何回被ったかをconsoleで出力する
    const uniqueItems: Array<{ post: { cid: string }, reply?: any }> = posts.reduceRight((acc, item) => {
        const isDuplicate = acc.some((i) => i.post.cid === item.post.cid);
        if (!isDuplicate) {
            acc.unshift(item);
        }
        return acc;
    }, [] as Array<{ post: { cid: string }, reply?: any }>);

  
    //uniqueItemsをfor文で全て出力
    const hogehoge = uniqueItems.filter((item) => {
        if (item.reply === undefined) {
            const hasDuplicate = uniqueItems.some((item2) => item2.reply !== undefined && item.post.cid === item2.reply.parent.cid);
            if (hasDuplicate) {
                console.log(item);
                return false; // item を削除するために false を返す
            }
        }
        return true; // item を残すために true を返す
    });





    /*
    const deleteDuplicateReply = (replyItems: Array<{ post: { cid: string }, reply?: any }>) => {
        replyItems.forEach((item, index, self) => {
            if (item.reply !== undefined) {
                const isDuplicate = self.some((i) => i.post.cid === item.reply?.parent?.cid);
                if (isDuplicate) {
                    self.splice(index, 1)
                }
            }
        })
    }
     */

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <ReloadButtonContainer
        css={{
          visibility: hasNewTimeline ? 'visible' : 'hidden',
        }}
      >
        <Button shadow color="primary" auto onPress={onLoadNewTimeline}>
          Load New posts
        </Button>
      </ReloadButtonContainer>
      <TimelineContainer
        ref={containerRef}
        style={{ height: '100dvh', overflowY: 'auto' }}
      >
        <InfiniteScroll
          loadMore={onLoadMorePosts}
          hasMore={hasMorePosts}
          loader={
            <div
              key={0}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                height: 'calc(100% - 3vh)',
              }}
            >
              <Loading size="lg" />
            </div>
          }
          threshold={2500}
          useWindow={false}
        >
          {header}
          <>
              {hogehoge.map((feed:any, key:any) => {
                  //console.log(feed)
                  //console.log(agent)
                  if (muteWords.some(word => (feed.post.record as any)?.text.includes(word))) {
                      return null; // マッチする要素がある場合は何も返さず、非表示にする
                  }
                  if(feed?.reply){
                      // @ts-ignore
                      if(!feed?.reply?.parent?.author?.viewer?.following as any && feed?.post.author.did !== agent?.session.did){
                            return null
                      }
                      if(muteWords.some(word => (feed?.reply?.parent?.record as any)?.text.includes(word))){
                          return null
                      }
                  }
                  return (
                      <Row key={`${feed.post.cid}${key}`} css={{ my: '$8' }}>
                          <FeedView feed={feed} />
                      </Row>
                  )
              })}
          </>

          <Row css={{ my: 64 }} justify="center">
            <Text color="rgba(0, 0, 0, 0.5)" b>
              end of feed
            </Text>
          </Row>
        </InfiniteScroll>
      </TimelineContainer>
    </div>
  )
}
