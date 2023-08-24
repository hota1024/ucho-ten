import { AppBskyFeedDefs, type AppBskyFeedGetPosts } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "@/hooks";
import { usePostStore } from "@/states";

import type { UsePostsLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function usePostsLazy(
    params?: AppBskyFeedGetPosts.QueryParams,
    opts?: AppBskyFeedGetPosts.CallOptions
): UsePostsLazyReturn {
    // shared states //
    const client = useClient();
    const { posts, merge } = usePostStore();

    // local states //
    const [post, setPost] = useState<PostView[] | null>(null);
    const [targetDid, setTargetDid] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchPosts = useCallback(
        async (uris: string[]) => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.getPosts({ uris:uris }, opts);
                const { posts } = data;

                for (const item of posts) {
                    merge(new Map<string, PostView>([[item.uri, item]]));

                }

                setPost(posts);

                return posts as PostView[];
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
        if (!post) {
            return;
        }

        const newPost = posts.get(targetDid as string);

        if (newPost) {
            setPost([newPost]);
        }
    }, [post, setPost]);

    return { post, fetchPosts, loading, error };
}
