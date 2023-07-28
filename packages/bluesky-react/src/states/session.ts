import { AtpSessionData } from "@atproto/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthState =
  | "logging-in"
  | "logged-in"
  | "logging-out"
  | "logged-out";

export interface SessionStoreState {
  session: AtpSessionData | null;
  authState: AuthState;
}

export interface SessionStoreAction {
  setSession(session: AtpSessionData | null): void;
  setAuthState(state: AuthState): void;
}

export const useSessionStore = create<SessionStoreState & SessionStoreAction>(
  (set) => ({
    session: null,
    authState: "logged-out",
    setSession: (session) => set({ session }),
    setAuthState: (state) => set({ authState: state }),
  })
);

export const useLocalStorageSession = create(
  persist<SessionStoreState & SessionStoreAction>(
    (set) => ({
      session: null,
      authState: "logged-out",
      setSession: (session) => set({ session }),
      setAuthState: (state) => set({ authState: state }),
    }),
    {
      name: "bluesky-react/session-storage",
    }
  )
);
