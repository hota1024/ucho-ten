import type {
  AtpAgentLoginOpts,
  AtpSessionData,
  BskyAgent,
} from "@atproto/api";

import { InvalidIdentifierOrPassword } from "../errors";
import { EventManager } from "./event-manager";
import type { AuthState, ClientInterface } from "./interface";

export class Client implements ClientInterface {
  readonly eventSessionChanged = new EventManager<AtpSessionData | null>();
  readonly eventAuthStateChanged = new EventManager<AuthState>();
  readonly eventOnLogin = new EventManager<AtpSessionData>();
  readonly eventOnLogout = new EventManager();

  /**
   * @param agent `BskyAgent` instance of `@atproto/api`
   */
  constructor(public readonly agent: BskyAgent) {}

  get session() {
    return this.agent.session ?? null;
  }

  async login(opts: AtpAgentLoginOpts): Promise<AtpSessionData> {
    this.eventAuthStateChanged.emit("logging-in");

    try {
      const { data } = await this.agent.login(opts);

      this.eventSessionChanged.emit(data);
      this.eventAuthStateChanged.emit("logged-in");
      this.eventOnLogin.emit(data);

      return data;
    } catch (error) {
      this.eventAuthStateChanged.emit("logged-out");

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
    this.eventAuthStateChanged.emit("logging-in");

    try {
      const { data } = await this.agent.resumeSession(session);
      const newSession = { ...session, ...data };

      this.eventSessionChanged.emit(newSession);
      this.eventAuthStateChanged.emit("logged-in");

      return newSession;
    } catch (error) {
      this.eventAuthStateChanged.emit("logged-out");

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

    this.eventSessionChanged.emit(null);
    this.eventAuthStateChanged.emit("logged-out");
    this.eventOnLogout.emit();
  }
}
