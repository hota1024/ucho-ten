import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { create } from "zustand";

export interface TimelineStoreState {
    /**
     * Map<uri, FeedViewPost>
     */
    timelines: Map<string, FeedViewPost[]>;
}

export interface TimelineStoreAction {
    merge(timelines: Map<string, FeedViewPost[]>): void;
}

export const useTimelineStore = create<TimelineStoreState & TimelineStoreAction>(
    (set, get) => ({
        timelines: new Map(),
        merge(timelines) {
            set({
                timelines: new Map([...get().timelines, ...timelines]),
            });
        },
    })
);
