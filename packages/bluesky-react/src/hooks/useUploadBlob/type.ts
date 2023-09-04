import type{ BlobRef } from "@atproto/lexicon";

/**
 * useSuggestionsLazy options.
 */
export interface UseSearchActorsLazy {}

/**
 * useSuggestionsLazy return.
 */
export interface UseSearchActorsLazyReturn {
    /**
     * `ProfileViewDetailed[]` state.
     */
    uploadblobs?: BlobRef | null;

    /**
     * fetch profile and update states.
     */
    uploadblob(
        term?:string,
        cursor?:string,
        limit?:number
    ): Promise<BlobRef>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}