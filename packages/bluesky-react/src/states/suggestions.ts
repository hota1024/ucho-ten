import type { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { create } from "zustand";

export interface SuggestionsStoreState {
    suggestionArrays: Map<string, ProfileView[]>;
}

export interface SuggestionsStoreAction {
    merge(suggestionArrays: Map<string, ProfileView[]>): void;
}

export const useSuggestionsStore = create<SuggestionsStoreState & SuggestionsStoreAction>(
    (set, get) => ({
        suggestionArrays: new Map(),
        merge(suggestionArrays) {
            set({
                suggestionArrays: new Map([...get().suggestionArrays, ...suggestionArrays]),
            });
        },
    })
);
