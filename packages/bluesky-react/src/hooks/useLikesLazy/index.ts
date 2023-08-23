import { type AppBskyFeedGetLikes } from "@atproto/api";
import {type Like } from "@atproto/api/dist/client/types/app/bsky/feed/getLikes";

import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";

import type { UseRepostedByLazyReturn } from "./type";
import { useLikedStore } from "@/states";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetLikes.QueryParams`
 * @param opts `UseLikesOpts`
 * @returns `UseProfileReturn`
 */

export function useRepostedByLazy(
    params?: AppBskyFeedGetLikes.QueryParams,
    opts?: AppBskyFeedGetLikes.CallOptions
): UseRepostedByLazyReturn {
    // shared states //
    const client = useClient();
    const { likes, merge } = useLikedStore();

    // local states //
    const [like, setLike] = useState<Like[] | null>(null);
    const [atUri, setAtUri] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchLikes = useCallback(
        async (uri: string) => {
            try {
                setError(null);
                setLoading(true);

                const {data} = await client.agent.getLikes({ uri: uri }, opts);
                console.log(data)
                const {likes} = data;
                console.log(likes[0].actor)

                setCursor(data?.cursor as string);
                setAtUri(uri)

                merge(new Map<string, Like[]>([[data?.uri, likes]]));
                setLike(likes as never);

                return likes as never;
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
        if (!like) {
            return;
        }

        const newLike = likes.get(atUri as string);

        if (newLike) {
            setLike(newLike);
        }
    }, [like, likes]);

    return { like, cursor, atUri, fetchLikes, loading, error };
}
