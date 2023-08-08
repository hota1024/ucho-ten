import type {
  AtpAgentLoginOpts,
  AtpSessionData,
  BskyAgent,
} from "@atproto/api";

import type { EventManager } from "./event-manager";

export type AuthState =
  | "logging-in"
  | "logged-in"
  | "logging-out"
  | "logged-out";

export interface ClientInterface {
  /**
   * `BskyAgent` instance of `@atproto/api`
   */
  readonly agent: BskyAgent;

  /**
   * session.
   */
  readonly session: AtpSessionData | null;

  /**
   * event of session.
   */
  readonly eventSessionChanged: EventManager<AtpSessionData | null>;

  /**
   * event of auth state.
   */
  readonly eventAuthStateChanged: EventManager<AuthState>;

  /**
   * event of login.
   */
  readonly eventOnLogin: EventManager<AtpSessionData>;

  /**
   * event of logout.
   */
  readonly eventOnLogout: EventManager;

  /**
   * login with credentials.
   *
   * @param opts `AtpAgentLoginOpts`
   */
  login(opts: AtpAgentLoginOpts): Promise<AtpSessionData>;

  /**
   * resume session.
   *
   * @param session `AtpSessionData`
   */
  resumeSession(session: AtpSessionData): Promise<AtpSessionData>;

  /**
   * logout.
   */
  logout(): void;
}
