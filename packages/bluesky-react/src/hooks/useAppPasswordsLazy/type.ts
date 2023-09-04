import type { AppPassword } from "@atproto/api/dist/client/types/com/atproto/server/listAppPasswords"

/**
 * useInviteCodesLazy options.
 */
export interface UseAppPasswordsLazy {}

/**
 * useInviteCodesLazy return.
 */
export interface UseAppPasswordsLazyReturn {
    /**
     * `InviteCode[]` state.
     */
    appPassword?: AppPassword[] | null;

    /**
     * fetch profile and update states.
     */
    fetchAppPasswords(): Promise<AppPassword[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}