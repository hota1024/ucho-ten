import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * useSuggestionsLazy options.
 */
export interface UseSearchActorsLazy {}

/**
 * useSuggestionsLazy return.
 */
export interface UseSearchActorsLazyReturn {
  /**
   * `ProfileViewDetailed[]` state.
   */
  searchActors?: ProfileViewDetailed[] | null;

  /**
   * fetch profile and update states.
   */
  fetchSearchActors(
      term?:string,
      cursor?:string,
      limit?:number
  ): Promise<ProfileViewDetailed[]>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
