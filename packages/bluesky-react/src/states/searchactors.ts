import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface SearachActorsStoreState {
  SearchActorsArrays: Map<string, ProfileViewDetailed[]>;
}

export interface SearachActorsStoreAction {
  merge(SearchActorsArrays: Map<string, ProfileViewDetailed[]>): void;
}

export const useSearchActorsStore = create<SearachActorsStoreState & SearachActorsStoreAction>(
  (set, get) => ({
      SearchActorsArrays: new Map(),
    merge(SearchActorsArrays) {
      set({
          SearchActorsArrays: new Map([...get().SearchActorsArrays, ...SearchActorsArrays]),
      });
    },
  })
);
