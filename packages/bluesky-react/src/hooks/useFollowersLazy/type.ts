import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";


/**
 * useProfile options.
 */
export interface UseFollowersLazyOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseFollowersLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    followers?: ProfileView[] | null;
    cursor?: string | null;

    /**
     * fetch profile and update states.
     */
    fetchFollowers(actor: string, cursor?:string): Promise<ProfileView[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
