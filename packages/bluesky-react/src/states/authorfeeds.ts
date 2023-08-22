import type { PostView, FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { create } from "zustand";

export interface AuthorFeedStoreState {
    /**
     * Map<uri, PostView>
     */
    feeds: Map<string, FeedViewPost>;
}

export interface AuthorFeedStoreAction {
    merge(feeds: Map<string, FeedViewPost>): void;
}

export const useAuthorFeedStore = create<AuthorFeedStoreState & AuthorFeedStoreAction>(
    (set, get) => ({
        feeds: new Map(),
        merge(feeds) {
            set({
                feeds: new Map([...get().feeds, ...feeds]),
            });
        },
    })
);
