import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { create } from "zustand";

export interface PostStoreState {
  /**
   * Map<uri, PostView>
   */
  posts: Map<string, PostView>;
}

export interface PostStoreAction {
  merge(posts: Map<string, PostView>): void;
}

export const usePostStore = create<PostStoreState & PostStoreAction>(
  (set, get) => ({
    posts: new Map(),
    merge(posts) {
      set({
        posts: new Map([...get().posts, ...posts]),
      });
    },
  })
);
