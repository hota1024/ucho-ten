import type {BlobRef} from "@atproto/lexicon";
import { create } from "zustand";

export interface BlobStoreState {
    /**
     * Map<uri, PostView>
     */
    blobs: Map<string, BlobRef>;
}

export interface BlobStoreAction {
    merge(blobs: Map<string, BlobRef>): void;
}

export const useBlobStore = create<BlobStoreState & BlobStoreAction>(
    (set, get) => ({
        blobs: new Map(),
        merge(blobs) {
            set({
                blobs: new Map([...get().blobs, ...blobs]),
            });
        },
    })
);
