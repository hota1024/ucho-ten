import { AtpSessionData } from "@atproto/api";

/**
 * PersistSessionManager interface.
 */
export interface PersistSessionManager {
  /**
   * store session.
   *
   * @param session `AtpSessionData`
   */
  store(session: AtpSessionData): void;

  /**
   * resume session, if returns session.
   */
  resume(): AtpSessionData | void | null;

  /**
   * remove session.
   */
  remove(): void;
}

export interface UsePersistSessionReturn {
  /**
   * `true` if session is confirmed. otherwise `false`.
   */
  confirmed: boolean;
}
