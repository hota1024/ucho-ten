import type { ComAtprotoRepoUploadBlob } from "@atproto/api";
import type{ BlobRef } from "@atproto/lexicon";

/**
 * useProfile options.
 */
export interface UseUploadBlobOpts extends ComAtprotoRepoUploadBlob.CallOptions {}

/**
 * useProfile return.
 */
export interface UseUploadBlobReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    uploadblobs?: BlobRef | null;

    /**
     * fetch profile and update states.
     */
    uploadBlob(): Promise<void>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
