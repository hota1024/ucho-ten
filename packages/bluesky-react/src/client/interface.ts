import { AtpAgentLoginOpts, BskyAgent } from "@atproto/api";
import { EventHandler, EventUnsubscribe } from "./emmiter";
import { AtpSessionData } from "@atproto/api";

export interface ClientInterface {
  /**
   * `BskyAgent` instance of `@atproto/api`
   */
  readonly agent: BskyAgent;

  /**
   * subscribe session change.
   */
  onSessionChanged(
    handler: EventHandler<AtpSessionData | null>
  ): EventUnsubscribe;

  /**
   * login with credentials.
   *
   * @param opts `AtpAgentLoginOpts`
   */
  login(opts: AtpAgentLoginOpts): Promise<AtpSessionData>;

  /**
   * logout.
   */
  logout(): void;
}
