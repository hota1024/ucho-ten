import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useEffect, useState } from "react";

import { usePostStore } from "@/states";

import { useClient } from "../useClient";
import type { UsePostLazyReturn } from "./type";

export function usePostLazy(): UsePostLazyReturn {
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
    return {} as any;
  }, []);

  // effects //
  useEffect(() => {
    // TODO: 実装する。
  }, [post, posts]);

  return { post, fetchPost, loading, error };
}
