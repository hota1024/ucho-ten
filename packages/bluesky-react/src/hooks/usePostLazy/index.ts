import { AppBskyFeedDefs, type AppBskyFeedGetPostThread } from "@atproto/api";
import { type PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
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
  opts?: AppBskyFeedGetPostThread.CallOptions
): UsePostLazyReturn {
  // shared states //
  const client = useClient();
  const { posts, merge } = usePostStore();

  // local states //
  const [post, setPost] = useState<PostView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchPost = useCallback(
    async (uri: string) => {
      try {
        setError(null);
        setLoading(true);

        const res = await client.agent.getPostThread({ uri: uri }, opts);
        const { thread } = res.data;

        if (!AppBskyFeedDefs.isThreadViewPost(thread)) {
          throw new BlueskyReactError(
            `cannot get thread view post in usePostLazy`
          );
        }

        const post = thread.post;
        merge(new Map<string, PostView>([[post.uri, post]]));

        setPost(post);

        return post as PostView;
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

    const newPost = posts.get(post.uri);

    if (newPost) {
      setPost(newPost);
    }
  }, [post, posts]);

  return { post, fetchPost, loading, error };
}
