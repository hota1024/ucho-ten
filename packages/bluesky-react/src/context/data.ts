import { AtpSessionData } from "@atproto/api";
import { AuthState, Client } from "../client";

export interface BlueskyContextData {
  client?: Client;
  // session: AtpSessionData | null
  // authState: AuthState
}

export const defaultData: BlueskyContextData = {};
