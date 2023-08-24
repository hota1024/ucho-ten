import type { AppBskyActorGetSuggestions } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";
import { useSuggestionsStore } from "@/states";

import type { UseProfileLazyOpts, UseProfileLazyReturn } from "./type";

/**
 * returns user profile state and fetch function.
 *
 * @param opts `UseProfileLazyOpts`
 * @returns `UseProfileReturn`
 */
export function useSuggestions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params?: AppBskyActorGetSuggestions.QueryParams,
    opts?: AppBskyActorGetSuggestions.OutputSchema
): UseProfileLazyReturn {
    // shared states //
    const client = useClient();
    const { suggestionArrays, merge } = useSuggestionsStore();

    // local states //
    const [suggestions, setSuggestions] = useState<ProfileView[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchSuggestions = useCallback(
        async ( limit?: number, cursor?: string) => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.getSuggestions({limit: limit, cursor:cursor});
                const { actors } = data;
                console.log(data)
                merge(new Map<string, ProfileView[]>([["none", actors]]));

                //setSuggestions(data);

                return actors;
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

        const newSuggestions = suggestionArrays.get("none");

        if (newSuggestions) {
            setSuggestions(newSuggestions);
        }
    }, [suggestions, suggestions]);

    return { suggestions, fetchSuggestions, loading, error };
}
