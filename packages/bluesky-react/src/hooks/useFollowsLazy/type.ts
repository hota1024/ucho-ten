import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";


/**
 * useProfile options.
 */
export interface UseFollowsLazyOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseFollowsLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    follows?: ProfileView[] | null;
    cursor?: string | null;

    /**
     * fetch profile and update states.
     */
    fetchFollows(actor: string, cursor?:string): Promise<ProfileView[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
