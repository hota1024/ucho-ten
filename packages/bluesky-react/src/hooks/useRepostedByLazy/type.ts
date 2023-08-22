import type { ProfileView,ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

/**
 * usePostLazy return.
 */
export interface UseRepostedByLazyReturn {
    /**
     * post view.
     */

    uri?: string | null
    cid?: string | null
    cursor?: string | null
    repostedBy: ProfileViewDetailed[] | null
    repostedByCursor? : string | null
    atUri?: string | null


    /**
     * fetch post.
     *
     * @param uri post uri.
     * @param cid post cid.
     * @param cursor cursor.
     */
    fetchRepostedBy(uri: string,
                    cid?: string,
                    cursor?: string): Promise<ProfileViewDetailed[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
