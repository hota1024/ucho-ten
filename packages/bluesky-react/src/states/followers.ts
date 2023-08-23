import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface FollowersStoreState {
    combinedFollowers: Map<string, ProfileView[]>;
}

export interface FollowersStoreAction {
    merge(combinedFollowers: Map<string, ProfileView[]>): void;
}

export const useFollowersStore = create<FollowersStoreState & FollowersStoreAction>(
    (set, get) => ({
        combinedFollowers: new Map(),
        merge(combinedFollowers) {
            set({
                combinedFollowers: new Map([...get().combinedFollowers, ...combinedFollowers]),
            });
        },
    })
);
