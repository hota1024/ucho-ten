import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface RepostedbyStoreState {
    profiles: Map<string, ProfileViewDetailed[]>;
}

export interface RepostedbyStoreAction {
    merge(profiles: Map<string, ProfileViewDetailed[]>): void;
}

export const useRepostedBysStore = create<RepostedbyStoreState & RepostedbyStoreAction>(
    (set, get) => ({
        profiles: new Map(),
        merge(profiles) {
            set({
                profiles: new Map([...get().profiles, ...profiles]),
            });
        },
    })
);
