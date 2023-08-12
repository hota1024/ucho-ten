import type { AppBskyFeedGetPostThread } from "@atproto/api";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";
import { usePostStore } from "@/states";

import type { UsePostLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */

export function usePostLazy(
    params?: AppBskyFeedGetPostThread.QueryParams,
    opts?: AppBskyFeedGetPostThread.CallOptions,
): UsePostLazyReturn {
  // shared states //
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const client = useClient();
  const { posts, merge } = usePostStore();

  // local states //
  const [post, setPost] = useState<PostView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchPost = useCallback(async (uri: string) => {
    // TODO: 実装する。

    try {
      setError(null);
      setLoading(true);

      const res = await client.agent.getPostThread({uri: uri}, opts);
      const post: PostView = res.data.thread.post as PostView; // Explicit type cast
      console.log(post)

      merge(new Map([[post.uri, post]]));

      setPost(post);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    return post as PostView;
  }, [client.agent, merge, opts, post]);

  // effects //
  useEffect(() => {
    // TODO: 実装する。
    if (!post) {
      return;
    }

    const newPost = posts.get(post.uri);

    if (newPost) {
      setPost(newPost);
    }
  }, [post, posts]);

  return { post, fetchPost, loading, error };
}
