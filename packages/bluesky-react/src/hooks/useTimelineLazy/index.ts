import { type AppBskyFeedGetTimeline } from "@atproto/api";
import { type FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";

//import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";
import { useTimelineStore } from "@/states";

import type { useTimelineLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useTimelineLazy(
    params?: AppBskyFeedGetTimeline.QueryParams,
    opts?: AppBskyFeedGetTimeline.CallOptions
): useTimelineLazyReturn {
    // shared states //
    const client = useClient();
    const { timelines, merge } = useTimelineStore();

    // local states //
    const [timeline, setTimeline] = useState<FeedViewPost[] | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchTimeline = useCallback(
        async (cursor?: string, limit?:number) => {
            try {
                setError(null);
                setLoading(true);

                const res = await client.agent.getTimeline({cursor:cursor, limit:limit}, opts);
                const {data} = res
                const {feed} = res.data

                merge(new Map<string, FeedViewPost[]>([[data.cursor ?? "", feed]]));
                setCursor(data.cursor ?? "");
                setTimeline(feed);
                console.log(cursor)
                return feed as FeedViewPost[];
            } catch (error) {
                setError(error);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [client.agent, merge, opts]
    );

    // effects //
    useEffect(() => {
        if (!timeline) {
            return;
        }

        const newPost = timelines.get(cursor as string);

        if (newPost) {
            setTimeline(newPost);
        }
    }, [timeline, timelines]);

    return { timeline, cursor, fetchTimeline, loading, error };
}
