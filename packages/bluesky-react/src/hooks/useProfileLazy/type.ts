import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

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
  profile?: ProfileViewDetailed | null;

  /**
   * fetch profile and update states.
   */
  fetchProfile(
    params?: AppBskyActorGetProfile.QueryParams,
    opts?: AppBskyActorGetProfile.CallOptions
  ): Promise<ProfileViewDetailed>;

  /**
   * loading.
   */
  loading: boolean;

  /**
   * error state.
   */
  error: unknown;
}
