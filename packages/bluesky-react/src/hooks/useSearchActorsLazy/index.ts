import type { AppBskyActorSearchActors } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";

import type { UseSearchActorsLazyReturn } from "./type";
import { useSearchActorsStore } from "@/states";

/**
 * returns user InviteCodes state and fetch function.
 *
 * @param params
 * @param opts `useSuggestionsLazyOpts`
 * @returns `useSuggestionsLazy`
 */
export function useSearchActorsLazy(
    params?: AppBskyActorSearchActors.QueryParams,
    opts?: AppBskyActorSearchActors.CallOptions
): UseSearchActorsLazyReturn {
  // shared states //
  const client = useClient();
  const { SearchActorsArrays, merge } = useSearchActorsStore();

  // local states //
  const [searchActors, setSearchActors] = useState<ProfileViewDetailed[] | null>(null);
  const [term, setTerm] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // functions //
  const fetchSearchActors = useCallback(
      async (
         term?: string,
         cursor?: string,
         limit?: number
      ) => {
        try {
          setError(null);
          setLoading(true);
          setTerm(term ?? null)

          const { data } = await client.agent.searchActors({term:term, cursor:cursor, limit:limit}, opts);
          const { actors } = data

          merge(new Map<string, ProfileViewDetailed[]>([[data.cursor ?? "", actors]]));

          setSearchActors(actors);
          setCursor(data.cursor ?? "");

          return actors as ProfileViewDetailed[];
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
    if (!searchActors) {
      return;
    }

    const newAppPasswords = SearchActorsArrays.get(cursor ?? "");

    if (newAppPasswords) {
      setSearchActors(newAppPasswords);
    }
  }, [searchActors, SearchActorsArrays]);

  return { searchActors, fetchSearchActors, loading, error };
}