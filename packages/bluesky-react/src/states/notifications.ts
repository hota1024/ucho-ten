import { type Notification } from "@atproto/api/dist/client/types/app/bsky/notification/list";
import { create } from "zustand";


export interface NotificationsStoreState {
    combinedNotifications: Map<string, Notification[]>;
}

export interface NotificationsStoreAction {
    merge(combinedNotifications: Map<string, Notification[]>): void;
}

export const useNotificationsStore = create<NotificationsStoreState & NotificationsStoreAction>(
    (set, get) => ({
        combinedNotifications: new Map(),
        merge(combinedNotifications) {
            set({
                combinedNotifications: new Map([...get().combinedNotifications, ...combinedNotifications]),
            });
        },
    })
);
