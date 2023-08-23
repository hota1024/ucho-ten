import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface FollowsStoreState {
    combinedFollows: Map<string, ProfileView[]>;
}

export interface FollowsStoreAction {
    merge(combinedFollows: Map<string, ProfileView[]>): void;
}

export const useFollowsStore = create<FollowsStoreState & FollowsStoreAction>(
    (set, get) => ({
        combinedFollows: new Map(),
        merge(combinedFollows) {
            set({
                combinedFollows: new Map([...get().combinedFollows, ...combinedFollows]),
            });
        },
    })
);
