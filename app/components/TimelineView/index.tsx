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
        return true
    })

    const memoryhogehoge = [...hogehoge];
    for (let i = hogehoge.length - 1; i >= 0; i--) {
        if (hogehoge[i].reply !== undefined) {
            for (let j = 0; j < hogehoge.length; j++) {
                if (hogehoge[j].reply !== undefined) {
                    if (
                        hogehoge[j].reply.root.cid === hogehoge[i].reply.root.cid &&
                        hogehoge[j].post.cid === hogehoge[i].reply.parent.cid
                    ) {
                        memoryhogehoge[i].reply.parent = {
                            ...memoryhogehoge[i].reply.parent,
                            reply: hogehoge[j].reply.parent
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

    const kanseihinList :any = []
    for(const item in memoryhogehoge){
        //console.log(memoryhogehoge[item])
        if(memoryhogehoge[item]?.reply?.parent?.reply !== undefined){
            const returnObj = (getDeepestReply(memoryhogehoge[item]?.reply.parent?.reply))
            //console.log(returnObj)
            if(returnObj.cid === memoryhogehoge[item]?.reply?.root?.cid){
                //console.log('削除対象')
                const kanseihin = removeObject(memoryhogehoge[item], returnObj)
                //console.log(kanseihin)
                kanseihinList.push(kanseihin)
            }else{
                kanseihinList.push(memoryhogehoge[item])
            }
        }else{
            kanseihinList.push(memoryhogehoge[item])
        }
        //console.log('pass')
    }

    function findDifference(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
        const diff: Record<string, any> = {};

        for (const key in obj1) {
            if (obj1?.hasOwnProperty(key)) {
                if (!obj2?.hasOwnProperty(key)) {
                    diff[key] = obj1[key];
                } else {
                    const value1 = obj1[key];
                    const value2 = obj2[key];

                    if (typeof value1 === 'object' && typeof value2 === 'object') {
                        const nestedDiff = findDifference(value1, value2);
                        if (Object.keys(nestedDiff).length > 0) {
                            diff[key] = nestedDiff;
                        }
                    } else if (value1 !== value2) {
                        diff[key] = value1;
                    }
                }
            }
        }

        return diff;
    }


    const memoryhogehoge1 = [...kanseihinList];
    const sagyouMemory = [...kanseihinList]
    //下から上に、後から
    for (let i = kanseihinList.length - 1; i >= 0; i--) {
        if (kanseihinList[i].reply !== undefined) {
            //上から下に、先に
            for (let j = 0; j < kanseihinList.length; j++) {
                if (kanseihinList[j].reply !== undefined) {
                    if(kanseihinList[j].reply.root.cid === kanseihinList[i].reply.root.cid){
                        const result = findDifference(kanseihinList[j],kanseihinList[i])
                        if(Object.keys(result).length !== 0) {
                            if(kanseihinList[j].post.did === kanseihinList[i].post.did){
                                if( kanseihinList[j].reply?.parent?.record?.reply?.parent?.cid === kanseihinList[i].post.cid){
                                    //console.log('衝突したcid: ' + kanseihinList[i].post.cid)
                                    //console.log(result)
                                    //console.log(kanseihinList[j])
                                    //console.log(kanseihinList[i])
                                    kanseihinList[j].reply.parent.reply = kanseihinList[i].post
                                    kanseihinList[j].reply.parent.reply.reply = kanseihinList[i].reply.parent
                                    //console.log(kanseihinList[j])
                                    memoryhogehoge1[i].deleteTarget = true;

                                }
                            }
                            //bafyreic5d4zs6lcbqjfwfubqgokuyz2x5mlo42szzqdmndqlonn42g3sky
                        }
                    }
                }
            }
        }
    }


    kanseihinList.forEach((item:any, index:any) => {
        if (item?.deleteTarget === true) {

            delete kanseihinList[index];
        }
    })
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
                  //console.log(key)
                  if (muteWords.some(word => (feed.post.record as any)?.text.includes(word))) {
                      return null
                  }
                  if(feed?.reply){
                      if(muteWords.some(word => (feed.reply.parent.record as any)?.text.includes(word))){
                          return null
                      }
                      //基本的にフォローしてない人は表示ない
                      //ただ、それに該当する場合でも、repostされたreplyは表示する
                      if(feed?.post.author.did !== agent?.session?.did){
                          if((feed.post.author.viewer.isFollowing != true) && feed.reply.parent.author.viewer.isFollowing != true){
                              if(feed.post.author.did !== feed.reply.parent.author.did){
                                  return null
                              }
                          }
                      }
                      if(muteWords.some(word => (feed.reply.root.record as any)?.text.includes(word))){
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
