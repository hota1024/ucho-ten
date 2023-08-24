import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";



/**
 * useProfileLazy options.
 */
export interface UseProfileLazyOpts {}

/**
 * useProfileLazy return.
 */
export interface UseProfileLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    suggestions?: ProfileView[] | null;

    /**
     * fetch profile and update states.
     */
    fetchSuggestions(
        limit?: number | null,
        cursor?: string | null
    ): Promise<ProfileView[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
