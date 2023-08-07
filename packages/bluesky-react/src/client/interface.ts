import {
  AtpAgentLoginOpts,
  BskyAgent,
  ComAtprotoServerGetSession,
} from "@atproto/api";
import { EventHandler, EventUnsubscribe } from "./emmiter";
import { AtpSessionData } from "@atproto/api";

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
   * subscribe session change.
   *
   * @param handler handler.
   */
  onSessionChanged(
    handler: EventHandler<AtpSessionData | null>
  ): EventUnsubscribe;

  /**
   * subscribe auth state change.
   *
   * @param handler handler.
   */
  onAuthStateChanged(handler: EventHandler<AuthState>): EventUnsubscribe;

  /**
   * subscribe login.
   *
   * @param handler handler.
   */
  onLogin(handler: EventHandler<AtpSessionData>): EventUnsubscribe;

  /**
   * subscribe logout.
   *
   * @param handler handler.
   */
  onLogout(handler: EventHandler): EventUnsubscribe;

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
