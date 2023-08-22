import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

/**
 * usePostLazy return.
 */
export interface UseAuthorFeedLazyReturn {
    /**
     * post view.
     */
    authorfeed: FeedViewPost | [];
    cursor: string | null;

    /**
     * fetch post.
     *
     * @param actor author handle or did.
     * @param cursor cursor.
     */
    fetchAuthorFeed(actor: string,
                    cursor: string,
                    ): Promise<FeedViewPost>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
