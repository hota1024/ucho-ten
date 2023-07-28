import { useCallback, useEffect } from "react";
import { useClient } from "./useClient";
import {
  SessionStoreAction,
  SessionStoreState,
  useLocalStorageSession,
  useSessionStore,
} from "../states";
import { AtpAgentLoginOpts } from "@atproto/api";
import { InvalidIdentifierOrPassword } from "../errors";

function useSessionOfStore(
  useStore: () => SessionStoreState & SessionStoreAction
) {
  const client = useClient();
  const { session, setSession, authState, setAuthState } = useStore();

  useEffect(() => {
    const unsubscribe = client.onSessionChanged((session) => {
      setSession(session);
    });

    return () => unsubscribe();
  }, [client]);

  const login = useCallback(
    async (opts: AtpAgentLoginOpts) => {
      setAuthState("logging-in");

      try {
        const result = await client.login(opts);
        setAuthState("logged-in");

        return result;
      } catch (error) {
        if (error instanceof InvalidIdentifierOrPassword) {
          setAuthState("logged-out");
        }

        throw error;
      }
    },
    [client]
  );

  const logout = useCallback(async () => {
    setAuthState("logging-out");
    const result = await client.logout();
    setAuthState("logged-out");

    return result;
  }, [client]);

  return { login, logout, session, authState };
}

/**
 * returns shared session data and login function.
 *
 * @returns `AtpSessionData` with login, logout methods.
 */
export function useSession() {
  return useSessionOfStore(useSessionStore);
}

/**
 * returns shared persist session data and login function.
 *
 * @returns `AtpSessionData` with login, logout methods.
 */
export function usePersistSession() {
  return useSessionOfStore(useLocalStorageSession);
}
