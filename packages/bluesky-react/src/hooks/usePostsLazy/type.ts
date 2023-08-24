import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";


/**
 * useProfile options.
 */
export interface UsePostsLazyOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UsePostsLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    post?: PostView[] | null;

    /**
     * fetch profile and update states.
     */
    fetchPosts(uris: string[]): Promise<PostView[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
