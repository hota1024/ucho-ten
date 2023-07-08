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
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
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
    const [threadData, setThreadData] = useState<FeedViewPost | undefined>(undefined)
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
                setIsProcessing(true)
                const result = await agent.app.bsky.feed.getPostThread({
                    uri: 'at://did:plc:owybkbkx7ph76awaqlldeccc/app.bsky.feed.post/3jztkpobp222z',
                });
                const postThread = result.data.thread;
                setThreadData(postThread);
                console.log(postThread);

                const nestedReplies = printNestedReplies(postThread.replies);
                console.log(nestedReplies);
            } catch (error) {
                console.error('Error retrieving post thread:', error);
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
            getPostThread()
            const result = printNestedReplies(threadData?.replies)
            setNestedReplies(result)
            console.log(result)
            setIsProcessing(false)
        }

    }, [agent, open]);

    if (!open) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>
                <Text size="$lg" b>
                    Threads
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text>Threads are a way to organize your posts.</Text>
                {false ? ( // Check loading state before displaying the data
                    <Text>Loading...</Text>
                ) : (nestedReplies.map((post) => {
                    console.log(post)
                    return(
                        <div>{post.record.text}</div>
                    )
                }))
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={onClose} flat css={{ width: '100%' }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
