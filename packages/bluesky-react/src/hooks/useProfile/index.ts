import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import { useProfilesStore } from "@/states";

import type { UseProfileOpts, UseProfileReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyActorGetProfile.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useProfile(
  params: AppBskyActorGetProfile.QueryParams,
  opts?: UseProfileOpts
): UseProfileReturn {
  // shared states //
  const client = useClient();
  const { session } = useSession();
  const { profiles, merge } = useProfilesStore();

  // local states //
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchProfile = useCallback(async () => {
    if (!session) {
      // returns if agent has not a session.
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const { data } = await client.agent.getProfile(params, opts);

      merge(new Map([[data.did, data]]));

      setProfile(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // effects //
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
