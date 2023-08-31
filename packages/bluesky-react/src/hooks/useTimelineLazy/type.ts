import type { AppBskyFeedGetTimeline } from "@atproto/api";
import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

/**
 * useProfileLazy options.
 */
export interface useTimelineLazyOpts {}

/**
 * useProfileLazy return.
 */
export interface useTimelineLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    timeline?: FeedViewPost[] | null;
    cursor?: string | null;

    /**
     * fetch profile and update states.
     */
    fetchTimeline(
        cursor?: string,
        limit?: number,
        params?: AppBskyFeedGetTimeline.QueryParams,
        opts?: AppBskyFeedGetTimeline.CallOptions
    ): Promise<FeedViewPost[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
