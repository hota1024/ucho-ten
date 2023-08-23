import type { AppBskyActorGetProfile } from "@atproto/api";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { type Notification } from "@atproto/api/dist/client/types/app/bsky/notification/list";



/**
 * useProfile options.
 */
export interface UseFollowersLazyOpts extends AppBskyActorGetProfile.CallOptions {}

/**
 * useProfile return.
 */
export interface UseNotificationsLazyReturn {
    /**
     * `ProfileViewDetailed` state.
     */
    notifications?: Notification[] | null;
    cursor?: string | null;

    /**
     * fetch profile and update states.
     */
    fetchNotifications(actor?: string, cursor?:string): Promise<Notification[]>;

    /**
     * loading.
     */
    loading: boolean;

    /**
     * error state.
     */
    error: unknown;
}
