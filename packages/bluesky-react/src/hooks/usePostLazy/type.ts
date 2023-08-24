import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

/**
 * usePostLazy return.
 */
export interface UsePostLazyReturn {
  /**
   * post view.
   */
  post: PostView | null;

  /**
   * fetch post.
   *
   * @param uri post uri.
   */
  fetchPost(uri: string): Promise<PostView>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
