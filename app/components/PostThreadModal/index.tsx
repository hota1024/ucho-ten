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
    const [threadData, setThreadData] = useState<FeedViewPost | undefined>(undefined);

    useEffect(() => {
        const getPostThread = async () => {
            if (!agent) {
                return;
            }

            try {
                const result = await agent.app.bsky.feed.getPostThread({
                    uri: 'at://did:plc:owybkbkx7ph76awaqlldeccc/app.bsky.feed.post/3jztkpobp222z',
                });
                const postThread = result.data.thread;
                setThreadData(postThread)
            } catch (error) {
                console.error('Error retrieving post thread:', error);
            }
        };

        if (open) {
            getPostThread();
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
                {threadData && <Text>{JSON.stringify(threadData)}</Text>}
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={onClose} flat css={{ width: '100%' }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
