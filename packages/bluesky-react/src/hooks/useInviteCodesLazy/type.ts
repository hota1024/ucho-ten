import type { ComAtprotoServerGetAccountInviteCodes } from "@atproto/api";
import type { InviteCode } from "@atproto/api/src/client/types/com/atproto/server/defs";

/**
 * useInviteCodesLazy options.
 */
export interface UseInviteCodesLazyOpts {}

/**
 * useInviteCodesLazy return.
 */
export interface UseInviteCodesLazyReturn {
    /**
     * `InviteCode[]` state.
     */
    inviteCodes?: InviteCode[] | null;

    /**
     * fetch profile and update states.
     */
    fetchInviteCodes(): Promise<InviteCode[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
