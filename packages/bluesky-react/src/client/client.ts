import { AtpAgentLoginOpts, AtpSessionData, BskyAgent } from "@atproto/api";
import { ClientInterface } from "./interface";
import { Emitter, EventHandler, EventUnsubscribe } from "./emmiter";
import { InvalidIdentifierOrPassword } from "../errors";

export class Client implements ClientInterface {
  #eventSessionChanged = new Emitter<AtpSessionData | null>();

  /**
   * @param agent `BskyAgent` instance of `@atproto/api`
   */
  constructor(public readonly agent: BskyAgent) {}

  onSessionChanged(
    handler: EventHandler<AtpSessionData | null>
  ): EventUnsubscribe {
    return this.#eventSessionChanged.on(handler);
  }

  async login(opts: AtpAgentLoginOpts): Promise<AtpSessionData> {
    try {
      const { data } = await this.agent.login(opts);

      this.#eventSessionChanged.emit(data);

      return data;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid identifier or password"
      ) {
        throw new InvalidIdentifierOrPassword();
      } else {
        throw error;
      }
    }
  }

  logout(): void {
    this.agent.session = undefined;

    this.#eventSessionChanged.emit(null);
  }
}
