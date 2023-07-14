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
import {FeedView} from "@/components/ThreadFeedView";

/**
 * SetttingsModal props.
 */
export type PostThreadModalProps = {
    open: boolean
    onClose: () => void
    threadId: string
}

/**
 * SetttingsModal component.
 */
export const PostThreadModal = (props: PostThreadModalProps) => {
    const { open, onClose, threadId } = props;
    const [agent] = useAgent();
    const [threadData, setThreadData] = useState<FeedViewPost | NotFoundPost | BlockedPost | { [k: string]: unknown; $type: string; } | undefined>(undefined);
    const [nestedReplies, setNestedReplies] = useState<any[]>([])
    const [isProssecing, setIsProcessing] = useState(false)
    const [returnThreadData, setReturnThreadData] = useState<any[]>([])

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
                console.log(threadId)
                const result = await agent.app.bsky.feed.getPostThread({
                    uri: threadId,
                });

                if (result && result.data && result.data.thread) {
                    const postThread = result.data.thread;
                    setReturnThreadData([result.data])
                    setThreadData(postThread);

                    const nestedReplies = printNestedReplies(postThread?.replies as any);
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
                <Row css={{ my: '$8' , overflow:'hidden'}}>
                    <FeedView feed={returnThreadData} />
                </Row>
            </Modal.Body>
        </Modal>
    )
}
