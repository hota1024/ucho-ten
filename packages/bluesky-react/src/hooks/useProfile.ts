import { AppBskyActorGetProfile } from "@atproto/api";
import { useClient } from "./useClient";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useProfilesStore } from "../states";
import { useSession } from "./useSession";

export interface UseProfileOpts extends AppBskyActorGetProfile.CallOptions {}

export function useProfile(
  params: AppBskyActorGetProfile.QueryParams,
  opts?: UseProfileOpts
) {
  const client = useClient();

  const { session } = useSession();
  const { profiles, merge } = useProfilesStore();

  const [did, setDid] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const profile = useMemo(
    () => (did ? profiles.get(did) : null),
    [did, profiles]
  );

  const getProfile = useCallback(async () => {
    if (!session) {
      return;
    }

    // merge(new Map([]));

    console.log("OK");

    // client.agent
    //   .getProfile(params, opts)
    //   .then(({ data }) => {
    //     merge(new Map([[data.did, data]]));
    //     setDid(data.did);
    //   })
    //   .catch((error) => {
    //     setError(error);
    //   });
  }, [params, opts]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return { profile, error };
}

export function useProfileLazy() {
  const { profiles, merge } = useProfilesStore();
  const [did, setDid] = useState<string | null>(null);

  const fetch = useCallback(
    async (params: AppBskyActorGetProfile.QueryParams) => {},
    []
  );

  return { fetch };
}
