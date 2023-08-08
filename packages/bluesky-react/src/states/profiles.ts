import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface ProfileStoreState {
  profiles: Map<string, ProfileViewDetailed>;
}

export interface ProfileStoreAction {
  merge(profiles: Map<string, ProfileViewDetailed>): void;
}

export const useProfilesStore = create<ProfileStoreState & ProfileStoreAction>(
  (set, get) => ({
    profiles: new Map(),
    merge(profiles) {
      set({
        profiles: new Map([...get().profiles, ...profiles]),
      });
    },
  })
);
