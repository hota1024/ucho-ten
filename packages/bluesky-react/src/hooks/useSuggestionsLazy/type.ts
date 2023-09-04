import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * useSuggestionsLazy options.
 */
export interface UseSuggestionsLazy {}

/**
 * useSuggestionsLazy return.
 */
export interface UseSuggestionsLazyReturn {
    /**
     * `ProfileView[]` state.
     */
    suggestions?: ProfileView[] | null;

    /**
     * fetch profile and update states.
     */
    fetchSuggestions(): Promise<ProfileView[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}