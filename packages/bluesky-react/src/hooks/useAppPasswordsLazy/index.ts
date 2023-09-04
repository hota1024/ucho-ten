import type { ComAtprotoServerListAppPasswords } from "@atproto/api";
import type { AppPassword } from "@atproto/api/dist/client/types/com/atproto/server/listAppPasswords"
import { useCallback, useEffect, useState } from "react";

import { useClient } from "@/hooks";

import type { UseAppPasswordsLazyReturn } from "./type";
import { useAppPasswordStore } from "@/states/apppassword";

/**
 * returns user InviteCodes state and fetch function.
 *
 * @param params
 * @param opts `useInviteCodesLazyOpts`
 * @returns `useInviteCodesLazy`
 */
export function useInviteCodesLazy(
    params?: ComAtprotoServerListAppPasswords.QueryParams,
    opts?: ComAtprotoServerListAppPasswords.CallOptions
): UseAppPasswordsLazyReturn {
    // shared states //
    const client = useClient();
    const { appPasswords, merge } = useAppPasswordStore();

    // local states //
    const [appPassword, setAppPassword] = useState<AppPassword[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchAppPasswords = useCallback(
        async () => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.com.atproto.server.listAppPasswords(params,opts);
                const { passwords } = data

                merge(new Map<string, AppPassword[]>([["", passwords]]));

                setAppPassword(passwords);

                return passwords as AppPassword[];
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
        if (!appPassword) {
            return;
        }

        const newAppPasswords = appPasswords.get("");

        if (newAppPasswords) {
            setAppPassword(newAppPasswords);
        }
    }, [appPassword, appPasswords]);

    return { appPassword, fetchAppPasswords, loading, error };
}