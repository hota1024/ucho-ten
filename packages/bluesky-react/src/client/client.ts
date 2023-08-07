import { AtpAgentLoginOpts, AtpSessionData, BskyAgent } from "@atproto/api";
import { AuthState, ClientInterface } from "./interface";
import { Emitter, EventHandler, EventUnsubscribe } from "./emmiter";
import { InvalidIdentifierOrPassword } from "../errors";

export class Client implements ClientInterface {
  #eventSessionChanged = new Emitter<AtpSessionData | null>();
  #eventAuthStateChanged = new Emitter<AuthState>();
  #eventOnLogin = new Emitter<AtpSessionData>();
  #eventOnLogout = new Emitter();

  /**
   * @param agent `BskyAgent` instance of `@atproto/api`
   */
  constructor(public readonly agent: BskyAgent) {}

  get session() {
    return this.agent.session ?? null;
  }

  onSessionChanged(
    handler: EventHandler<AtpSessionData | null>
  ): EventUnsubscribe {
    return this.#eventSessionChanged.on(handler);
  }

  onAuthStateChanged(handler: EventHandler<AuthState>): EventUnsubscribe {
    return this.#eventAuthStateChanged.on(handler);
  }

  onLogin(handler: EventHandler<AtpSessionData>): EventUnsubscribe {
    return this.#eventOnLogin.on(handler);
  }

  onLogout(handler: () => void): EventUnsubscribe {
    return this.#eventOnLogout.on(handler);
  }

  async login(opts: AtpAgentLoginOpts): Promise<AtpSessionData> {
    this.#eventAuthStateChanged.emit("logging-in");

    try {
      const { data } = await this.agent.login(opts);

      this.#eventSessionChanged.emit(data);
      this.#eventAuthStateChanged.emit("logged-in");
      this.#eventOnLogin.emit(data);

      return data;
    } catch (error) {
      this.#eventAuthStateChanged.emit("logged-out");

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

  async resumeSession(session: AtpSessionData): Promise<AtpSessionData> {
    this.#eventAuthStateChanged.emit("logging-in");

    try {
      const { data } = await this.agent.resumeSession(session);
      const newSession = { ...session, ...data };

      this.#eventSessionChanged.emit(newSession);
      this.#eventAuthStateChanged.emit("logged-in");

      return newSession;
    } catch (error) {
      this.#eventAuthStateChanged.emit("logged-out");

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
    this.#eventAuthStateChanged.emit("logged-out");
    this.#eventOnLogout.emit({});
  }
}
