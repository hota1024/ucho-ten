import type { AppBskyActorGetProfile } from "@atproto/api";
import type { InviteCode } from "@atproto/api/src/client/types/com/atproto/server/defs";
import { useCallback, useEffect, useState } from "react";

import { useClient, useSession } from "@/hooks";
import {useInviteCodesStore} from "@/states";

import type { UseInviteCodesOpts, UseInviteCodesReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyActorGetProfile.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useProfile(
    params: AppBskyActorGetProfile.QueryParams,
    opts?: UseInviteCodesOpts
): UseInviteCodesReturn {
    // shared states //
    const client = useClient();
    const { session } = useSession();
    const { combinedInviteCodes, merge } = useInviteCodesStore();

    // local states //
    const [inviteCodes, setInviteCodes] = useState<InviteCode[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchInviteCodes = useCallback(async () => {
        if (!session) {
            // returns if agent has not a session.
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const { data } = await client.agent.com.atproto.server.getAccountInviteCodes()
            const { codes } = data

            merge(new Map<string, InviteCode[]>([["", codes]]));

            setInviteCodes(codes);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // effects //
    useEffect(() => {
        fetchInviteCodes();
    }, [fetchInviteCodes]);

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
