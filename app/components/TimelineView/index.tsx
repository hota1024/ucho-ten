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
                return false
            }
        }if(item.reply !== undefined && false) {
            const hasDuplicate = uniqueItems.some((item2) => item2.reply !== undefined && item.reply.parent.cid === item2.reply.root.cid)
            if (hasDuplicate) {
                return false
            }
        }
        /*if(item.reply !== undefined){
            const hasDuplicate = uniqueItems.some((item2) => item2.reply !== undefined && item.reply.parent.cid === item2.reply.root.cid || item2.reply !== undefined && item.reply.root.cid === item2.reply.root.cid && item.post.cid === item2.reply.parent.cid );
            if (hasDuplicate) {
                return false
            }
        }*/

        return true
    })


    const newHogehoge = [...hogehoge];
    const memoryhogehoge = [...hogehoge];

    for (let i = hogehoge.length - 1; i >= 0; i--) {
        if (hogehoge[i].reply !== undefined) {
            for (let j = 0; j < newHogehoge.length; j++) {
                if (newHogehoge[j].reply !== undefined) {
                    if (
                        newHogehoge[j].reply.root.cid === hogehoge[i].reply.root.cid &&
                        newHogehoge[j].post.cid === hogehoge[i].reply.parent.cid
                    ) {
                        memoryhogehoge[i].reply.parent = {
                            ...memoryhogehoge[i].reply.parent,
                            reply: newHogehoge[j].reply.parent
                        };
                        //console.log('結果');
                        //console.log(memoryhogehoge[i])
                        //@ts-ignore
                        memoryhogehoge[j].deleteTarget = true;
                    }
                }
            }
        }
    }

    memoryhogehoge.forEach((item, index) => {
        //@ts-ignore
        if (item?.deleteTarget === true) {
            delete memoryhogehoge[index];
        }
    })
    //console.log(memoryhogehoge)

    function getDeepestReply(obj: any): any {
        if (obj.reply && typeof obj.reply === 'object') {
            return getDeepestReply(obj.reply);
        }
        return obj;
    }

    function removeObject(obj:any, objectToRemove:any):any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (obj === objectToRemove) {
            return null;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => removeObject(item, objectToRemove));
        }

        const updatedObj = { ...obj };
        for (const key in updatedObj) {
            updatedObj[key] = removeObject(updatedObj[key], objectToRemove);
        }

        return updatedObj;
    }

    console.log(memoryhogehoge)

    const kanseihinList = []

    for(const item in memoryhogehoge){
        console.log(memoryhogehoge[item])
        if(memoryhogehoge[item]?.reply?.parent?.reply !== undefined){
            const returnObj = (getDeepestReply(memoryhogehoge[item]?.reply.parent?.reply))
            console.log(returnObj)
            if(returnObj.cid === memoryhogehoge[item]?.reply?.root?.cid){
                console.log('削除対象')
                const kanseihin = removeObject(memoryhogehoge[item], returnObj)
                console.log(kanseihin)
                kanseihinList.push(kanseihin)
            }else{
                kanseihinList.push(memoryhogehoge[item])
            }
        }else{
            kanseihinList.push(memoryhogehoge[item])
        }
        console.log('pass')
    }
    console.log('こちらが完成品です')
    console.log(kanseihinList)

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
              {kanseihinList.map((feed:any, key:any) => {
                  //console.log(feed)
                  //ミュートワードが含まれている場合は表示しない
                  if (muteWords.some(word => (feed.post.record as any)?.text.includes(word))) {
                      return null
                  }
                  //リプライの場合はリプライ元の人をフォローしていない、かつ、リプライ元の人が自分ではない場合は表示しない
                  if(feed?.reply){
                      // @ts-ignore
                      //ただし、repostだった場合はリプライ元の人をフォローしていなくても表示する
                      if(!feed?.reason && !feed?.reply?.parent?.author?.viewer?.following as any && feed?.post.author.did !== agent?.session?.did){
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
