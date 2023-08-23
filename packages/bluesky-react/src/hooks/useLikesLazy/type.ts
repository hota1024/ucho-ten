import type { ProfileView,ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import {ComAtprotoRepoListRecords} from '@atproto/api'
import {type Like } from "@atproto/api/dist/client/types/app/bsky/feed/getLikes";


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
    like: Like[] | null
    repostedByCursor? : string | null
    atUri?: string | null


    /**
     * fetch post.
     *
     * @param uri post uri.
     * @param cid post cid.
     * @param cursor cursor.
     */
    fetchLikes(uri: string,
                    cid?: string,
                    cursor?: string): Promise<ComAtprotoRepoListRecords.Response>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
