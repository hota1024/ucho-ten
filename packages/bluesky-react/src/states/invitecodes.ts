import type { InviteCode } from "@atproto/api/src/client/types/com/atproto/server/defs";
import { create } from "zustand";

export interface InviteCodesStoreState {
    combinedInviteCodes: Map<string, InviteCode[]>;
}

export interface InviteCodesStoreAction {
    merge(combinedInviteCodes: Map<string, InviteCode[]>): void;
}

export const useInviteCodesStore = create<InviteCodesStoreState & InviteCodesStoreAction>(
    (set, get) => ({
        combinedInviteCodes: new Map(),
        merge(combinedInviteCodes) {
            set({
                combinedInviteCodes: new Map([...get().combinedInviteCodes, ...combinedInviteCodes]),
            });
        },
    })
);
