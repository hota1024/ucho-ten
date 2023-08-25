import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";


/**
 * useProfile options.
 */
export interface UseSuggestionsOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseSuggestionsReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    suggestions?: ProfileView[] | null;

    /**
     * fetch profile and update states.
     */
    fetchSuggestions(): Promise<void>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
