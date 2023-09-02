import type { AppBskyActorGetProfile } from "@atproto/api";
import type { InviteCode } from "@atproto/api/src/client/types/com/atproto/server/defs";

/**
 * useProfile options.
 */
export interface UseInviteCodesOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseInviteCodesReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    inviteCodes?: InviteCode[] | null;

    /**
     * fetch profile and update states.
     */
    fetchInviteCodes(): Promise<void>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
