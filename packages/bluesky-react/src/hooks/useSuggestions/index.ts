import type { AppBskyActorGetSuggestions } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import {useSuggestionsStore} from "@/states";

import type { UseSuggestionsOpts, UseSuggestionsReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyActorGetSuggestions.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useSuggestions(
    params: AppBskyActorGetSuggestions.QueryParams,
    opts?: UseSuggestionsOpts
): UseSuggestionsReturn {
    // shared states //
    const client = useClient();
    const { session } = useSession();
    const { suggestionArrays, merge } = useSuggestionsStore();

    // local states //
    const [suggestions, setSuggestions] = useState<ProfileView[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchSuggestions = useCallback(async () => {
        if (!session) {
            // returns if agent has not a session.
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { data } = await client.agent.getSuggestions(params, opts);
            const { actors } = data;

            merge(new Map<string, ProfileView[]>([["none", actors]]));

            setSuggestions(actors);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // effects //
    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    useEffect(() => {
        if (!suggestions) {
            return;
        }

        const newProfile = suggestionArrays.get("none");

        if (newProfile) {
            setSuggestions(newProfile);
        }
    }, [suggestions, suggestionArrays]);

    return { suggestions, fetchSuggestions, loading, error };
}
