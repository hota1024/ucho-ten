import type { AppBskyActorGetProfile } from "@atproto/api";
import type { InviteCode } from "@atproto/api/src/client/types/com/atproto/server/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import {useInviteCodesStore} from "@/states";

import type { UseInviteCodesLazyOpts, UseInviteCodesLazyReturn } from "./type";


/**
 * returns user profile state and fetch function.
 *
 * @param opts `UseProfileLazyOpts`
 * @returns `UseProfileReturn`
 */
export function useProfileLazy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opts: UseInviteCodesLazyOpts = {}
): UseInviteCodesLazyReturn {
    // shared states //
    const client = useClient();
    const { combinedInviteCodes, merge } = useInviteCodesStore();

    // local states //
    const [inviteCodes, setInviteCodes] = useState<InviteCode[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchInviteCodes = useCallback(
        async () => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.com.atproto.server.getAccountInviteCodes()
                const { codes } = data

                merge(new Map<string, InviteCode[]>([["", codes]]));

                setInviteCodes(codes);

                return codes as InviteCode[];
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
        if (!inviteCodes) {
            return;
        }

        const newProfile = combinedInviteCodes.get("");

        if (newProfile) {
            setInviteCodes(newProfile);
        }
    }, [inviteCodes, combinedInviteCodes]);

    return { inviteCodes, fetchInviteCodes, loading, error };
}
