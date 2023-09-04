import type { AppBskyActorGetSuggestions } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";

import type { UseSuggestionsLazyReturn } from "./type";
import { useSuggestionsStore } from "@/states";

/**
 * returns user InviteCodes state and fetch function.
 *
 * @param params
 * @param opts `useSuggestionsLazyOpts`
 * @returns `useSuggestionsLazy`
 */
export function useSuggestionsLazy(
    params?: AppBskyActorGetSuggestions.QueryParams,
    opts?: AppBskyActorGetSuggestions.CallOptions
): UseSuggestionsLazyReturn {
    // shared states //
    const client = useClient();
    const { suggestionArrays, merge } = useSuggestionsStore();

    // local states //
    const [suggestions, setSuggestions] = useState<ProfileView[] | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchSuggestions = useCallback(
        async () => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.getSuggestions(params, opts);
                const { actors } = data

                merge(new Map<string, ProfileView[]>([[data.cursor ?? "", actors]]));

                setSuggestions(actors);
                setCursor(data.cursor ?? "");
                
                return actors as ProfileView[];
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
        if (!suggestions) {
            return;
        }

        const newAppPasswords = suggestionArrays.get(cursor ?? "");

        if (newAppPasswords) {
            setSuggestions(newAppPasswords);
        }
    }, [suggestions, suggestionArrays]);

    return { suggestions, fetchSuggestions, loading, error };
}