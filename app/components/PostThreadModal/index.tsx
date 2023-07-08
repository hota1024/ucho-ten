import {
    useMuteWords,
    useShowMuteUserInNotifications,
    useShowMuteUserInSearch,
} from '@/atoms/settings'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Button,
    Card,
    Col,
    Input,
    Modal,
    Row,
    Spacer,
    Switch,
    Text,
    Textarea,
} from '@nextui-org/react'
import { useAgent } from '@/atoms/agent'
import { BskyAgent } from '@atproto/api'
import { FeedViewPost,NotFoundPost,BlockedPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { useEffect, useRef, useState } from 'react'
import {
    TimelineFetcher,
    useTimelineView,
} from '@/components/TimelineView/useTimelineView'

/**
 * SetttingsModal props.
 */
export type SetttingsModalProps = {
    open: boolean
    onClose: () => void
    threadId: string
}

/**
 * SetttingsModal component.
 */
export const SetttingsModal = (props: SetttingsModalProps) => {
    const { open, onClose, threadId } = props;
    const [agent] = useAgent();
    const [threadData, setThreadData] = useState<FeedViewPost | NotFoundPost | BlockedPost | { [k: string]: unknown; $type: string; } | undefined>(undefined);
    const [nestedReplies, setNestedReplies] = useState<any[]>([])
    const [isProssecing, setIsProcessing] = useState(false)

    useEffect(() => {
        if (!open) {
            return
        }

        const getPostThread = async () => {
            // ...
            if (!agent) {
                return;
            }

            try {
                setIsProcessing(true);
                const result = await agent.app.bsky.feed.getPostThread({
                    uri: threadId,
                });

                if (result && result.data && result.data.thread) {
                    const postThread = result.data.thread;
                    setThreadData(postThread);
                    console.log(postThread);

                    const nestedReplies = printNestedReplies(postThread?.replies as any);
                    console.log(nestedReplies);
                    setNestedReplies(nestedReplies);
                } else {
                    throw new Error('Invalid post thread data');
                }
            } catch (error) {
                console.error('Error retrieving post thread:', error);
            } finally {
                setIsProcessing(false);
            }
        };

        function printNestedReplies(posts: any[], result: any[] = []): any[] {
            if(posts !== undefined){
                for (const post of posts) {
                    result.push(post.post);

                    if (post.replies && post.replies.length > 0) {
                        printNestedReplies(post.replies, result);
                    }
                }
            }
            return result
        }

        if (open) {
            setIsProcessing(true);
            getPostThread()
                .then((result) => {
                    //@ts-ignore
                    const postThread = result.data.thread;
                    setThreadData(postThread);
                    console.log(postThread);

                    const nestedReplies = printNestedReplies(postThread.replies);
                    console.log(nestedReplies);
                    setNestedReplies(nestedReplies);
                })
                .catch((error) => {
                    console.error('Error retrieving post thread:', error);
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        }

    }, [agent, open, setThreadData, setIsProcessing, setNestedReplies]);

    if (!open) {
        return null;
    }
    if(isProssecing && ((threadData?.post as any)?.record as any)?.text as string === undefined){
        return (
            <Modal
                open={open}
                onClose={onClose}
                width='600px'
                css={{left: '2%'}}
            >
                <Modal.Header>
                    <Text size="$lg" b>
                        Threads
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text>Loading...</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onClose} flat css={{ width: '100%' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }



    return (
        <Modal
            open={open}
            onClose={onClose}
            width='600px'
            css={{left: '2%'}}
        >
            <Modal.Header>
                <Text size="$lg" b>
                    Threads
                </Text>
            </Modal.Header>
            <Modal.Body>
                <div style={{width: '100%'}}>

                    <div>
                        <span style={{overflow:"hidden"}}><img src={((threadData?.post as any)?.author as any)?.avatar as string} style={{height:"30px", borderRadius:"30px", position:"relative", top:"10px"}}></img></span>

                        {((threadData?.post as any)?.author as any)?.displayName as string}
                        {" "}
                        {" @"}{((threadData?.post as any)?.author as any)?.handle as string}
                    </div>
                    <div style={{width:`calc(100% - 30px)`, marginLeft:'30px'}}>
                        {((threadData?.post as any)?.record as any)?.text as string}
                    </div>
                </div>
                {nestedReplies.map((post, index) => {
                    console.log(post)
                    return(
                        <div key={index} style={{width: '100%'}}>
                            <div>
                                <span style={{overflow:"hidden"}}><img src={post.author.avatar} style={{height:"30px", borderRadius:"30px", position:"relative", top:"10px"}}></img></span>
                                {post.author.displayName} {"@"}{post.author.handle}
                            </div>
                            <div style={{width:`calc(100% - 30px)`, marginLeft:'30px'}}>
                                {post.record.text}
                            </div>
                        </div>
                    )
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={onClose} flat css={{ width: '100%' }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
