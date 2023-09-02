import type { ComAtprotoServerListAppPasswords } from "@atproto/api";
import type { AppPassword } from "@atproto/api/dist/client/types/com/atproto/server/listAppPasswords"
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";

import type { UseAppPasswordOpts, UseAppPasswordReturn } from "./type";
import { useAppPasswordStore } from "@/states/apppassword";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `ComAtprotoServerListAppPasswords.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useProfile(
    params: ComAtprotoServerListAppPasswords.QueryParams,
    opts?: UseAppPasswordOpts
): UseAppPasswordReturn {
    // shared states //
    const client = useClient();
    const { session } = useSession();
    const { appPasswords, merge } = useAppPasswordStore();

    // local states //
    const [appPassword, setAppPassword] = useState<AppPassword[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchAppPassword = useCallback(async () => {
        if (!session) {
            // returns if agent has not a session.
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { data } = await client.agent.com.atproto.server.listAppPasswords();
            const { passwords } = data;

            merge(new Map<string, AppPassword[]>([["", passwords]]));

            setAppPassword(passwords);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // effects //
    useEffect(() => {
        fetchAppPassword();
    }, [fetchAppPassword]);

    useEffect(() => {
        if (!appPassword) {
            return;
        }

        const newProfile = appPasswords.get("");

        if (newProfile) {
            setAppPassword(newProfile);
        }
    }, [appPassword, appPasswords]);

    return { appPassword, fetchAppPassword, loading, error };
}
