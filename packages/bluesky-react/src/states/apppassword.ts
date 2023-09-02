import type { AppPassword } from "@atproto/api/dist/client/types/com/atproto/server/listAppPasswords"
import { create } from "zustand";

export interface AppPasswordStoreState {
    /**
     * Map<uri, PostView>
     */
    appPasswords: Map<string, AppPassword[]>;
}

export interface AppPasswordStoreAction {
    merge(appPasswords: Map<string, AppPassword[]>): void;
}

export const useAppPasswordStore = create<AppPasswordStoreState & AppPasswordStoreAction>(
    (set, get) => ({
        appPasswords: new Map(),
        merge(appPasswords) {
            set({
                appPasswords: new Map([...get().appPasswords, ...appPasswords]),
            });
        },
    })
);
