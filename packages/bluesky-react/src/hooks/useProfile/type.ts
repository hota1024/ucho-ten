import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * useProfile options.
 */
export interface UseProfileOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseProfileReturn {
  /**
   * `ProfileViewDetailed` state.
   */
  profile?: ProfileViewDetailed | null;

  /**
   * fetch profile and update states.
   */
  fetchProfile(): Promise<void>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
