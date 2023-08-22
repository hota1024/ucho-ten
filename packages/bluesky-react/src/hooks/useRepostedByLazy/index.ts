import { AppBskyFeedDefs, type AppBskyFeedGetRepostedBy } from "@atproto/api";
import {type ProfileView, ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";

import type { UseRepostedByLazyReturn } from "./type";
import {useRepostedBysStore} from "@/states";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */

export function useRepostedByLazy(
    params?: AppBskyFeedGetRepostedBy.QueryParams,
    opts?: AppBskyFeedGetRepostedBy.CallOptions
): UseRepostedByLazyReturn {
    // shared states //
    const client = useClient();
    const { profiles, merge } = useRepostedBysStore();

    // local states //
    const [repostedBy, setRepostedBy] = useState<ProfileViewDetailed[] | null>(null);
    const [atUri, setAtUri] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchRepostedBy = useCallback(
        async (uri: string) => {
            try {
                setError(null);
                setLoading(true);

                const {data} = await client.agent.getRepostedBy({ uri: uri }, opts);
                console.log(data)
                const {repostedBy} = data;

                setCursor(data?.cursor as string);
                setAtUri(uri)

                merge(new Map<string, ProfileViewDetailed[]>([[data.uri, repostedBy]]));
                setRepostedBy(repostedBy as ProfileViewDetailed[]);
                return repostedBy as ProfileViewDetailed[];
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
        if (!repostedBy) {
            return;
        }

        const newRepostedBy = profiles.get(atUri as string);

        if (newRepostedBy) {
            setRepostedBy(newRepostedBy);
        }
    }, [repostedBy, profiles]);

    return { repostedBy, cursor, atUri, fetchRepostedBy, loading, error };
}
