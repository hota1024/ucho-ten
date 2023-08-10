import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";
import { useProfilesStore } from "@/states";

import type { UseProfileLazyOpts, UseProfileLazyReturn } from "./type";

/**
 * returns user profile state and fetch function.
 *
 * @param opts `UseProfileLazyOpts`
 * @returns `UseProfileReturn`
 */
export function useProfileLazy(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opts: UseProfileLazyOpts = {}
): UseProfileLazyReturn {
  // shared states //
  const client = useClient();
  const { profiles, merge } = useProfilesStore();

  // local states //
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchProfile = useCallback(
    async (
      params?: AppBskyActorGetProfile.QueryParams,
      opts?: AppBskyActorGetProfile.CallOptions
    ) => {
      try {
        setError(null);
        setLoading(true);

        const { data } = await client.agent.getProfile(params, opts);

        merge(new Map([[data.did, data]]));

        setProfile(data);

        return data;
      } catch (error) {
        setError(error);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [client.agent, merge]
  );

  // effects //
  useEffect(() => {
    if (!profile) {
      return;
    }

    const newProfile = profiles.get(profile.did);

    if (newProfile) {
      setProfile(newProfile);
    }
  }, [profile, profiles]);

  return { profile, fetchProfile, loading, error };
}
