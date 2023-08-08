import { AuthState, ClientInterface } from "@/client";

/**
 * useSession return.
 */
export interface UseSessionReturn {
  /**
   * login.
   */
  login: ClientInterface["login"];

  /**
   * logout.
   */
  logout: ClientInterface["logout"];

  /**
   * resume session.
   */
  resumeSession: ClientInterface["resumeSession"];

  /**
   * session.
   */
  session: ClientInterface["session"];

  /**
   * auth state.
   */
  authState: AuthState;
}
