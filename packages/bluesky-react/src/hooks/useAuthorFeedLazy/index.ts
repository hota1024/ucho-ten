import { type AppBskyFeedGetAuthorFeed } from "@atproto/api";
import { type PostView, type FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";
import { useAuthorFeedStore } from "@/states";

import { UseAuthorFeedLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetAuthorFeed.QueryParams`
 * @param opts `UseAuthorFeedOpts`
 * @returns `UseAuthorFeedLazyReturn`
 */
export function useAuthorFeedLazy(
    params?: AppBskyFeedGetAuthorFeed.QueryParams,
    opts?: AppBskyFeedGetAuthorFeed.CallOptions
): UseAuthorFeedLazyReturn {
    // shared states //
    const client = useClient();
    const { feeds, merge } = useAuthorFeedStore();

    // local states //
    const [authorfeed, setAuthorFeed] = useState<FeedViewPost[] | null>(null);
    const [cursor, setCursor] = useState<string | "">("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchAuthorFeed = useCallback(
        async (actor: string, cursor: string) => {
            try {
                setError(null);
                setLoading(true);

                const {data} = await client.agent.getAuthorFeed({ actor: actor, cursor: cursor }, opts);

                //console.log(await client.agent.getAuthorFeed({ actor: actor, cursor: cursor }, opts))
                const { feed } = data;

                const newData = new Map<string, FeedViewPost>();
                newData.set(data.cursor as string, feed as never);

                merge(newData);

                setAuthorFeed(feed);

                return data as never;
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
        if (!authorfeed) {
            return;
        }

        const newAuthorFeed = feeds.get(cursor);

        if (newAuthorFeed) {
            setAuthorFeed([newAuthorFeed]);
        }
    }, [authorfeed, feeds]);

    return { authorfeed, cursor, fetchAuthorFeed, loading, error } as never;
}
