import type { AppBskyActorSearchActors } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * useProfile options.
 */
export interface UseSearchActorsOpts extends AppBskyActorSearchActors.CallOptions {}

/**
 * useProfile return.
 */
export interface UseSearchActorsReturn {
  /**
   * `ProfileViewDetailed` state.
   */
  searchActors?: ProfileViewDetailed[] | null;

  /**
   * fetch profile and update states.
   */
  fetchSearchActors(): Promise<void>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
