import type { AtpSessionData } from "@atproto/api";

/**
 * useOnLogin handler.
 */
export type UseOnLoginHandler = (session: AtpSessionData) => void;
