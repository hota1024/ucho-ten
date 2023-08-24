import type { AppBskyActorSearchActors } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import { useSearchActorsStore } from "@/states";

import type { UseSearchActorsOpts, UseSearchActorsReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyActorGetProfile.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useSearchActors(
  params: AppBskyActorSearchActors.QueryParams,
  opts?: UseSearchActorsOpts
): UseSearchActorsReturn {
  // shared states //
  const client = useClient();
  const { session } = useSession();
  const { SearchActorsArrays, merge } = useSearchActorsStore();

  // local states //
  const [searchActors, setSearchActors] = useState<ProfileViewDetailed[] | null>(null);
  const [term, setTerm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchSearchActors = useCallback(async () => {
    if (!session) {
      // returns if agent has not a session.
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const { data } = await client.agent.searchActors(params, opts);
      const { actors } = data;

      setTerm(params?.term as string);
      merge(new Map<string, ProfileViewDetailed[]>([[params?.term as string, actors]]));

      setSearchActors(actors);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // effects //
  useEffect(() => {
    fetchSearchActors();
  }, [fetchSearchActors]);

  useEffect(() => {
    if (!searchActors) {
      return;
    }

    const newSearchActors = SearchActorsArrays.get(term as string);

    if (newSearchActors) {
      setSearchActors(newSearchActors);
    }
  }, [searchActors, SearchActorsArrays]);

  return { searchActors, fetchSearchActors, loading, error };
}
