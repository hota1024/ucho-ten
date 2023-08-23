import {type Like } from "@atproto/api/dist/client/types/app/bsky/feed/getLikes";
import { create } from "zustand";

export interface LikesStoreState {
    likes: Map<string, Like[]>;
}

export interface LikesStoreAction {
    merge(likes: Map<string, Like[]>): void;
}

export const useLikedStore = create<LikesStoreState & LikesStoreAction>(
    (set, get) => ({
        likes: new Map(),
        merge(likes) {
            set({
                likes: new Map([...get().likes, ...likes]),
            });
        },
    })
);
