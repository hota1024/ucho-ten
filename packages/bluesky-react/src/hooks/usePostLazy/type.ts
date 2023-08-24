import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * usePostLazy return.
 */
export interface UsePostLazyReturn {
  /**
   * post view.
   */
  seggestions: ProfileView[] | null;

  /**
   * fetch post.
   *
   * @param uri post uri.
   */
  fetchPost(limit?: string, cursor?: string): Promise<ProfileView[]>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
