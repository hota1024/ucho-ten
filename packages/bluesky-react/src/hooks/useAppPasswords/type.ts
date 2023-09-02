import type { ComAtprotoServerListAppPasswords } from "@atproto/api";
import type { AppPassword } from "@atproto/api/dist/client/types/com/atproto/server/listAppPasswords"

/**
 * useProfile options.
 */
export interface UseAppPasswordOpts extends ComAtprotoServerListAppPasswords.CallOptions {}

/**
 * useProfile return.
 */
export interface UseAppPasswordReturn {
    /**
     * `AppPassword` state.
     */
    appPassword?: AppPassword[] | null;

    /**
     * fetch AppPassword and update states.
     */
    fetchAppPassword(): Promise<void>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
