import { Client } from "../client";

export interface BlueskyContextData {
  client?: Client;
}

export const defaultData: BlueskyContextData = {};
