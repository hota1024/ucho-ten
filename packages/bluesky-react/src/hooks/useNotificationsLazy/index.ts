import { AppBskyFeedDefs, type AppBskyNotificationListNotifications } from "@atproto/api";
import { type Notification } from "@atproto/api/dist/client/types/app/bsky/notification/list";
import {type OutputSchema } from "@atproto/api/dist/client/types/app/bsky/graph/getFollows";
import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { useCallback, useEffect, useState } from "react";

import { BlueskyReactError } from "@/errors";
import { useClient } from "@/hooks";
import { useNotificationsStore } from "@/states";

import type { UseNotificationsLazyReturn } from "./type";

/**
 * returns user profile that specified in `params.actor`.
 *
 * @param params `AppBskyFeedGetPostThread.QueryParams`
 * @param opts `UseProfileOpts`
 * @returns `UseProfileReturn`
 */
export function useNotificationsLazy(
    params?: AppBskyNotificationListNotifications.QueryParams,
    opts?: AppBskyNotificationListNotifications.CallOptions
): UseNotificationsLazyReturn {
    // shared states //
    const client = useClient();
    const { combinedNotifications, merge } = useNotificationsStore();

    // local states //
    const [notifications, setNotifications] = useState<Notification[] | null>(null);
    const [cursor, setCursor] = useState<string | null>(null)
    const [targetDid, setTargetDid] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // functions //
    const fetchNotifications = useCallback(
        async (actor?: string, cursor?: string) => {
            try {
                setError(null);
                setLoading(true);

                const { data } = await client.agent.listNotifications({ cursor:cursor }, opts);
                const { notifications } = data
                console.log(data)
                setCursor(data?.cursor as string)
                merge(new Map<string, Notification[]>([["none", notifications as Notification[]]]));
                setNotifications(notifications as Notification[]);

                return data as never;
            } catch (error) {
                setError(error);

                throw error;
            } finally {
                setLoading(false);
            }
        },
        [client.agent, merge, opts]
    );

    // effects //
    useEffect(() => {
        if (!notifications) {
            return;
        }

        const newNotifications = combinedNotifications.get("none");

        if (newNotifications) {
            setNotifications(newNotifications);
        }
    }, [notifications, setNotifications]);

    return { notifications, cursor, fetchNotifications, loading, error };
}
