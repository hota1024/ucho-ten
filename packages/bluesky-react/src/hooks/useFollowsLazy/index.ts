import { AppBskyFeedDefs, type AppBskyGraphGetFollows } from "@atproto/api";
import {type OutputSchema } from "@atproto/api/dist/client/types/app/bsky/graph/getFollows";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";
import { useFollowsStore } from "@/states";

import type { UseFollowsLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useFollowsLazy(
    params?: AppBskyGraphGetFollows.QueryParams,
    opts?: AppBskyGraphGetFollows.CallOptions
): UseFollowsLazyReturn {
    // shared states //
    const client = useClient();
    const { combinedFollows, merge } = useFollowsStore();

    // local states //
    const [follows, setFollows] = useState<ProfileView[] | null>(null);
    const [cursor, setCursor] = useState<string | null>(null)
    const [targetDid, setTargetDid] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchFollows = useCallback(
        async (actor: string, cursor?: string) => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.getFollows({ actor: actor, cursor:cursor }, opts);
                const { follows } = data
                console.log(data)
                setCursor(data?.cursor as string)
                merge(new Map<string, ProfileView[]>([[data.subject.did, data.follows]]));
                setFollows(follows);

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
        if (!follows) {
            return;
        }

        const newPost = combinedFollows.get(targetDid as string);

        if (newPost) {
            setFollows(newPost);
        }
    }, [follows, setFollows]);

    return { follows, cursor, fetchFollows, loading, error };
}